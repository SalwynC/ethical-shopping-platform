"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AIScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIScraperService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const axios_1 = __importDefault(require("axios"));
let AIScraperService = AIScraperService_1 = class AIScraperService {
    constructor() {
        this.logger = new common_1.Logger(AIScraperService_1.name);
        const geminiKey = process.env.GOOGLE_AI_API_KEY;
        this.hasGeminiKey =
            geminiKey &&
                geminiKey !== 'your_free_gemini_api_key_here' &&
                geminiKey.length > 20;
        const openaiKey = process.env.OPENAI_API_KEY;
        this.hasChatGPTKey =
            openaiKey &&
                openaiKey !== 'your_openai_api_key_here' &&
                openaiKey.length > 20;
        this.chatGPTKey = openaiKey || '';
        if (this.hasChatGPTKey) {
            this.aiProvider = 'chatgpt';
            this.logger.log('✅ AI Scraper initialized with ChatGPT (OpenAI)');
        }
        else if (this.hasGeminiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(geminiKey);
            this.aiProvider = 'gemini';
            this.logger.log('✅ AI Scraper initialized with Gemini AI');
        }
        else {
            this.aiProvider = 'none';
            this.logger.warn('⚠️ No valid API key - AI scraping disabled');
        }
    }
    async extractProductDataFromUrl(url) {
        if (this.aiProvider === 'none') {
            this.logger.warn('No API key - cannot use AI scraping');
            return null;
        }
        try {
            this.logger.log(`🤖 Using ${this.aiProvider.toUpperCase()} AI to extract product data from: ${url}`);
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            };
            let htmlContent = '';
            try {
                const response = await axios_1.default.get(url, {
                    headers,
                    timeout: 10000,
                    maxRedirects: 5,
                });
                htmlContent = response.data.substring(0, 50000);
                this.logger.log(`📄 Fetched ${htmlContent.length} characters of HTML`);
            }
            catch (error) {
                this.logger.warn(`Failed to fetch HTML: ${error.message}`);
            }
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
            if (this.aiProvider === 'chatgpt') {
                this.logger.log('🤖 Using ChatGPT for extraction...');
                try {
                    const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                        model: 'gpt-4-turbo-preview',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a precise web scraping assistant. Return only valid JSON with no markdown formatting.',
                            },
                            {
                                role: 'user',
                                content: prompt,
                            },
                        ],
                        temperature: 0.1,
                        max_tokens: 1000,
                    }, {
                        headers: {
                            Authorization: `Bearer ${this.chatGPTKey}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 15000,
                    });
                    aiResponse = response.data.choices[0].message.content.trim();
                    this.logger.log(`🤖 ChatGPT Response received: ${aiResponse.substring(0, 100)}...`);
                }
                catch (chatgptError) {
                    this.logger.error(`❌ ChatGPT API failed: ${chatgptError.message}`);
                    throw new Error(`ChatGPT extraction failed: ${chatgptError.message}`);
                }
            }
            else if (this.aiProvider === 'gemini') {
                this.logger.log('🤖 Using Gemini AI for extraction...');
                let model;
                const modelNames = [
                    'gemini-1.5-flash',
                    'gemini-pro',
                    'gemini-pro-vision',
                ];
                for (const modelName of modelNames) {
                    try {
                        model = this.genAI.getGenerativeModel({ model: modelName });
                        break;
                    }
                    catch (e) {
                    }
                }
                if (!model) {
                    model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
                }
                const result = await model.generateContent(prompt);
                aiResponse = result.response.text().trim();
                this.logger.log(`🤖 Gemini Response received: ${aiResponse.substring(0, 100)}...`);
            }
            else {
                throw new Error('No AI provider available - please add OPENAI_API_KEY or GOOGLE_AI_API_KEY to .env');
            }
            this.logger.log(`🤖 AI Response: ${aiResponse.substring(0, 200)}...`);
            let productData;
            try {
                const cleanedResponse = aiResponse
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();
                productData = JSON.parse(cleanedResponse);
                if (!productData.title ||
                    productData.title === 'null' ||
                    productData.title.length < 3) {
                    this.logger.warn('❌ AI extraction failed - invalid title');
                    return null;
                }
                if (!productData.price || productData.price <= 0) {
                    this.logger.warn('❌ AI extraction failed - invalid price');
                    return null;
                }
                this.logger.log(`✅ AI extracted: ${productData.title} - ₹${productData.price} (confidence: ${productData.confidence}%)`);
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
            }
            catch (parseError) {
                this.logger.error(`Failed to parse AI response: ${parseError.message}`);
                this.logger.error(`Raw response: ${aiResponse}`);
                return null;
            }
        }
        catch (error) {
            this.logger.error(`❌ AI scraping failed: ${error.message}`);
            return null;
        }
    }
    extractImageFromHtml(html) {
        if (!html)
            return undefined;
        try {
            const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
            if (ogImageMatch)
                return ogImageMatch[1];
            const twitterImageMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i);
            if (twitterImageMatch)
                return twitterImageMatch[1];
            const imgMatch = html.match(/<img[^>]*src="([^"]*product[^"]*\.(jpg|jpeg|png|webp)[^"]*)"/i);
            if (imgMatch)
                return imgMatch[1];
        }
        catch (error) {
            this.logger.warn(`Image extraction failed: ${error.message}`);
        }
        return undefined;
    }
};
exports.AIScraperService = AIScraperService;
exports.AIScraperService = AIScraperService = AIScraperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AIScraperService);
//# sourceMappingURL=ai-scraper.service.js.map