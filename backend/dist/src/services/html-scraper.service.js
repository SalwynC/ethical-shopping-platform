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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var HtmlScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlScraperService = void 0;
const common_1 = require("@nestjs/common");
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
let HtmlScraperService = HtmlScraperService_1 = class HtmlScraperService {
    constructor() {
        this.logger = new common_1.Logger(HtmlScraperService_1.name);
    }
    async scrapeProductPage(url) {
        this.logger.log(`🌐 SCRAPING REAL DATA from: ${url}`);
        try {
            const response = await axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Cache-Control': 'max-age=0',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                timeout: 15000,
                maxRedirects: 5,
                validateStatus: () => true,
            });
            if (response.status !== 200) {
                this.logger.warn(`⚠️  HTTP Status ${response.status} - trying to parse anyway...`);
            }
            const html = response.data;
            if (!html || html.length < 500) {
                throw new Error(`HTML too short (${html.length} bytes) - likely blocked or empty page`);
            }
            const $ = cheerio.load(html);
            this.logger.log(`✅ HTML fetched successfully (${html.length} bytes)`);
            const scrapedData = {
                title: this.extractTitle($, url),
                price: this.extractPrice($),
                originalPrice: this.extractOriginalPrice($),
                currency: this.detectCurrency($, url),
                brand: this.extractBrand($),
                rating: this.extractRating($),
                reviewCount: this.extractReviewCount($),
                images: this.extractImages($, url),
                description: this.extractDescription($),
                availability: this.extractAvailability($),
                specifications: this.extractSpecifications($),
            };
            this.logger.log(`📦 REAL DATA EXTRACTED:`);
            this.logger.log(`   Title: ${scrapedData.title}`);
            this.logger.log(`   Price: ${scrapedData.currency} ${scrapedData.price}`);
            this.logger.log(`   Brand: ${scrapedData.brand}`);
            this.logger.log(`   Rating: ${scrapedData.rating}/5 (${scrapedData.reviewCount} reviews)`);
            this.logger.log(`   Availability: ${scrapedData.availability}`);
            this.logger.log(`   Images: ${scrapedData.images.length} found`);
            this.logger.log(`   Specs: ${Object.keys(scrapedData.specifications).length} found`);
            const hasRealData = scrapedData.title &&
                scrapedData.title.length > 5 &&
                scrapedData.price &&
                scrapedData.price > 0;
            if (!hasRealData) {
                this.logger.warn(`⚠️  Extracted data seems incomplete - may need AI fallback`);
            }
            return scrapedData;
        }
        catch (error) {
            this.logger.error(`❌ Scraping failed: ${error.message}`);
            this.logger.debug(`Stack: ${error.stack}`);
            throw error;
        }
    }
    extractTitle($, url) {
        const selectors = [
            'h1.product-title',
            'h1[class*="product"]',
            'h1[class*="title"]',
            '.product-name',
            '[data-testid="product-title"]',
            'h1.pdp-title',
            'h1.product-single__title',
            'meta[property="og:title"]',
            'meta[name="twitter:title"]',
            'title',
            'h1',
        ];
        for (const selector of selectors) {
            let text = '';
            if (selector.startsWith('meta')) {
                text = $(selector).attr('content') || '';
            }
            else {
                text = $(selector).first().text().trim();
            }
            if (text && text.length > 3) {
                this.logger.log(`✓ Found title using: ${selector}`);
                return this.cleanText(text);
            }
        }
        const urlTitle = this.extractTitleFromUrl(url);
        if (urlTitle) {
            this.logger.warn(`⚠️ Using URL-based title: ${urlTitle}`);
            return urlTitle;
        }
        return null;
    }
    extractPrice($) {
        const selectors = [
            '.a-price-whole',
            '.a-price.a-text-price.a-size-medium.a-color-price',
            'span.a-price-whole',
            '[data-a-color="price"]',
            '.a-price.a-text-price',
            '.a-price-symbol + span',
            '.price-current',
            '.product-price',
            '[data-testid="product-price"]',
            '.pdp-price',
            '[itemprop="price"]',
            '.price',
            '[class*="price"][class*="current"]',
            '[class*="sale-price"]',
            'span[class*="Price"]',
            '.selling-price',
            '.finalPrice',
            '[class*="priceText"]',
            '[class*="productPrice"]',
        ];
        for (const selector of selectors) {
            const elements = $(selector);
            if (elements.length > 0) {
                for (let i = 0; i < elements.length; i++) {
                    const text = $(elements[i]).text();
                    const price = this.parsePrice(text);
                    if (price && price > 0) {
                        this.logger.log(`✓ Found price using: ${selector} = ₹${price}`);
                        return price;
                    }
                }
            }
        }
        const ogPrice = $('meta[property="product:price:amount"]').attr('content');
        if (ogPrice) {
            const price = parseFloat(ogPrice);
            if (price > 0) {
                this.logger.log(`✓ Found price in meta tag = ₹${price}`);
                return price;
            }
        }
        const allText = $('body').text();
        const priceMatch = allText.match(/₹?\s*(\d{2,6}(?:,\d{3})*(?:\.\d{2})?)/);
        if (priceMatch) {
            const price = this.parsePrice(priceMatch[0]);
            if (price && price > 0) {
                this.logger.log(`✓ Found price via text scan = ₹${price}`);
                return price;
            }
        }
        this.logger.warn(`⚠️ Could not extract price from page`);
        return null;
    }
    extractOriginalPrice($) {
        const selectors = [
            '.price-original',
            '.original-price',
            '[data-testid="original-price"]',
            '.price-old',
            '.regular-price',
            '[class*="price"][class*="original"]',
            '[class*="mrp"]',
            'del .price',
            's .price',
        ];
        for (const selector of selectors) {
            const text = $(selector).first().text();
            const price = this.parsePrice(text);
            if (price && price > 0) {
                this.logger.log(`✓ Found original price using: ${selector} = ${price}`);
                return price;
            }
        }
        return null;
    }
    extractBrand($) {
        const selectors = [
            '[itemprop="brand"]',
            '.product-brand',
            '[data-testid="brand"]',
            'meta[property="product:brand"]',
            '.brand-name',
            '[class*="brand"]',
        ];
        for (const selector of selectors) {
            let text = '';
            if (selector.startsWith('meta')) {
                text = $(selector).attr('content') || '';
            }
            else if (selector.includes('[itemprop')) {
                text = $(selector).text() || $(selector).attr('content') || '';
            }
            else {
                text = $(selector).first().text();
            }
            text = this.cleanText(text);
            if (text && text.length > 1 && text.length < 50) {
                this.logger.log(`✓ Found brand using: ${selector} = ${text}`);
                return text;
            }
        }
        return null;
    }
    extractRating($) {
        const selectors = [
            '.a-star-small span.a-icon-star',
            'i.a-icon.a-icon-star.a-star-small',
            'span.a-icon-star-small',
            '[aria-label*="stars"]',
            '[data-rating]',
            '[itemprop="ratingValue"]',
            '[data-testid="rating"]',
            '.rating-value',
            '[class*="rating"][class*="value"]',
            '.stars-rating',
        ];
        for (const selector of selectors) {
            let text = $(selector).text() || $(selector).attr('content') || $(selector).attr('aria-label') || '';
            text = text.trim();
            const ratingMatch = text.match(/([0-9]+\.?[0-9]*)\s*(?:out of|star|,)/i);
            if (ratingMatch) {
                const rating = parseFloat(ratingMatch[1]);
                if (rating >= 0 && rating <= 5) {
                    this.logger.log(`✓ Found rating using: ${selector} = ${rating}`);
                    return rating;
                }
            }
        }
        const ariaLabel = $('[role="img"][aria-label*="out of"], [role="img"][aria-label*="star"]').attr('aria-label') || '';
        if (ariaLabel) {
            const ratingMatch = ariaLabel.match(/([0-9]+\.?[0-9]*)/);
            if (ratingMatch) {
                const rating = parseFloat(ratingMatch[1]);
                if (rating >= 0 && rating <= 5) {
                    this.logger.log(`✓ Found rating from aria-label = ${rating}`);
                    return rating;
                }
            }
        }
    }
    extractReviewCount($) {
        const selectors = [
            '[data-hook="see-all-reviews-linkompressor"]',
            'span[class*="a-size-base"] a[class*="a-link-normal"]',
            '[data-reviews-state-param]',
            '[itemprop="reviewCount"]',
            '[data-testid="review-count"]',
            '.review-count',
            '[class*="review"][class*="count"]',
        ];
        for (const selector of selectors) {
            const text = $(selector).text() || $(selector).attr('content') || '';
            const countMatch = text.match(/\(?([0-9,]+)\)?\s*(?:review|customer|rating)/i);
            if (countMatch) {
                const count = parseInt(countMatch[1].replace(/,/g, ''));
                if (count > 0 && count < 10000000) {
                    this.logger.log(`✓ Found review count using: ${selector} = ${count}`);
                    return count;
                }
            }
            const directMatch = text.match(/([0-9,]+)/);
            if (directMatch) {
                const count = parseInt(directMatch[1].replace(/,/g, ''));
                if (count > 0 && count < 10000000) {
                    this.logger.log(`✓ Found review count using: ${selector} = ${count}`);
                    return count;
                }
            }
        }
        const reviewLink = $('a[href*="review"][class*="a-link"]').text() || '';
        if (reviewLink) {
            const countMatch = reviewLink.match(/([0-9,]+)/);
            if (countMatch) {
                const count = parseInt(countMatch[1].replace(/,/g, ''));
                if (count > 0 && count < 10000000) {
                    this.logger.log(`✓ Found review count from link = ${count}`);
                    return count;
                }
            }
        }
    }
    extractImages($, url) {
        const images = [];
        const selectors = [
            'meta[property="og:image"]',
            '[itemprop="image"]',
            '.product-image img',
            '[data-testid="product-image"]',
            '.gallery-image img',
        ];
        for (const selector of selectors) {
            $(selector).each((_, el) => {
                const src = $(el).attr('content') || $(el).attr('src') || $(el).attr('data-src') || '';
                if (src && src.startsWith('http')) {
                    images.push(src);
                }
            });
        }
        return [...new Set(images)].slice(0, 5);
    }
    extractDescription($) {
        const selectors = [
            'meta[property="og:description"]',
            '[itemprop="description"]',
            '.product-description',
            '[data-testid="description"]',
            '.description',
        ];
        for (const selector of selectors) {
            let text = '';
            if (selector.startsWith('meta')) {
                text = $(selector).attr('content') || '';
            }
            else {
                text = $(selector).first().text();
            }
            text = this.cleanText(text);
            if (text && text.length > 20) {
                return text.substring(0, 500);
            }
        }
        return null;
    }
    extractAvailability($) {
        const selectors = [
            '.availability',
            '[itemprop="availability"]',
            '[data-testid="availability"]',
            '.stock-status',
        ];
        for (const selector of selectors) {
            const text = $(selector).text().toLowerCase();
            if (text.includes('in stock') || text.includes('available')) {
                return 'in_stock';
            }
            if (text.includes('out of stock') || text.includes('unavailable')) {
                return 'out_of_stock';
            }
        }
        return 'unknown';
    }
    extractSpecifications($) {
        const specs = {};
        $('table.specifications tr, .specs-table tr, [class*="spec"] tr').each((_, row) => {
            const cells = $(row).find('td, th');
            if (cells.length >= 2) {
                const key = $(cells[0]).text().trim();
                const value = $(cells[1]).text().trim();
                if (key && value) {
                    specs[key] = value;
                }
            }
        });
        return specs;
    }
    parsePrice(text) {
        if (!text)
            return null;
        const priceMatch = text.match(/([0-9,]+(?:\.[0-9]{1,2})?)/);
        if (!priceMatch)
            return null;
        const cleaned = priceMatch[1].replace(/,/g, '');
        const number = parseFloat(cleaned);
        if (isNaN(number) || number <= 0 || number > 10000000) {
            return null;
        }
        return number;
    }
    detectCurrency($, url) {
        const text = $('body').text();
        if (text.includes('₹') || text.includes('Rs') || url.includes('.in')) {
            return 'INR';
        }
        if (text.includes('$')) {
            return 'USD';
        }
        if (text.includes('£')) {
            return 'GBP';
        }
        if (text.includes('€')) {
            return 'EUR';
        }
        return 'INR';
    }
    extractTitleFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathSegments = urlObj.pathname.split('/').filter(s => s.length > 3);
            if (pathSegments.length > 0) {
                const titleSegment = pathSegments[pathSegments.length - 1];
                const title = titleSegment
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase())
                    .trim();
                if (title.length > 5) {
                    return title;
                }
            }
        }
        catch (error) {
        }
        return null;
    }
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/[\n\r\t]/g, '')
            .trim();
    }
};
exports.HtmlScraperService = HtmlScraperService;
exports.HtmlScraperService = HtmlScraperService = HtmlScraperService_1 = __decorate([
    (0, common_1.Injectable)()
], HtmlScraperService);
//# sourceMappingURL=html-scraper.service.js.map