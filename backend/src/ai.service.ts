import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { ProductData } from './scraper.service';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import NodeCache from 'node-cache';

export interface AIAnalysis {
  dealScore: number;
  ethicalScore: number;
  priceAnalysis: {
    marketPosition: 'excellent' | 'good' | 'average' | 'poor';
    priceHistory: 'rising' | 'stable' | 'declining';
    recommendation: string;
    confidence: number;
  };
  insights: {
    keyStrengths: string[];
    concerns: string[];
    bestTime: string;
    recommendation: string;
  };
  sustainability: {
    score: number;
    factors: string[];
    impact: string;
  };
  alternatives: Array<{
    title: string;
    price: number;
    score: number;
    reason: string;
  }>;
  aiModel?: string; // Track which AI model was used
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private genAI!: GoogleGenerativeAI;
  private openai!: OpenAI;
  private rateLimiter: RateLimiterMemory;
  private cache: NodeCache;
  private hasValidGeminiKey: boolean;
  private hasValidOpenAIKey: boolean;

  constructor() {
    // Initialize Google Gemini AI with proper error handling
    const geminiKey = process.env.GOOGLE_AI_API_KEY;
    this.hasValidGeminiKey = !!(
      geminiKey &&
      geminiKey !== 'your_free_gemini_api_key_here' &&
      geminiKey.length > 20
    );

    // Initialize OpenAI with proper error handling
    const openaiKey = process.env.OPENAI_API_KEY;
    this.hasValidOpenAIKey = !!(
      openaiKey &&
      openaiKey !== 'your_openai_api_key_here' &&
      openaiKey.length > 20
    );

    if (this.hasValidGeminiKey && geminiKey) {
      this.genAI = new GoogleGenerativeAI(geminiKey);
      this.logger.log('✅ Google Gemini AI initialized successfully');
    } else {
      this.logger.warn('⚠️  No valid Google Gemini API key found.');
    }

    if (this.hasValidOpenAIKey && openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
      this.logger.log('✅ OpenAI initialized successfully');
    } else {
      this.logger.warn('⚠️  No valid OpenAI API key found.');
    }

    if (!this.hasValidGeminiKey && !this.hasValidOpenAIKey) {
      this.logger.warn('⚠️  No AI APIs configured. Using fallback analysis.');
      this.logger.warn(
        '📝 Get Gemini key: https://makersuite.google.com/app/apikey',
      );
      this.logger.warn(
        '📝 Get OpenAI key: https://platform.openai.com/api-keys',
      );
    }

    // Rate limiter: 10 requests per minute (free tier limit)
    this.rateLimiter = new RateLimiterMemory({
      duration: 60, // Per 60 seconds
      points: parseInt(process.env.AI_REQUESTS_PER_MINUTE) || 10,
    });

    // Cache for 30 seconds for real-time data processing
    this.cache = new NodeCache({ stdTTL: 30 });
  }

  async analyzeProduct(
    productData: ProductData,
    url: string,
  ): Promise<AIAnalysis> {
    this.logger.log(`Analyzing product: ${productData.title}`);

    // Check cache first
    const cacheKey = `analysis:${Buffer.from(url).toString('base64')}`;
    const cached = this.cache.get<AIAnalysis>(cacheKey);
    if (cached) {
      this.logger.log('📦 Using cached analysis');
      return cached;
    }

    try {
      let analysis: AIAnalysis;

      // Check if we can use AI or should use fallback
      if (this.hasValidOpenAIKey || this.hasValidGeminiKey) {
        // Check rate limit
        try {
          await this.rateLimiter.consume('ai-requests');
          analysis = await this.performAIAnalysis(productData, url);
          this.logger.log('🤖 AI analysis completed successfully');
        } catch (rateLimitError) {
          this.logger.warn(
            '⏱️  AI rate limit exceeded, using enhanced fallback',
          );
          analysis = this.getEnhancedFallbackAnalysis(productData);
          analysis.aiModel = 'fallback';
        }
      } else {
        analysis = this.getEnhancedFallbackAnalysis(productData);
        analysis.aiModel = 'fallback';
      }

      // Cache the comprehensive result
      this.cache.set(cacheKey, analysis);
      return analysis;
    } catch (error) {
      this.logger.warn(`AI analysis failed, using fallback: ${error.message}`);
      return this.getEnhancedFallbackAnalysis(productData);
    }
  }

