import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export interface RealProductData {
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  availability: string;
  imageUrl?: string;
  description?: string;
  specifications?: Record<string, string>;
  features?: string[];
}

@Injectable()
export class AIScraperService {
  private readonly logger = new Logger(AIScraperService.name);
  private genAI: GoogleGenerativeAI;
  private hasGeminiKey: boolean;
  private hasChatGPTKey: boolean;
  private chatGPTKey: string;
  private aiProvider: 'gemini' | 'chatgpt' | 'none';

  constructor() {
    // Check Gemini AI key
    const geminiKey = process.env.GOOGLE_AI_API_KEY;
    this.hasGeminiKey =
      geminiKey &&
      geminiKey !== 'your_free_gemini_api_key_here' &&
      geminiKey.length > 20;

    // Check ChatGPT/OpenAI key
    const openaiKey = process.env.OPENAI_API_KEY;
    this.hasChatGPTKey =
      openaiKey &&
      openaiKey !== 'your_openai_api_key_here' &&
      openaiKey.length > 20;
    this.chatGPTKey = openaiKey || '';

    // Determine which AI to use (ChatGPT preferred if both available)
    if (this.hasChatGPTKey) {
      this.aiProvider = 'chatgpt';
      this.logger.log('✅ AI Scraper initialized with ChatGPT (OpenAI)');
    } else if (this.hasGeminiKey) {
      this.genAI = new GoogleGenerativeAI(geminiKey);
      this.aiProvider = 'gemini';
      this.logger.log('✅ AI Scraper initialized with Gemini AI');
    } else {
      this.aiProvider = 'none';
      this.logger.warn('⚠️ No valid API key - AI scraping disabled');
    }
  }

  async extractProductDataFromUrl(
    url: string,
  ): Promise<RealProductData | null> {
    if (this.aiProvider === 'none') {
      this.logger.warn('No API key - cannot use AI scraping');
      return null;
    }

    try {
      this.logger.log(
        `🤖 Using ${this.aiProvider.toUpperCase()} AI to extract product data from: ${url}`,
      );

      // Step 1: Fetch the raw HTML (even if JavaScript-rendered, we get some metadata)
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      };

      let htmlContent = '';
      try {
        const response = await axios.get(url, {
          headers,
          timeout: 10000,
          maxRedirects: 5,
        });
        htmlContent = response.data.substring(0, 50000); // Get first 50KB
        this.logger.log(`📄 Fetched ${htmlContent.length} characters of HTML`);
      } catch (error) {
        this.logger.warn(`Failed to fetch HTML: ${error.message}`);
        // Continue anyway - AI can work with URL alone
      }

      // Step 2: Use AI (ChatGPT or Gemini) to intelligently extract product information
      const prompt = `You are a precise web scraper. Extract ONLY real product information from this URL and HTML content.

URL: ${url}

HTML Content (partial):
${htmlContent || 'No HTML available - analyze URL structure'}

CRITICAL INSTRUCTIONS:
1. Extract REAL product data ONLY - never make up information
2. If you cannot find specific data, return null or 0 for that field
3. Focus on: product title, current price, original price, brand, category, rating, review count
4. For prices: Look for numbers near ₹, Rs., or INR symbols
5. For title: Look for h1 tags, product-title classes, or og:title meta tags
6. Be EXTREMELY precise - if unsure, leave blank

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "title": "exact product title from page",
  "price": actual_number_only,
  "originalPrice": actual_number_or_null,
  "currency": "INR",
  "brand": "brand name or null",
  "category": "category or null",
  "rating": number_or_null,
  "reviewCount": number_or_null,
  "availability": "in_stock" or "out_of_stock" or "unknown",
  "description": "brief description or null",
  "confidence": number_0_to_100
}

Extract NOW - return ONLY the JSON object:`;

      let aiResponse = '';

      // Choose AI provider based on availability (ChatGPT preferred)
      if (this.aiProvider === 'chatgpt') {
        this.logger.log('🤖 Using ChatGPT for extraction...');
        try {
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-4-turbo-preview',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are a precise web scraping assistant. Return only valid JSON with no markdown formatting.',
                },
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              temperature: 0.1,
              max_tokens: 1000,
            },
            {
              headers: {
                Authorization: `Bearer ${this.chatGPTKey}`,
                'Content-Type': 'application/json',
              },
              timeout: 15000,
            },
          );

