import { Injectable, Logger } from '@nestjs/common';

export interface PriceComparison {
  platform: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  availability: 'In Stock' | 'Limited' | 'Out of Stock' | 'Unknown';
  shippingCost: number;
  totalPrice: number; // price + shipping
  confidence: number; // 0-100, how reliable this data is
  url?: string;
}

export interface PriceAnalysis {
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  bestDeal: PriceComparison;
  comparisons: PriceComparison[];
  priceHistory: Array<{ date: string; price: number }>;
  dealScore: number; // 0-100
  recommendation: string;
  savingsOpportunity: number; // potential savings
}

@Injectable()
export class PriceComparisonService {
  private readonly logger = new Logger(PriceComparisonService.name);

  // Platform price variations (realistic market data)
  private platformVariations: Record<
    string,
    { priceMultiplier: number; shipping: number; confidence: number }
  > = {
    amazon: { priceMultiplier: 1.0, shipping: 0, confidence: 95 }, // Reference price
    flipkart: { priceMultiplier: 0.98, shipping: 50, confidence: 92 },
    myntra: { priceMultiplier: 1.02, shipping: 0, confidence: 90 },
    ajio: { priceMultiplier: 1.05, shipping: 99, confidence: 85 },
    ebay: { priceMultiplier: 0.95, shipping: 200, confidence: 88 },
    walmart: { priceMultiplier: 1.08, shipping: 100, confidence: 87 },
    local_store: { priceMultiplier: 1.15, shipping: 0, confidence: 75 },
  };

  constructor() {
    this.logger.log('💰 Price Comparison Service initialized');
  }

  /**
   * Analyze and compare prices across platforms
   */
  analyzePriceComparison(
    productTitle: string,
    currentPrice: number,
    originalPrice?: number,
    currentPlatform: string = 'amazon',
  ): PriceAnalysis {
    const comparisons = this.generatePlatformComparisons(
      productTitle,
      currentPrice,
      currentPlatform,
    );
    const lowestPrice = Math.min(...comparisons.map((c) => c.totalPrice));
    const highestPrice = Math.max(...comparisons.map((c) => c.totalPrice));
    const averagePrice =
      comparisons.reduce((sum, c) => sum + c.totalPrice, 0) /
      comparisons.length;

    const bestDeal = comparisons.reduce((best, curr) =>
      curr.totalPrice < best.totalPrice ? curr : best,
    );

    const dealScore = this.calculateDealScore(
      currentPrice,
      lowestPrice,
      averagePrice,
      originalPrice,
    );
    const savingsOpportunity =
      lowestPrice < currentPrice ? currentPrice - lowestPrice : 0;

    return {
      currentPrice,
      lowestPrice,
      highestPrice,
      averagePrice: Math.round(averagePrice),
      bestDeal,
      comparisons: comparisons.sort((a, b) => a.totalPrice - b.totalPrice),
      priceHistory: this.generatePriceHistory(currentPrice, originalPrice),
      dealScore,
      recommendation: this.generatePriceRecommendation(
        dealScore,
        currentPrice,
        lowestPrice,
      ),
      savingsOpportunity: Math.round(savingsOpportunity),
    };
  }

  /**
   * Generate platform comparisons with realistic prices
   */
  private generatePlatformComparisons(
    productTitle: string,
    basePrice: number,
    currentPlatform: string,
  ): PriceComparison[] {
    const comparisons: PriceComparison[] = [];

    for (const [platform, variation] of Object.entries(
      this.platformVariations,
    )) {
      const discount = this.getRandomDiscount(platform);
      const priceAfterDiscount = Math.round(
        basePrice * variation.priceMultiplier * (1 - discount / 100),
      );
      const shippingCost = Math.random() > 0.3 ? 0 : variation.shipping; // 30% chance of shipping cost

      comparisons.push({
        platform: this.formatPlatformName(platform),
        price: priceAfterDiscount,
        originalPrice: basePrice,
        discount: discount > 0 ? discount : undefined,
        availability: this.getRandomAvailability(),
        shippingCost,
        totalPrice: priceAfterDiscount + shippingCost,
        confidence: variation.confidence,
        url: `https://${platform}.com/search?q=${encodeURIComponent(productTitle)}`,
      });
    }

    return comparisons;
  }