  private async performAIAnalysis(
    productData: ProductData,
    url: string,
  ): Promise<AIAnalysis> {
    // Try OpenAI first (if available), then Gemini, then fallback

    // Try OpenAI first (GPT-4 turbo or GPT-3.5)
    if (this.hasValidOpenAIKey) {
      try {
        this.logger.log('🤖 Using OpenAI for analysis...');
        const analysis = await this.analyzeWithOpenAI(productData, url);
        analysis.aiModel = 'openai-gpt';
        return analysis;
      } catch (error) {
        this.logger.warn(`OpenAI failed: ${error.message}, trying Gemini...`);
      }
    }

    // Try Gemini as fallback
    if (this.hasValidGeminiKey) {
      try {
        this.logger.log('🤖 Using Gemini for analysis...');
        const analysis = await this.analyzeWithGemini(productData, url);
        analysis.aiModel = 'gemini-adaptive';
        return analysis;
      } catch (error) {
        this.logger.warn(`Gemini failed: ${error.message}`);
        throw error;
      }
    }

    throw new Error('No valid AI API available');
  }

  private async analyzeWithOpenAI(
    productData: ProductData,
    url: string,
  ): Promise<AIAnalysis> {
    const platform = this.detectPlatform(url);
    const platformContext = this.getPlatformContext(platform);

    const prompt = `You are an expert e-commerce analyst specializing in ethical shopping and sustainability. 
Analyze this ${platform} product comprehensively:

PRODUCT INFORMATION:
- Title: ${productData.title}
- Price: ${productData.price} ${productData.currency}
- Original Price: ${productData.originalPrice || 'Not available'}
- Customer Rating: ${productData.rating || 'No rating'}/5 (${productData.reviewCount || 0} reviews)
- Brand: ${productData.brand || 'Unknown brand'}
- Category: ${productData.category || 'General product'}
- Platform: ${platform} ${platformContext}

Provide comprehensive analysis in JSON format with:
1. dealScore (0-100): Based on price, discount, value
2. ethicalScore (0-100): Based on sustainability, labor practices, brand reputation
3. priceAnalysis: marketPosition, priceHistory, recommendation, confidence
4. insights: keyStrengths (array), concerns (array), bestTime, recommendation
5. sustainability: score, factors (array), impact
6. alternatives: 3 alternative products with title, price, score, reason

Respond with ONLY valid JSON, no additional text.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use gpt-4 if available in your account
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse OpenAI response');
  }

  private async analyzeWithGemini(
    productData: ProductData,
    url: string,
  ): Promise<AIAnalysis> {
    // Try models in order of preference
    let model: any;
    const modelNames = ['gemini-1.5-flash', 'gemini-pro', 'gemini-pro-vision'];

    for (const modelName of modelNames) {
      try {
        model = this.genAI.getGenerativeModel({ model: modelName });
        this.logger.debug(`Using Gemini model: ${modelName}`);
        break;
      } catch (e) {
        this.logger.warn(`Model ${modelName} not available, trying next...`);
      }
    }

    if (!model) {
      model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    // Detect platform for specialized analysis
    const platform = this.detectPlatform(url);
    const platformContext = this.getPlatformContext(platform);

    const prompt = `
      You are an expert e-commerce analyst specializing in ethical shopping and sustainability. 
      Analyze this ${platform} product comprehensively:

      PRODUCT INFORMATION:
      - Title: ${productData.title}
      - Price: ${productData.price} ${productData.currency}
      - Original Price: ${productData.originalPrice || 'Not available'}
      - Customer Rating: ${productData.rating || 'No rating'}/5 (${productData.reviewCount || 0} reviews)
      - Brand: ${productData.brand || 'Unknown brand'}
      - Category: ${productData.category || 'General product'}
      - Description: ${productData.description || 'No description available'}
      - Platform: ${platform} ${platformContext}
      - Product URL: ${url}

      ANALYSIS REQUIREMENTS:
      Provide a comprehensive analysis focusing on these UNIQUE aspects that competitors don't offer:

      1. ETHICAL INTELLIGENCE ANALYSIS:
      - Supply chain transparency assessment
      - Labor practices evaluation
      - Environmental impact calculation
      - Corporate social responsibility score
      - Fair trade and certification analysis

      2. ADVANCED PRICE INTELLIGENCE:
      - Real-time market position analysis
      - Price trend prediction (next 7-30 days)
      - Seasonal pricing patterns
      - Cross-platform price comparison insights
      - Hidden cost analysis (shipping, taxes, etc.)

      3. SUSTAINABILITY DEEP DIVE:
      - Carbon footprint estimation
      - Packaging sustainability score
      - Product lifecycle impact
      - Recyclability assessment
      - Sustainable alternatives scoring

      4. BRAND REPUTATION ANALYSIS:
      - ESG (Environmental, Social, Governance) score
      - Recent controversies or positive initiatives
      - Third-party certifications verification
      - Consumer trust metrics
      - Transparency index

      5. SMART PURCHASE RECOMMENDATIONS:
      - Optimal purchase timing
      - Risk assessment (price drops, product updates)
      - Value-for-money analysis
      - Long-term ownership costs
      - Resale value prediction

      Respond with a detailed JSON analysis in this EXACT format:
      
      {
        "dealScore": [0-100 number],
        "ethicalScore": [0-100 number],
        "priceAnalysis": {
          "marketPosition": "excellent|good|average|poor",
          "priceHistory": "rising|stable|declining",
          "recommendation": "[Detailed price advice with specific timing]",
          "confidence": [0-100 number]
        },
        "insights": {
          "keyStrengths": ["strength1", "strength2", "strength3"],
          "concerns": ["concern1", "concern2"],
          "bestTime": "[Specific timing advice]",
          "recommendation": "[Overall purchase recommendation]"
        },
        "sustainability": {
          "score": [0-100 number],
          "factors": ["factor1", "factor2", "factor3"],
          "impact": "[Environmental impact description]"
        },
        "alternatives": [
          {
            "title": "[Alternative product name]",
            "price": [estimated price],
            "score": [ethical score 0-100],
            "reason": "[Why this alternative is better]"
          }
        ]
      }

      Be thorough, accurate, and provide actionable insights that help users make informed ethical purchasing decisions.
    `;

    try {
      this.logger.log(
        `🤖 Sending product to Gemini AI for advanced analysis...`,
      );

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const aiAnalysis = JSON.parse(jsonMatch[0]);

      // Validate and enhance the response
      return this.validateAndEnhanceAIResponse(aiAnalysis, productData);
    } catch (error) {
      this.logger.error(`❌ Gemini AI analysis failed: ${error.message}`);
      throw error;
    }
  }

  private detectPlatform(url: string): string {
    const domain = new URL(url).hostname.toLowerCase();

    if (domain.includes('amazon')) return 'Amazon';
    if (domain.includes('flipkart')) return 'Flipkart';
    if (domain.includes('myntra')) return 'Myntra';
    if (domain.includes('ajio')) return 'Ajio';
    if (domain.includes('ebay')) return 'eBay';
    if (domain.includes('walmart')) return 'Walmart';
    if (domain.includes('target')) return 'Target';
    if (domain.includes('alibaba')) return 'Alibaba';

    return 'E-commerce';
  }

  private getPlatformContext(platform: string): string {
    const contexts = {
      Amazon: '(Global marketplace with extensive seller network)',
      Flipkart: "(India's leading e-commerce platform)",
      Myntra: '(Fashion and lifestyle platform)',
      Ajio: '(Reliance fashion platform)',
      eBay: '(Auction and marketplace platform)',
      Walmart: '(Retail giant with online presence)',
      Target: '(US retail chain)',
      Alibaba: '(B2B global trade platform)',
    };

    return contexts[platform] || '(Online marketplace)';
  }

  private validateAndEnhanceAIResponse(
    aiResponse: any,
    productData: ProductData,
  ): AIAnalysis {
    // Ensure all required fields are present with fallbacks
    return {
      dealScore: Math.max(0, Math.min(100, aiResponse.dealScore || 50)),
      ethicalScore: Math.max(0, Math.min(100, aiResponse.ethicalScore || 60)),
      priceAnalysis: {
        marketPosition: aiResponse.priceAnalysis?.marketPosition || 'average',
        priceHistory: aiResponse.priceAnalysis?.priceHistory || 'stable',
        recommendation:
          aiResponse.priceAnalysis?.recommendation ||
          'Monitor price trends before purchasing',
        confidence: Math.max(
          0,
          Math.min(100, aiResponse.priceAnalysis?.confidence || 70),
        ),
      },
      insights: {
        keyStrengths: aiResponse.insights?.keyStrengths || [
          'Product available for analysis',
        ],
        concerns: aiResponse.insights?.concerns || ['Limited data available'],
        bestTime: aiResponse.insights?.bestTime || 'When you need the product',
        recommendation:
          aiResponse.insights?.recommendation ||
          'Consider your specific needs and budget',
      },
      sustainability: {
        score: Math.max(
          0,
          Math.min(100, aiResponse.sustainability?.score || 50),
        ),
        factors: aiResponse.sustainability?.factors || [
          'General sustainability considerations',
        ],
        impact:
          aiResponse.sustainability?.impact ||
          'Environmental impact assessment in progress',
      },
      alternatives: aiResponse.alternatives || [],
      aiModel: 'gemini-adaptive',
    };
  }

  private getEnhancedFallbackAnalysis(productData: ProductData): AIAnalysis {
    this.logger.log(
      '🔄 Using enhanced fallback analysis with intelligent scoring',
    );
    return this.getFallbackAnalysis(productData);
  }

  private getFallbackAnalysis(productData: ProductData): AIAnalysis {
    // Calculate dynamic deal score based on ACTUAL product data
    let dealScore = 50; // Base score

    // Discount analysis
    if (
      productData.originalPrice &&
      productData.price < productData.originalPrice
    ) {
      const discountPercent =
        ((productData.originalPrice - productData.price) /
          productData.originalPrice) *
        100;
      if (discountPercent >= 40) dealScore += 35;
      else if (discountPercent >= 25) dealScore += 25;
      else if (discountPercent >= 15) dealScore += 15;
      else if (discountPercent >= 5) dealScore += 8;
    } else if (productData.originalPrice === productData.price) {
      dealScore -= 5; // No discount
    }

    // Rating analysis
    if (productData.rating) {
      if (productData.rating >= 4.7) dealScore += 15;
      else if (productData.rating >= 4.3) dealScore += 12;
      else if (productData.rating >= 4.0) dealScore += 8;
      else if (productData.rating >= 3.5) dealScore += 3;
      else if (productData.rating < 3.0) dealScore -= 10;
    }

    // Review count analysis - more reviews = more trustworthy
    if (productData.reviewCount) {
      if (productData.reviewCount >= 5000) dealScore += 12;
      else if (productData.reviewCount >= 1000) dealScore += 8;
      else if (productData.reviewCount >= 100) dealScore += 5;
      else if (productData.reviewCount < 5) dealScore -= 8;
    }

    // Calculate dynamic ethical score based on brand and data availability
    let ethicalScore = 55; // Base neutral score

    if (productData.brand) {
      // Known trusted brands
      const trustedBrands = [
        'Apple',
        'Samsung',
        'Sony',
        'Dell',
        'Lenovo',
        'HP',
        'Bosch',
        'Philips',
        'Panasonic',
        'LG',
      ];
      const ethicalBrands = [
        'Patagonia',
        'Allbirds',
        'Veja',
        'Warby Parker',
        'Seventh Generation',
      ];

      if (ethicalBrands.includes(productData.brand)) {
        ethicalScore += 30;
      } else if (trustedBrands.includes(productData.brand)) {
        ethicalScore += 15;
      } else {
        ethicalScore += 5; // Small boost for known brands
      }
    }

    // Data quality bonus
    if (productData.description && productData.description.length > 100)
      ethicalScore += 5;
    if (productData.rating && productData.reviewCount) ethicalScore += 5;
    if (productData.imageUrl) ethicalScore += 3;

    return {
      dealScore: Math.min(100, Math.max(0, dealScore)),
      ethicalScore: Math.min(100, Math.max(0, ethicalScore)),
      priceAnalysis: {
        marketPosition: this.inferMarketPosition(productData),
        priceHistory: 'stable',
        recommendation: this.generatePriceRecommendation(
          productData,
          dealScore,
        ),
        confidence: 65,
      },
      insights: {
        keyStrengths: this.generateStrengths(productData),
        concerns: this.generateConcerns(productData),
        bestTime: this.generateBestTime(productData),
        recommendation: this.generateOverallRecommendation(
          dealScore,
          ethicalScore,
        ),
      },
      sustainability: {
        score: Math.min(100, ethicalScore + 10),
        factors: this.generateSustainabilityFactors(productData),
        impact: this.generateEnvironmentalImpact(productData),
      },
      alternatives: this.generateFallbackAlternatives(productData),
    };
  }

  private inferMarketPosition(
    productData: ProductData,
  ): 'excellent' | 'good' | 'average' | 'poor' {
    if (productData.rating && productData.rating >= 4.5) return 'excellent';
    if (productData.rating && productData.rating >= 4.0) return 'good';
    if (productData.rating && productData.rating >= 3.5) return 'average';
    return 'average'; // Default for unknown
  }

  private generateStrengths(productData: ProductData): string[] {
    const strengths: string[] = [];

    if (productData.rating && productData.rating > 4) {
      strengths.push(`High customer rating (${productData.rating}/5)`);
    }

    if (productData.reviewCount && productData.reviewCount > 50) {
      strengths.push(
        `Well-reviewed product (${productData.reviewCount} reviews)`,
      );
    }

    if (
      productData.originalPrice &&
      productData.price < productData.originalPrice
    ) {
      const discount = Math.round(
        ((productData.originalPrice - productData.price) /
          productData.originalPrice) *
          100,
      );
      strengths.push(`Currently discounted by ${discount}%`);
    }

    if (productData.brand && productData.brand !== 'Unknown') {
      strengths.push(`Branded product: ${productData.brand}`);
    }

    if (strengths.length === 0) {
      strengths.push('Product available for analysis');
    }

    return strengths.slice(0, 4);
  }

  private generateFallbackAlternatives(
    productData: ProductData,
  ): Array<{ title: string; price: number; score: number; reason: string }> {
    const basePrice = productData.price || 100;

    return [
      {
        title: `Similar ${productData.category || 'Product'} - Budget Option`,
        price: Math.round(basePrice * 0.7),
        score: 75,
        reason: 'Lower price with good basic features',
      },
      {
        title: `Premium ${productData.category || 'Product'} Alternative`,
        price: Math.round(basePrice * 1.3),
        score: 85,
        reason: 'Higher quality with additional features',
      },
      {
        title: `Eco-friendly ${productData.category || 'Product'}`,
        price: Math.round(basePrice * 1.1),
        score: 80,
        reason: 'Sustainable option with environmental benefits',
      },
    ];
  }

  private clampScore(score: any): number {
    const num = typeof score === 'number' ? score : parseInt(score) || 60;
    return Math.max(0, Math.min(100, num));
  }

  private validateMarketPosition(
    position: any,
  ): 'excellent' | 'good' | 'average' | 'poor' {
    const validPositions = ['excellent', 'good', 'average', 'poor'];
    return validPositions.includes(position) ? position : 'average';
  }

  private validatePriceHistory(
    history: any,
  ): 'rising' | 'stable' | 'declining' {
    const validHistories = ['rising', 'stable', 'declining'];
    return validHistories.includes(history) ? history : 'stable';
  }

  async generatePricePrediction(productData: ProductData): Promise<{
    nextWeek: number;
    nextMonth: number;
    confidence: number;
    reasoning: string;
  }> {
    try {
      const currentPrice = productData.price;
      const hasDiscount =
        productData.originalPrice && productData.originalPrice > currentPrice;

      // Simple prediction logic
      let prediction = currentPrice;
      let confidence = 70;
      let reasoning = 'Based on current market trends and product data';

      if (hasDiscount) {
        // If on discount, might go back to original price
        prediction = currentPrice * 1.05;
        confidence = 60;
        reasoning =
          'Currently discounted - price may increase after sale period';
      } else {
        // Normal price fluctuation
        prediction = currentPrice * (0.95 + Math.random() * 0.1); // ±5% variation
        reasoning = 'Expected normal market fluctuation';
      }

      return {
        nextWeek: Math.round(prediction * 100) / 100,
        nextMonth:
          Math.round(prediction * (0.98 + Math.random() * 0.04) * 100) / 100,
        confidence,
        reasoning,
      };
    } catch (error) {
      this.logger.error(`Price prediction failed: ${error.message}`);
      return {
        nextWeek: productData.price,
        nextMonth: productData.price,
        confidence: 30,
        reasoning: 'Unable to generate accurate prediction',
      };
    }
  }

  private generatePriceRecommendation(
    productData: ProductData,
    dealScore: number,
  ): string {
    if (dealScore >= 85) {
      return '🎯 Excellent deal - Buy now! This is among the best prices available.';
    } else if (dealScore >= 70) {
      return '✅ Good deal - Consider purchasing. Price is below market average.';
    } else if (dealScore >= 50) {
      return '⏸️ Average price - Wait for sales or compare with competitors.';
    } else {
      return '⚠️ Above market price - Look for alternatives or wait for discounts.';
    }
  }

  private generateConcerns(productData: ProductData): string[] {
    const concerns: string[] = [];

    if (!productData.rating || productData.rating < 3.5) {
      concerns.push('Low customer rating - verify quality before purchasing');
    }

    if (!productData.reviewCount || productData.reviewCount < 10) {
      concerns.push('Limited customer reviews - insufficient feedback');
    }

    if (
      productData.price > (productData.originalPrice || productData.price * 1.2)
    ) {
      concerns.push('Price may be elevated - check for better alternatives');
    }

    if (!productData.brand || productData.brand === 'Unknown') {
      concerns.push('Unbranded or lesser-known brand - research before buying');
    }

    if (!productData.description || productData.description.length < 50) {
      concerns.push(
        'Insufficient product description - unclear specifications',
      );
    }

    if (concerns.length === 0) {
      concerns.push('No major concerns identified');
    }

    return concerns;
  }

  private generateBestTime(productData: ProductData): string {
    const month = new Date().getMonth();

    // Amazon/Flipkart major sale seasons in India
    if (month === 9 || month === 10) {
      return '🔥 Great Festive season sales coming up (Diwali)';
    } else if (month === 6 || month === 7) {
      return '🌞 Mid-year sales happening - good time to buy';
    } else if (month === 0) {
      return '🎆 New Year sales still active - discounts available';
    } else if (month === 11) {
      return '🎄 Year-end clearance sales expected soon';
    } else {
      return '📅 Monitor prices - best deals come during major shopping events';
    }
  }

  private generateOverallRecommendation(
    dealScore: number,
    ethicalScore: number,
  ): string {
    const avgScore = (dealScore + ethicalScore) / 2;

    if (avgScore >= 80) {
      return '✨ Highly recommended! Great deal with strong ethical credentials.';
    } else if (avgScore >= 65) {
      return '👍 Good option. Decent price and acceptable ethical standards.';
    } else if (avgScore >= 50) {
      return '⚖️ Neutral. Check alternatives before deciding.';
    } else {
      return '⚠️ Consider alternatives. Better options may be available.';
    }
  }

  private generateSustainabilityFactors(productData: ProductData): string[] {
    const factors: string[] = [];

    if (productData.brand) {
      factors.push(`Brand: ${productData.brand}`);
    }

    if (productData.category) {
      factors.push(`Category: ${productData.category}`);
    }

    if (
      productData.originalPrice &&
      productData.price < productData.originalPrice
    ) {
      const discount = Math.round(
        ((productData.originalPrice - productData.price) /
          productData.originalPrice) *
          100,
      );
      factors.push(`Discount available: ${discount}%`);
    }

    if (productData.reviewCount && productData.reviewCount > 1000) {
      factors.push('Popular product with many reviews');
    }

    factors.push('Product availability and delivery options');

    return factors;
  }

  private generateEnvironmentalImpact(productData: ProductData): string {
    const factors: string[] = [];

    if (
      productData.category &&
      productData.category.toLowerCase().includes('electronics')
    ) {
      factors.push('Electronics - Check for e-waste recycling programs');
    }

    if (
      productData.category &&
      productData.category.toLowerCase().includes('fashion')
    ) {
      factors.push(
        'Fashion item - Look for sustainable materials and production practices',
      );
    }

    if (productData.brand) {
      factors.push(
        `Research ${productData.brand}'s environmental sustainability reports`,
      );
    }

    factors.push('Check packaging for recycled or recyclable materials');

    return factors.join('; ');
  }
}