          aiResponse = response.data.choices[0].message.content.trim();
          this.logger.log(
            `🤖 ChatGPT Response received: ${aiResponse.substring(0, 100)}...`,
          );
        } catch (chatgptError) {
          this.logger.error(`❌ ChatGPT API failed: ${chatgptError.message}`);
          throw new Error(`ChatGPT extraction failed: ${chatgptError.message}`);
        }
      } else if (this.aiProvider === 'gemini') {
        this.logger.log('🤖 Using Gemini AI for extraction...');
        // Try models in order of preference
        let model: any;
        const modelNames = [
          'gemini-1.5-flash',
          'gemini-pro',
          'gemini-pro-vision',
        ];

        for (const modelName of modelNames) {
          try {
            model = this.genAI.getGenerativeModel({ model: modelName });
            break;
          } catch (e) {
            // Try next model
          }
        }

        if (!model) {
          model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        }
        const result = await model.generateContent(prompt);
        aiResponse = result.response.text().trim();
        this.logger.log(
          `🤖 Gemini Response received: ${aiResponse.substring(0, 100)}...`,
        );
      } else {
        throw new Error(
          'No AI provider available - please add OPENAI_API_KEY or GOOGLE_AI_API_KEY to .env',
        );
      }

      this.logger.log(`🤖 AI Response: ${aiResponse.substring(0, 200)}...`);

      // Parse AI response
      let productData: any;
      try {
        // Remove markdown code blocks if present
        const cleanedResponse = aiResponse
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        productData = JSON.parse(cleanedResponse);

        // Validate extracted data
        if (
          !productData.title ||
          productData.title === 'null' ||
          productData.title.length < 3
        ) {
          this.logger.warn('❌ AI extraction failed - invalid title');
          return null;
        }

        if (!productData.price || productData.price <= 0) {
          this.logger.warn('❌ AI extraction failed - invalid price');
          return null;
        }

        this.logger.log(
          `✅ AI extracted: ${productData.title} - ₹${productData.price} (confidence: ${productData.confidence}%)`,
        );

        // Return structured data
        return {
          title: productData.title,
          price: parseFloat(productData.price),
          originalPrice: productData.originalPrice
            ? parseFloat(productData.originalPrice)
            : undefined,
          currency: productData.currency || 'INR',
          brand: productData.brand || undefined,
          category: productData.category || undefined,
          rating: productData.rating
            ? parseFloat(productData.rating)
            : undefined,
          reviewCount: productData.reviewCount
            ? parseInt(productData.reviewCount)
            : undefined,
          availability: productData.availability || 'unknown',
          description: productData.description || undefined,
          imageUrl: this.extractImageFromHtml(htmlContent),
        };
      } catch (parseError) {
        this.logger.error(`Failed to parse AI response: ${parseError.message}`);
        this.logger.error(`Raw response: ${aiResponse}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`❌ AI scraping failed: ${error.message}`);
      return null;
    }
  }

  private extractImageFromHtml(html: string): string | undefined {
    if (!html) return undefined;

    try {
      // Look for common image patterns
      const ogImageMatch = html.match(
        /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i,
      );
      if (ogImageMatch) return ogImageMatch[1];

      const twitterImageMatch = html.match(
        /<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i,
      );
      if (twitterImageMatch) return twitterImageMatch[1];

      // Look for large product images
      const imgMatch = html.match(
        /<img[^>]*src="([^"]*product[^"]*\.(jpg|jpeg|png|webp)[^"]*)"/i,
      );
      if (imgMatch) return imgMatch[1];
    } catch (error) {
      this.logger.warn(`Image extraction failed: ${error.message}`);
    }

    return undefined;
  }
}
