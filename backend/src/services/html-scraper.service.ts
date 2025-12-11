import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';

export interface ScrapedData {
  title: string | null;
  price: number | null;
  originalPrice: number | null;
  currency: string;
  brand: string | null;
  rating: number | null;
  reviewCount: number | null;
  images: string[];
  description: string | null;
  availability: string;
  specifications: Record<string, string>;
}

@Injectable()
export class HtmlScraperService {
  private readonly logger = new Logger(HtmlScraperService.name);

  /**
   * REAL HTML SCRAPER - Extracts actual data from live websites
   */
  async scrapeProductPage(url: string): Promise<ScrapedData> {
    this.logger.log(`🌐 SCRAPING REAL DATA from: ${url}`);

    try {
      // Step 1: Fetch the actual HTML content with better headers
      const response = await axios.get(url, {
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
        validateStatus: () => true, // Accept all status codes
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

      // Step 2: Extract data using multiple strategies
      const scrapedData: ScrapedData = {
        title: this.extractTitle($ as any, url),
        price: this.extractPrice($ as any),
        originalPrice: this.extractOriginalPrice($ as any),
        currency: this.detectCurrency($ as any, url),
        brand: this.extractBrand($ as any),
        rating: this.extractRating($ as any),
        reviewCount: this.extractReviewCount($ as any),
        images: this.extractImages($ as any, url),
        description: this.extractDescription($ as any),
        availability: this.extractAvailability($ as any),
        specifications: this.extractSpecifications($ as any),
      };

      // Log all extracted data
      this.logger.log(`📦 REAL DATA EXTRACTED:`);
      this.logger.log(`   Title: ${scrapedData.title}`);
      this.logger.log(`   Price: ${scrapedData.currency} ${scrapedData.price}`);
      this.logger.log(`   Brand: ${scrapedData.brand}`);
      this.logger.log(`   Rating: ${scrapedData.rating}/5 (${scrapedData.reviewCount} reviews)`);
      this.logger.log(`   Availability: ${scrapedData.availability}`);
      this.logger.log(`   Images: ${scrapedData.images.length} found`);
      this.logger.log(`   Specs: ${Object.keys(scrapedData.specifications).length} found`);

      // Validate we got meaningful data
      const hasRealData = scrapedData.title && 
                         scrapedData.title.length > 5 && 
                         scrapedData.price && 
                         scrapedData.price > 0;

      if (!hasRealData) {
        this.logger.warn(`⚠️  Extracted data seems incomplete - may need AI fallback`);
      }

      return scrapedData;

    } catch (error) {
      this.logger.error(`❌ Scraping failed: ${error.message}`);
      this.logger.debug(`Stack: ${error.stack}`);
      throw error;
    }
  }

  private extractTitle($: cheerio.CheerioAPI, url: string): string | null {
    // Try multiple selectors in order of priority
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
      } else {
        text = $(selector).first().text().trim();
      }

      if (text && text.length > 3) {
        this.logger.log(`✓ Found title using: ${selector}`);
        return this.cleanText(text);
      }
    }

    // Extract from URL as last resort
    const urlTitle = this.extractTitleFromUrl(url);
    if (urlTitle) {
      this.logger.warn(`⚠️ Using URL-based title: ${urlTitle}`);
      return urlTitle;
    }

    return null;
  }