  /**
   * Generate realistic price history
   */
  private generatePriceHistory(
    currentPrice: number,
    originalPrice?: number,
  ): Array<{ date: string; price: number }> {
    const history: Array<{ date: string; price: number }> = [];
    const basePrice = originalPrice || currentPrice * 1.1;

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Simulate price fluctuations
      const variance = 0.85 + Math.random() * 0.3; // ±15% variance
      const price = Math.round(basePrice * variance);

      history.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(currentPrice * 0.8, price), // Don't go below 80% of current
      });
    }

    return history;
  }

  /**
   * Calculate deal score (0-100)
   */
  private calculateDealScore(
    currentPrice: number,
    lowestPrice: number,
    averagePrice: number,
    originalPrice?: number,
  ): number {
    let score = 50; // Base score

    // Price comparison to average
    if (currentPrice < averagePrice * 0.8) score += 25;
    else if (currentPrice < averagePrice * 0.95) score += 15;
    else if (currentPrice > averagePrice * 1.2) score -= 20;
    else if (currentPrice > averagePrice * 1.5) score -= 35;

    // Best deal check
    if (Math.abs(currentPrice - lowestPrice) < 100) score += 15;
    else if (currentPrice > lowestPrice * 1.1) score -= 10;

    // Discount check
    if (originalPrice && originalPrice > currentPrice) {
      const discountPercent =
        ((originalPrice - currentPrice) / originalPrice) * 100;
      if (discountPercent > 40) score += 20;
      else if (discountPercent > 20) score += 10;
      else if (discountPercent > 10) score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate price recommendation
   */
  private generatePriceRecommendation(
    dealScore: number,
    currentPrice: number,
    lowestPrice: number,
  ): string {
    if (dealScore >= 80) {
      return 'Excellent deal! Buy now - this is the best price.';
    }
    if (dealScore >= 70) {
      return 'Good price. Consider buying if you need it soon.';
    }
    if (dealScore >= 60) {
      return 'Fair price. You could wait for better deals or check alternatives.';
    }
    if (dealScore >= 50) {
      return (
        'Average price. Save ₹' +
        Math.round(lowestPrice - currentPrice) +
        ' by checking other platforms.'
      );
    }
    if (dealScore >= 40) {
      return 'Above average price. Significant savings available elsewhere.';
    }
    return (
      'Poor deal. Wait for sales or check competitor prices - savings up to ₹' +
      Math.round(currentPrice - lowestPrice)
    );
  }

  /**
   * Get seasonal pricing adjustments
   */
  getSeasonalPricing(
    basePrice: number,
    season: 'spring' | 'summer' | 'monsoon' | 'winter' | 'festivals',
  ): number {
    const seasonMultiplier: Record<string, number> = {
      spring: 0.95,
      summer: 1.05,
      monsoon: 0.9,
      winter: 1.1,
      festivals: 0.75, // Sales during festivals
    };

    return Math.round(basePrice * (seasonMultiplier[season] || 1));
  }

  /**
   * Get bulk pricing discount
   */
  getBulkPricing(
    unitPrice: number,
    quantity: number,
  ): { unitPrice: number; totalPrice: number; savings: number } {
    let discount = 0;

    if (quantity >= 100) discount = 0.25;
    else if (quantity >= 50) discount = 0.2;
    else if (quantity >= 20) discount = 0.15;
    else if (quantity >= 10) discount = 0.1;
    else if (quantity >= 5) discount = 0.05;

    const discountedPrice = Math.round(unitPrice * (1 - discount));
    const totalPrice = discountedPrice * quantity;
    const savings = (unitPrice - discountedPrice) * quantity;

    return {
      unitPrice: discountedPrice,
      totalPrice,
      savings: Math.round(savings),
    };
  }

  /**
   * Track price trends for a product
   */
  analyzePriceTrend(priceHistory: Array<{ date: string; price: number }>): {
    trend: 'rising' | 'falling' | 'stable';
    slope: number;
    volatility: number;
    prediction: number;
  } {
    if (priceHistory.length < 2) {
      return {
        trend: 'stable',
        slope: 0,
        volatility: 0,
        prediction: priceHistory[0]?.price || 0,
      };
    }

    const prices = priceHistory.map((h) => h.price);
    const n = prices.length;

    // Calculate trend line slope (simple linear regression)
    const xMean = (n - 1) / 2;
    const yMean = prices.reduce((a, b) => a + b) / n;
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (prices[i] - yMean);
      denominator += (i - xMean) ** 2;
    }

    const slope = numerator / denominator;
    const trend: 'rising' | 'falling' | 'stable' =
      slope > 5 ? 'rising' : slope < -5 ? 'falling' : 'stable';

    // Calculate volatility
    const deviations = prices.map((p) => Math.abs(p - yMean));
    const volatility = Math.round((Math.max(...deviations) / yMean) * 100);

    // Simple prediction for next day
    const prediction = Math.round(prices[n - 1] + slope);

    return {
      trend,
      slope: Math.round(slope),
      volatility,
      prediction,
    };
  }

  /**
   * Calculate best time to buy
   */
  getBestTimeToBuy(dealScore: number, trend: string): string {
    if (dealScore >= 75 && trend === 'rising') {
      return 'BUY NOW - Excellent deal and prices are rising!';
    }
    if (dealScore >= 75) {
      return 'BUY NOW - Great deal available';
    }
    if (trend === 'falling') {
      return 'WAIT - Prices are falling, better deals coming';
    }
    if (dealScore >= 60) {
      return 'GOOD TIME - Reasonable price';
    }
    return 'WAIT - Hold out for better deals';
  }

  // Helper methods
  private getRandomDiscount(platform: string): number {
    if (platform === 'flipkart')
      return Math.random() > 0.5 ? Math.floor(Math.random() * 15) : 0;
    if (platform === 'amazon')
      return Math.random() > 0.3 ? Math.floor(Math.random() * 20) : 0;
    if (platform === 'ebay')
      return Math.random() > 0.4 ? Math.floor(Math.random() * 25) : 0;
    return 0;
  }

  private getRandomAvailability():
    | 'In Stock'
    | 'Limited'
    | 'Out of Stock'
    | 'Unknown' {
    const rand = Math.random();
    if (rand > 0.7) return 'In Stock';
    if (rand > 0.3) return 'Limited';
    if (rand > 0.05) return 'Out of Stock';
    return 'Unknown';
  }

  private formatPlatformName(platform: string): string {
    return platform
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
