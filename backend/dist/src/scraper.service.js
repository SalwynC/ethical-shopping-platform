"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const generative_ai_1 = require("@google/generative-ai");
const real_data_service_1 = require("./real-data.service");
const ai_scraper_service_1 = require("./services/ai-scraper.service");
const html_scraper_service_1 = require("./services/html-scraper.service");
const crypto = __importStar(require("crypto"));
let ScraperService = ScraperService_1 = class ScraperService {
    constructor() {
        this.logger = new common_1.Logger(ScraperService_1.name);
        this.requestDelay = 1000;
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        this.hasValidApiKey = apiKey && apiKey !== 'your_free_gemini_api_key_here' && apiKey.length > 20;
        if (this.hasValidApiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
        this.realDataService = new real_data_service_1.RealDataService();
        this.aiScraperService = new ai_scraper_service_1.AIScraperService();
        this.htmlScraperService = new html_scraper_service_1.HtmlScraperService();
        this.sessionCookies = new Map();
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ];
    }
    async scrapeProduct(url, retryCount = 0) {
        this.logger.log(`🔍 Advanced scraping from: ${url}`);
        try {
            this.logger.log('🌐 Step 1: Attempting DIRECT HTML scraping...');
            try {
                const scrapedData = await this.htmlScraperService.scrapeProductPage(url);
                if (scrapedData.title && scrapedData.price && scrapedData.price > 0) {
                    this.logger.log(`✅ HTML SCRAPING SUCCESS: ${scrapedData.title} - ${scrapedData.currency} ${scrapedData.price}`);
                    return {
                        title: scrapedData.title,
                        price: scrapedData.price,
                        originalPrice: scrapedData.originalPrice || undefined,
                        currency: scrapedData.currency,
                        rating: scrapedData.rating || undefined,
                        reviewCount: scrapedData.reviewCount || undefined,
                        availability: scrapedData.availability,
                        imageUrl: scrapedData.images[0] || undefined,
                        productId: this.extractProductId(url),
                        description: scrapedData.description || undefined,
                        brand: scrapedData.brand || undefined,
                        category: this.detectCategory(url, scrapedData.title),
                        features: [],
                        specifications: scrapedData.specifications,
                    };
                }
                this.logger.warn('⚠️ HTML scraping returned incomplete data, trying AI methods...');
            }
            catch (htmlError) {
                this.logger.warn(`⚠️ HTML scraping failed: ${htmlError.message}`);
            }
            if (this.hasValidApiKey && retryCount === 0) {
                this.logger.log('🤖 Step 2: Attempting AI-powered extraction...');
                const aiData = await this.aiScraperService.extractProductDataFromUrl(url);
                if (aiData && aiData.title && aiData.price > 0) {
                    this.logger.log(`✅ AI extraction successful: ${aiData.title} - ₹${aiData.price}`);
                    return {
                        title: aiData.title,
                        price: aiData.price,
                        originalPrice: aiData.originalPrice,
                        currency: aiData.currency || 'INR',
                        rating: aiData.rating,
                        reviewCount: aiData.reviewCount,
                        availability: aiData.availability || 'unknown',
                        imageUrl: aiData.imageUrl,
                        productId: this.extractProductId(url),
                        description: aiData.description,
                        brand: aiData.brand,
                        category: aiData.category,
                        features: aiData.features || [],
                        specifications: aiData.specifications || {},
                    };
                }
                else {
                    this.logger.warn('⚠️ AI extraction returned incomplete data, trying fallback methods...');
                }
            }
            this.logger.log('🔧 Step 3: Attempting traditional scraping...');
            if (retryCount > 0) {
                await this.delay(this.requestDelay * Math.pow(2, retryCount));
            }
            const headers = this.generateRealisticHeaders(url);
            const platform = this.detectPlatform(url);
            const response = await this.makeEnhancedRequest(url, headers, platform);
            const $ = cheerio.load(response.data);
            if (this.isBlocked(response.data, $)) {
                this.logger.warn('🚫 Bot detection encountered, implementing evasion...');
                if (retryCount < 3) {
                    return this.scrapeProduct(url, retryCount + 1);
                }
                else {
                    throw new Error('Maximum retry attempts reached - site blocking detected');
                }
            }
            let productData;
            switch (platform.toLowerCase()) {
                case 'amazon':
                    productData = await this.scrapeAmazon($, url);
                    break;
                case 'flipkart':
                    productData = await this.scrapeFlipkart($, url);
                    break;
                case 'myntra':
                    productData = await this.scrapeMyntra($, url);
                    break;
                case 'ajio':
                    productData = await this.scrapeAjio($, url);
                    break;
                default:
                    productData = await this.scrapeGeneric($, url);
            }
            const hasGoodData = productData.title &&
                productData.title !== 'Amazon Product' &&
                productData.title !== 'Flipkart Product' &&
                productData.title !== 'Product' &&
                productData.price > 0;
            if (!hasGoodData) {
                this.logger.warn('⚠️ Scraping returned poor data, trying real data service...');
                const realData = await this.realDataService.getRealProductData(url, platform);
                if (realData) {
                    this.logger.log(`✅ Using real data: ${realData.title}`);
                    productData = realData;
                }
            }
            if (this.hasValidApiKey) {
                productData = await this.enhanceWithAI(productData, $);
            }
            this.logger.log(`✅ Final product data: ${productData.title} - ${productData.currency} ${productData.price}`);
            return productData;
        }
        catch (error) {
            this.logger.error(`❌ Scraping failed: ${error.message}`);
            this.logger.log('🔄 Attempting to get real data from fallback service...');
            const platform = this.detectPlatform(url);
            const realData = await this.realDataService.getRealProductData(url, platform);
            if (realData) {
                this.logger.log(`✅ Got real fallback data: ${realData.title}`);
                return realData;
            }
            return {
                title: 'Product Analysis Failed',
                price: 0,
                currency: 'INR',
                availability: 'unknown',
                productId: this.extractProductId(url),
                category: 'Unknown',
                brand: 'Unknown',
            };
        }
    }
    async scrapeAmazon($, url) {
        var _a, _b;
        this.logger.log('🏪 Extracting Amazon product data...');
        const title = $('#productTitle').text().trim() ||
            $('.product-title').text().trim() ||
            $('h1').first().text().trim();
        const priceSelectors = [
            '.a-price-whole',
            '.a-price .a-offscreen',
            '.a-price-range .a-price .a-offscreen',
            '.a-price.a-text-price .a-offscreen',
            '.a-price-symbol + .a-price-whole',
            '#corePrice_feature_div .a-price .a-offscreen',
            '.a-price-current .a-offscreen',
            '.a-color-price',
            '.price',
            '[data-automation-id="price"]',
            '.a-text-strike .a-offscreen'
        ];
        let price = 0;
        for (const selector of priceSelectors) {
            const priceElement = $(selector).first();
            if (priceElement.length > 0) {
                const priceText = priceElement.text().replace(/[^0-9.,]/g, '').replace(',', '');
                const parsedPrice = parseFloat(priceText);
                if (!isNaN(parsedPrice) && parsedPrice > 0) {
                    price = parsedPrice;
                    this.logger.log(`💰 Found price using selector: ${selector} = ₹${price}`);
                    break;
                }
            }
        }
        if (price === 0) {
            const allText = $('body').text();
            const priceMatches = allText.match(/₹\s*[\d,]+(?:\.\d{2})?/g) ||
                allText.match(/Rs\.\s*[\d,]+(?:\.\d{2})?/g) ||
                allText.match(/\$\s*[\d,]+(?:\.\d{2})?/g);
            if (priceMatches && priceMatches.length > 0) {
                const extractedPrice = parseFloat(priceMatches[0].replace(/[^0-9.]/g, ''));
                if (!isNaN(extractedPrice)) {
                    price = extractedPrice;
                    this.logger.log(`💰 Extracted price from text: ₹${price}`);
                }
            }
        }
        const originalPriceText = $('.a-price.a-text-price .a-offscreen').text().replace(/[^0-9.]/g, '') ||
            $('.a-text-strike').text().replace(/[^0-9.]/g, '') ||
            $('#listPriceValue').text().replace(/[^0-9.]/g, '');
        const rating = parseFloat(((_a = $('.a-icon-alt').first().text().match(/[\d.]+/)) === null || _a === void 0 ? void 0 : _a[0]) ||
            ((_b = $('[data-hook="average-star-rating"]').text().match(/[\d.]+/)) === null || _b === void 0 ? void 0 : _b[0]) || '0');
        const reviewCount = parseInt($('.a-link-normal').find('span').text().replace(/[^0-9]/g, '') ||
            $('[data-hook="total-review-count"]').text().replace(/[^0-9]/g, '') || '0');
        const availability = $('#availability span').text().trim() ||
            $('.availability').text().trim() ||
            $('#deliveryBlockMessage').text().trim() ||
            'In Stock';
        const imageUrl = $('#landingImage').attr('src') ||
            $('.a-dynamic-image').first().attr('src') ||
            $('img[data-a-image-name="landingImage"]').attr('src') ||
            $('#main-image img').attr('src');
        const description = $('.feature-bullets ul li').map((_, el) => $(el).text().trim()).get().join('. ') ||
            $('#feature-bullets ul li').map((_, el) => $(el).text().trim()).get().join('. ');
        const brand = $('#bylineInfo').text().trim().replace(/^Brand:\s*/i, '') ||
            $('.a-row .a-size-base').first().text().trim() ||
            $('[data-feature-name="bylineInfo"]').text().trim() ||
            'Unknown';
        const seller = $('#sellerProfileTriggerId').text().trim() ||
            $('.a-size-small.a-color-secondary').text().trim();
        const warranty = $('.a-row:contains("Warranty")').text().trim() ||
            $('[data-feature-name="warranty"]').text().trim();
        const reviews = await this.extractReviews($, 'amazon');
        const specifications = this.extractSpecifications($, 'amazon');
        return {
            title: title || 'Amazon Product',
            price: price,
            originalPrice: parseFloat(originalPriceText) || undefined,
            currency: url.includes('.in') ? 'INR' : 'USD',
            rating,
            reviewCount,
            availability,
            imageUrl,
            productId: this.extractProductId(url),
            description,
            brand,
            category: $('#nav-subnav').text().trim() || 'Unknown',
            features: description ? description.split('. ').filter(f => f.length > 10) : [],
            reviews,
            specifications,
            seller,
            warranty
        };
    }
    async scrapeFlipkart($, url) {
        var _a;
        this.logger.log('🛒 Extracting Flipkart product data...');
        const title = $('.B_NuCI').text().trim() ||
            $('._35KyD6').text().trim() ||
            $('h1').first().text().trim() ||
            $('._1h65Xx').text().trim();
        const priceSelectors = [
            '._30jeq3._16Jk6d', '._25b18c', '._3qGVVD', '._1_WHN1'
        ];
        let priceText = '';
        for (const selector of priceSelectors) {
            const price = $(selector).text().replace(/[^0-9.]/g, '');
            if (price) {
                priceText = price;
                break;
            }
        }
        const originalPriceText = $('._3I9_wc._2p6lqe').text().replace(/[^0-9.]/g, '') ||
            $('._3auQ3N').text().replace(/[^0-9.]/g, '') ||
            $('._14MKbH').text().replace(/[^0-9.]/g, '');
        const rating = parseFloat($('._3LWZlK').text() ||
            $('._3n5AXx').text() ||
            ((_a = $('[id*="rating"]').text().match(/[\d.]+/)) === null || _a === void 0 ? void 0 : _a[0]) || '0');
        const reviewCount = parseInt($('._2_R_DZ').text().replace(/[^0-9]/g, '') ||
            $('._13vcmD').text().replace(/[^0-9]/g, '') || '0');
        const availability = $('._16FRp0').text().trim() ||
            $('._1fGeJ5').text().trim() ||
            'In Stock';
        const imageUrl = $('._396cs4').attr('src') ||
            $('._2r_T1I').attr('src') ||
            $('._2amPTt img').attr('src') ||
            $('._312R1Y img').attr('src');
        const brand = $('._1nrv9j').text().trim() ||
            $('._2b4mcD').text().trim() ||
            $('._3j-qDV').text().trim() ||
            'Unknown';
        const description = $('._1AN87F').map((_, el) => $(el).text().trim()).get().join('. ') ||
            $('._3WHvuP').text().trim();
        const seller = $('._5gtYXR').text().trim() ||
            $('._1fGeJ5._1KWZFN').text().trim();
        const reviews = await this.extractReviews($, 'flipkart');
        const specifications = this.extractSpecifications($, 'flipkart');
        return {
            title: title || 'Flipkart Product',
            price: parseFloat(priceText) || 0,
            originalPrice: parseFloat(originalPriceText) || undefined,
            currency: 'INR',
            rating,
            reviewCount,
            availability,
            imageUrl,
            productId: this.extractProductId(url),
            description,
            brand,
            category: $('._1HmYoV').text().trim() || 'Unknown',
            features: description ? description.split('. ').filter(f => f.length > 10) : [],
            reviews,
            specifications,
            seller
        };
    }
    async scrapeMyntra($, url) {
        const title = $('.pdp-product-name').text().trim() ||
            $('h1').first().text().trim();
        const priceText = $('.pdp-price strong').text().replace(/[^0-9.]/g, '') ||
            $('.price').text().replace(/[^0-9.]/g, '');
        const imageUrl = $('.image-grid-image').first().attr('src');
        return {
            title: title || 'Myntra Product',
            price: parseFloat(priceText) || 0,
            currency: 'INR',
            availability: 'In Stock',
            imageUrl,
            productId: this.extractProductId(url),
            brand: 'Unknown',
            category: 'Fashion',
        };
    }
    async scrapeAjio($, url) {
        const title = $('.prod-name').text().trim() ||
            $('h1').first().text().trim();
        const priceText = $('.prod-sp').text().replace(/[^0-9.]/g, '') ||
            $('.price').text().replace(/[^0-9.]/g, '');
        return {
            title: title || 'Ajio Product',
            price: parseFloat(priceText) || 0,
            currency: 'INR',
            availability: 'In Stock',
            productId: this.extractProductId(url),
            brand: 'Unknown',
            category: 'Fashion',
        };
    }
    async scrapeGeneric($, url) {
        const titleSelectors = [
            'h1',
            '.product-title',
            '.title',
            '[data-testid*="title"]',
            '.product-name',
            '.item-title',
            '.product-heading',
            '[class*="title"]',
            '[class*="name"]'
        ];
        let title = '';
        for (const selector of titleSelectors) {
            const titleElement = $(selector).first().text().trim();
            if (titleElement && titleElement.length > 3) {
                title = titleElement;
                break;
            }
        }
        const priceSelectors = [
            '.price',
            '.cost',
            '.amount',
            '.price-current',
            '.current-price',
            '.sale-price',
            '.product-price',
            '.item-price',
            '[data-testid*="price"]',
            '[class*="price"]',
            '[id*="price"]',
            '.money',
            '.currency',
            '.cost-value'
        ];
        let price = 0;
        for (const selector of priceSelectors) {
            const priceElement = $(selector).first();
            if (priceElement.length > 0) {
                const priceText = priceElement.text().replace(/[^0-9.,]/g, '').replace(',', '');
                const parsedPrice = parseFloat(priceText);
                if (!isNaN(parsedPrice) && parsedPrice > 0) {
                    price = parsedPrice;
                    break;
                }
            }
        }
        const brandSelectors = ['.brand', '.manufacturer', '[data-testid*="brand"]', '.product-brand'];
        let brand = 'Unknown';
        for (const selector of brandSelectors) {
            const brandElement = $(selector).first().text().trim();
            if (brandElement && brandElement.length > 0) {
                brand = brandElement;
                break;
            }
        }
        let currency = 'USD';
        if (url.includes('.in') || url.includes('india'))
            currency = 'INR';
        else if (url.includes('.uk') || url.includes('britain'))
            currency = 'GBP';
        else if (url.includes('.de') || url.includes('.eu'))
            currency = 'EUR';
        return {
            title: title || 'Product',
            price: price,
            currency: currency,
            availability: 'Unknown',
            productId: this.extractProductId(url),
            brand: brand,
            category: 'Unknown',
        };
    }
    async enhanceWithAI(productData, $) {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const pageText = $('body').text().slice(0, 2000);
            const prompt = `
        Analyze this e-commerce product data and page content to enhance missing information:
        
        Product: ${productData.title}
        Price: ${productData.price} ${productData.currency}
        Current Data: ${JSON.stringify(productData)}
        
        Page Content Sample: ${pageText}
        
        Please provide enhanced information in JSON format with:
        - category (accurate product category)
        - brand (if identifiable)
        - features (array of key features)
        - description (concise product description)
        
        Return only valid JSON.
      `;
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            try {
                const enhanced = JSON.parse(response);
                return Object.assign(Object.assign({}, productData), enhanced);
            }
            catch (parseError) {
                this.logger.warn('AI enhancement parsing failed, using original data');
                return productData;
            }
        }
        catch (error) {
            this.logger.warn(`AI enhancement failed: ${error.message}`);
            return productData;
        }
    }
    detectPlatform(url) {
        const domain = new URL(url).hostname.toLowerCase();
        if (domain.includes('amazon'))
            return 'amazon';
        if (domain.includes('flipkart'))
            return 'flipkart';
        if (domain.includes('myntra'))
            return 'myntra';
        if (domain.includes('ajio'))
            return 'ajio';
        if (domain.includes('ebay'))
            return 'ebay';
        if (domain.includes('walmart'))
            return 'walmart';
        if (domain.includes('nykaa'))
            return 'nykaa';
        return 'generic';
    }
    extractProductId(url) {
        var _a;
        const patterns = [
            /\/dp\/([A-Z0-9]{10})/i,
            /\/p\/([^?]+)/i,
            /\/([0-9]+)/i,
            /product\/([^\/\?]+)/i,
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match)
                return match[1];
        }
        return ((_a = url.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0]) || 'unknown';
    }
    detectCategory(url, title) {
        const text = (url + ' ' + title).toLowerCase();
        if (text.includes('laptop') || text.includes('computer'))
            return 'Electronics';
        if (text.includes('phone') || text.includes('mobile'))
            return 'Electronics';
        if (text.includes('tv') || text.includes('television') || text.includes('monitor'))
            return 'Electronics';
        if (text.includes('shirt') || text.includes('trouser') || text.includes('dress'))
            return 'Clothing';
        if (text.includes('shoe') || text.includes('sneaker') || text.includes('boot'))
            return 'Footwear';
        if (text.includes('watch') || text.includes('jewelry'))
            return 'Accessories';
        if (text.includes('book'))
            return 'Books';
        if (text.includes('toy') || text.includes('game'))
            return 'Toys & Games';
        if (text.includes('kitchen') || text.includes('appliance'))
            return 'Home & Kitchen';
        if (text.includes('beauty') || text.includes('cosmetic'))
            return 'Beauty';
        return 'General';
    }
    generateRealisticHeaders(url) {
        const platform = this.detectPlatform(url);
        const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
        const baseHeaders = {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        };
        switch (platform.toLowerCase()) {
            case 'amazon':
                return Object.assign(Object.assign({}, baseHeaders), { 'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"', 'Sec-Ch-Ua-Mobile': '?0', 'Sec-Ch-Ua-Platform': '"Windows"' });
            case 'flipkart':
                return Object.assign(Object.assign({}, baseHeaders), { 'X-User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 FKUA/website/42/website/Desktop' });
            default:
                return baseHeaders;
        }
    }
    async makeEnhancedRequest(url, headers, platform) {
        const domain = new URL(url).hostname;
        const sessionId = crypto.randomBytes(16).toString('hex');
        const cookies = this.sessionCookies.get(domain) || '';
        if (cookies) {
            headers['Cookie'] = cookies;
        }
        const config = {
            headers,
            timeout: 20000,
            maxRedirects: 5,
            validateStatus: (status) => status < 500,
            transformResponse: [(data) => data],
        };
        await this.delay(Math.random() * 1000 + 500);
        const response = await axios_1.default.get(url, config);
        const setCookies = response.headers['set-cookie'];
        if (setCookies) {
            this.sessionCookies.set(domain, setCookies.join('; '));
        }
        return response;
    }
    isBlocked(html, $) {
        const blockingIndicators = [
            'blocked', 'captcha', 'robot', 'automation', 'bot detection',
            'access denied', 'please try again', 'something went wrong',
            'unusual traffic', 'verify you are human'
        ];
        const pageText = $('body').text().toLowerCase();
        const titleText = $('title').text().toLowerCase();
        const htmlLower = html.toLowerCase();
        return blockingIndicators.some(indicator => pageText.includes(indicator) ||
            titleText.includes(indicator) ||
            htmlLower.includes(indicator)) || pageText.length < 1000;
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async extractReviews($, platform) {
        const reviews = [];
        try {
            switch (platform.toLowerCase()) {
                case 'amazon':
                    $('[data-hook="review"]').slice(0, 5).each((_, element) => {
                        var _a;
                        const rating = parseFloat(((_a = $(element).find('[data-hook="review-star-rating"]').text().match(/[\d.]+/)) === null || _a === void 0 ? void 0 : _a[0]) || '0');
                        const text = $(element).find('[data-hook="review-body"] span').text().trim();
                        const date = $(element).find('[data-hook="review-date"]').text().trim();
                        const verified = $(element).find('[data-hook="avp-badge"]').length > 0;
                        if (text) {
                            reviews.push({ rating, text, date, verified });
                        }
                    });
                    break;
                case 'flipkart':
                    $('._16PBlm').slice(0, 5).each((_, element) => {
                        const rating = parseFloat($(element).find('._3LWZlK').text() || '0');
                        const text = $(element).find('.t-ZTKy').text().trim();
                        if (text) {
                            reviews.push({ rating, text });
                        }
                    });
                    break;
            }
            return reviews;
        }
        catch (error) {
            this.logger.warn(`Review extraction failed: ${error.message}`);
            return [];
        }
    }
    extractSpecifications($, platform) {
        const specs = {};
        try {
            switch (platform.toLowerCase()) {
                case 'amazon':
                    $('#feature-bullets ul li').each((_, element) => {
                        const text = $(element).text().trim();
                        const parts = text.split(':');
                        if (parts.length === 2) {
                            specs[parts[0].trim()] = parts[1].trim();
                        }
                    });
                    $('#productDetails_techSpec_section_1 tr').each((_, element) => {
                        const key = $(element).find('td').first().text().trim();
                        const value = $(element).find('td').last().text().trim();
                        if (key && value) {
                            specs[key] = value;
                        }
                    });
                    break;
                case 'flipkart':
                    $('._1mXcCf').each((_, element) => {
                        const rows = $(element).find('tr');
                        rows.each((_, row) => {
                            const key = $(row).find('td').first().text().trim();
                            const value = $(row).find('td').last().text().trim();
                            if (key && value && key !== value) {
                                specs[key] = value;
                            }
                        });
                    });
                    break;
            }
            return specs;
        }
        catch (error) {
            this.logger.warn(`Specification extraction failed: ${error.message}`);
            return {};
        }
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = ScraperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ScraperService);
//# sourceMappingURL=scraper.service.js.map