  private extractPrice($: cheerio.CheerioAPI): number | null {
    const selectors = [
      // Amazon-specific selectors
      '.a-price-whole',
      '.a-price.a-text-price.a-size-medium.a-color-price',
      'span.a-price-whole',
      '[data-a-color="price"]',
      '.a-price.a-text-price',
      '.a-price-symbol + span',
      // Generic selectors
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

    // Look for price in meta tags
    const ogPrice = $('meta[property="product:price:amount"]').attr('content');
    if (ogPrice) {
      const price = parseFloat(ogPrice);
      if (price > 0) {
        this.logger.log(`✓ Found price in meta tag = ₹${price}`);
        return price;
      }
    }

    // Scan all spans and divs for price patterns
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

  private extractOriginalPrice($: cheerio.CheerioAPI): number | null {
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

  private extractBrand($: cheerio.CheerioAPI): string | null {
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
      } else if (selector.includes('[itemprop')) {
        text = $(selector).text() || $(selector).attr('content') || '';
      } else {
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

  private extractRating($: cheerio.CheerioAPI): number | null {
    const selectors = [
      // Amazon-specific selectors
      '.a-star-small span.a-icon-star',
      'i.a-icon.a-icon-star.a-star-small',
      'span.a-icon-star-small',
      '[aria-label*="stars"]',
      '[data-rating]',
      // Generic selectors
      '[itemprop="ratingValue"]',
      '[data-testid="rating"]',
      '.rating-value',
      '[class*="rating"][class*="value"]',
      '.stars-rating',
    ];

    for (const selector of selectors) {
      let text = $(selector).text() || $(selector).attr('content') || $(selector).attr('aria-label') || '';
      text = text.trim();
      
      // Try to extract rating from text like "3.5 out of 5" or "3.5 stars"
      const ratingMatch = text.match(/([0-9]+\.?[0-9]*)\s*(?:out of|star|,)/i);
      if (ratingMatch) {
        const rating = parseFloat(ratingMatch[1]);
        if (rating >= 0 && rating <= 5) {
          this.logger.log(`✓ Found rating using: ${selector} = ${rating}`);
          return rating;
        }
      }
    }
    
    // Try aria-label from rating container
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

  private extractReviewCount($: cheerio.CheerioAPI): number | null {
    const selectors = [
      // Amazon-specific selectors
      '[data-hook="see-all-reviews-linkompressor"]',
      'span[class*="a-size-base"] a[class*="a-link-normal"]',
      '[data-reviews-state-param]',
      // Generic selectors
      '[itemprop="reviewCount"]',
      '[data-testid="review-count"]',
      '.review-count',
      '[class*="review"][class*="count"]',
    ];

    for (const selector of selectors) {
      const text = $(selector).text() || $(selector).attr('content') || '';
      
      // Try to extract review count from text like "141 reviews" or "(141)"
      const countMatch = text.match(/\(?([0-9,]+)\)?\s*(?:review|customer|rating)/i);
      if (countMatch) {
        const count = parseInt(countMatch[1].replace(/,/g, ''));
        if (count > 0 && count < 10000000) {
          this.logger.log(`✓ Found review count using: ${selector} = ${count}`);
          return count;
        }
      }
      
      // Try direct number extraction
      const directMatch = text.match(/([0-9,]+)/);
      if (directMatch) {
        const count = parseInt(directMatch[1].replace(/,/g, ''));
        if (count > 0 && count < 10000000) {
          this.logger.log(`✓ Found review count using: ${selector} = ${count}`);
          return count;
        }
      }
    }
    
    // Try to find review link with count
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

  private extractImages($: cheerio.CheerioAPI, url: string): string[] {
    const images: string[] = [];
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

    return [...new Set(images)].slice(0, 5); // Return up to 5 unique images
  }

  private extractDescription($: cheerio.CheerioAPI): string | null {
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
      } else {
        text = $(selector).first().text();
      }

      text = this.cleanText(text);
      if (text && text.length > 20) {
        return text.substring(0, 500); // Limit to 500 chars
      }
    }

    return null;
  }

  private extractAvailability($: cheerio.CheerioAPI): string {
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

  private extractSpecifications($: cheerio.CheerioAPI): Record<string, string> {
    const specs: Record<string, string> = {};
    
    // Look for spec tables
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

  private parsePrice(text: string): number | null {
    if (!text) return null;
    
    // Extract numbers with optional commas and decimals
    const priceMatch = text.match(/([0-9,]+(?:\.[0-9]{1,2})?)/);
    if (!priceMatch) return null;
    
    // Remove commas but keep the number
    const cleaned = priceMatch[1].replace(/,/g, '');
    const number = parseFloat(cleaned);
    
    // Validate it's a reasonable price (between 1 and 10,000,000)
    if (isNaN(number) || number <= 0 || number > 10000000) {
      return null;
    }
    
    return number;
  }

  private detectCurrency($: cheerio.CheerioAPI, url: string): string {
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
    
    return 'INR'; // Default for India
  }

  private extractTitleFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(s => s.length > 3);
      
      if (pathSegments.length > 0) {
        // Get the last meaningful segment
        const titleSegment = pathSegments[pathSegments.length - 1];
        // Replace hyphens and underscores with spaces
        const title = titleSegment
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
          .trim();
        
        if (title.length > 5) {
          return title;
        }
      }
    } catch (error) {
      // Invalid URL
    }
    
    return null;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[\n\r\t]/g, '') // Remove newlines and tabs
      .trim();
  }
}
