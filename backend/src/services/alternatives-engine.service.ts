import { Injectable, Logger } from '@nestjs/common';
import { InternalProductDbService, Product } from './internal-product-db.service';

export interface Alternative {
  product: Product;
  reason: string;
  improvementScore: number; // 0-100, how much better this is
  priceRatio: number; // price comparison ratio
  ranking: number; // 1-5
}

@Injectable()
export class AlternativesEngineService {
  private readonly logger = new Logger(AlternativesEngineService.name);

  constructor(private productDb: InternalProductDbService) {
    this.logger.log('🔄 Alternatives Engine Service initialized');
  }

  /**
   * Get smart alternatives for a product
   */
  getSmartAlternatives(
    productId: string,
    originalProduct?: Partial<Product>
  ): Alternative[] {
    // Get product from DB or use provided
    let product = this.productDb.getProductById(productId);
    if (!product && originalProduct) {
      product = originalProduct as Product;
    }

    if (!product) {
      this.logger.warn(`Product not found: ${productId}`);
      return [];
    }

    const alternatives = this.findAlternatives(product);
    return alternatives.sort((a, b) => b.improvementScore - a.improvementScore).slice(0, 5);
  }

  /**
   * Find best alternatives for a product
   */
  private findAlternatives(product: Product): Alternative[] {
    const allProducts = this.productDb.getAllProducts();
    const alternatives: Alternative[] = [];

    for (const alt of allProducts) {
      if (alt.id === product.id) continue; // Skip same product

      // Only consider same category
      if (alt.category !== product.category) continue;

      const improvement = this.calculateImprovement(product, alt);
      const priceRatio = alt.price / product.price;
      const ranking = this.calculateRanking(improvement, priceRatio);

      if (improvement > 0) { // Only positive improvements
        alternatives.push({
          product: alt,
          reason: this.generateReason(product, alt, improvement),
          improvementScore: improvement,
          priceRatio,
          ranking,
        });
      }
    }

    return alternatives;
  }

  /**
   * Calculate improvement score
   */
  private calculateImprovement(current: Product, alternative: Product): number {
    let improvement = 0;

    // Rating improvement (max +30)
    if (alternative.rating > current.rating) {
      improvement += Math.min(30, (alternative.rating - current.rating) * 15);
    }

    // Ethical score improvement (max +30)
    if (alternative.ethicalScore > current.ethicalScore) {
      improvement += Math.min(30, (alternative.ethicalScore - current.ethicalScore) * 0.5);
    }

    // Sustainability score improvement (max +30)
    if (alternative.sustainabilityScore > current.sustainabilityScore) {
      improvement += Math.min(30, (alternative.sustainabilityScore - current.sustainabilityScore) * 0.5);
    }

    // Price efficiency (max +20)
    const priceRatio = alternative.price / current.price;
    if (priceRatio < 1.2) {
      // Not too much more expensive
      improvement += Math.min(20, (1 - (priceRatio - 0.8) / 0.4) * 20);
    } else if (priceRatio > 1.5) {
      // Significantly more expensive - reduce improvement
      improvement -= Math.min(15, (priceRatio - 1.5) * 10);
    }

    // Reviews validation (max +10)
    if (alternative.reviews > current.reviews * 1.5) {
      improvement += Math.min(10, 5); // More reviews = more validated
    }

    return Math.max(0, Math.min(100, improvement));
  }

  /**
   * Calculate ranking (1-5 stars)
   */
  private calculateRanking(improvementScore: number, priceRatio: number): number {
    let stars = 3; // Base 3 stars

    if (improvementScore > 50) stars += 1;
    if (improvementScore > 75) stars += 1;
    if (priceRatio < 1.1) stars += 1; // Good price
    if (priceRatio > 2) stars -= 1; // Expensive
    if (priceRatio > 3) stars -= 1; // Very expensive

    return Math.max(1, Math.min(5, Math.round(stars)));
  }

  /**
   * Generate reason for alternative
   */
  private generateReason(current: Product, alternative: Product, improvement: number): string {
    const reasons: string[] = [];

    if (alternative.rating > current.rating + 0.2) {
      reasons.push(`Better rated (${alternative.rating}/5 vs ${current.rating}/5)`);
    }

    if (alternative.ethicalScore > current.ethicalScore + 10) {
      reasons.push(`More ethical (+${alternative.ethicalScore - current.ethicalScore} points)`);
    }

    if (alternative.sustainabilityScore > current.sustainabilityScore + 10) {
      reasons.push(`More sustainable (+${alternative.sustainabilityScore - current.sustainabilityScore} points)`);
    }

    if (alternative.price < current.price * 0.9) {
      const savings = Math.round(((current.price - alternative.price) / current.price) * 100);
      reasons.push(`Save ${savings}% on price`);
    }

    if (alternative.reviews > current.reviews * 2) {
      reasons.push(`More customer reviews (${alternative.reviews.toLocaleString()})`);
    }

    // Add more features insight
    if (alternative.features.length > current.features.length) {
      const extraFeatures = alternative.features.length - current.features.length;
      reasons.push(`${extraFeatures} additional feature${extraFeatures > 1 ? 's' : ''}`);
    }

    if (reasons.length === 0) {
      reasons.push(`Overall better value (${Math.round(improvement)}% improvement)`);
    }

    return reasons.slice(0, 2).join(' & ');
  }

  /**
   * Get eco-friendly alternatives
   */
  getEcoFriendlyAlternatives(productId: string): Alternative[] {
    const product = this.productDb.getProductById(productId);
    if (!product) return [];

    const allProducts = this.productDb.getAllProducts();
    const ecoAlternatives: Alternative[] = [];

    for (const alt of allProducts) {
      if (alt.id === product.id) continue;
      if (alt.category !== product.category) continue;

      // Focus on sustainability
      const sustainabilityGain = alt.sustainabilityScore - product.sustainabilityScore;
      const ethicsGain = alt.ethicalScore - product.ethicalScore;
      const combinedGain = sustainabilityGain * 0.6 + ethicsGain * 0.4;

      if (combinedGain > 5) {
        ecoAlternatives.push({
          product: alt,
          reason: `Eco-score +${Math.round(sustainabilityGain)} (${alt.sustainabilityScore} vs ${product.sustainabilityScore})`,
          improvementScore: combinedGain,
          priceRatio: alt.price / product.price,
          ranking: combinedGain > 20 ? 5 : combinedGain > 10 ? 4 : 3,
        });
      }
    }

    return ecoAlternatives
      .sort((a, b) => b.improvementScore - a.improvementScore)
      .slice(0, 5);
  }

  /**
   * Get budget-friendly alternatives
   */
  getBudgetAlternatives(productId: string, maxBudget?: number): Alternative[] {
    const product = this.productDb.getProductById(productId);
    if (!product) return [];

    const budget = maxBudget || product.price * 0.7;
    const allProducts = this.productDb.getAllProducts();
    const budgetAlternatives: Alternative[] = [];

    for (const alt of allProducts) {
      if (alt.id === product.id) continue;
      if (alt.category !== product.category) continue;
      if (alt.price > budget) continue; // Over budget

      const savings = product.price - alt.price;
      const qualityRatio = alt.rating / (product.rating || 1);
      const improvement = (savings / product.price) * 50 + (qualityRatio - 1) * 20;

      if (improvement > 10) {
        budgetAlternatives.push({
          product: alt,
          reason: `Save ₹${Math.round(savings)} (${Math.round((savings / product.price) * 100)}% cheaper)`,
          improvementScore: improvement,
          priceRatio: alt.price / product.price,
          ranking: savings > product.price * 0.3 ? 5 : 4,
        });
      }
    }

    return budgetAlternatives
      .sort((a, b) => b.improvementScore - a.improvementScore)
      .slice(0, 5);
  }

  /**
   * Get premium alternatives
   */
  getPremiumAlternatives(productId: string): Alternative[] {
    const product = this.productDb.getProductById(productId);
    if (!product) return [];

    const allProducts = this.productDb.getAllProducts();
    const premiumAlternatives: Alternative[] = [];

    for (const alt of allProducts) {
      if (alt.id === product.id) continue;
      if (alt.category !== product.category) continue;
      if (alt.price < product.price) continue; // Must be more expensive

      const premiumBenefit =
        (alt.rating - product.rating) * 15 +
        (alt.ethicalScore - product.ethicalScore) * 0.4 +
        (alt.sustainabilityScore - product.sustainabilityScore) * 0.4;

      if (premiumBenefit > 5) {
        premiumAlternatives.push({
          product: alt,
          reason: `Premium upgrade (+${Math.round(premiumBenefit)}% value)`,
          improvementScore: premiumBenefit,
          priceRatio: alt.price / product.price,
          ranking: premiumBenefit > 30 ? 5 : premiumBenefit > 15 ? 4 : 3,
        });
      }
    }

    return premiumAlternatives
      .sort((a, b) => b.improvementScore - a.improvementScore)
      .slice(0, 5);
  }

  /**
   * Get alternatives in specific price range
   */
  getAlternativesInPriceRange(
    productId: string,
    minPrice: number,
    maxPrice: number
  ): Alternative[] {
    const product = this.productDb.getProductById(productId);
    if (!product) return [];

    const allProducts = this.productDb.getAllProducts();
    const priceAlternatives: Alternative[] = [];

    for (const alt of allProducts) {
      if (alt.id === product.id) continue;
      if (alt.category !== product.category) continue;
      if (alt.price < minPrice || alt.price > maxPrice) continue;

      const improvement = this.calculateImprovement(product, alt);
      if (improvement > 0) {
        priceAlternatives.push({
          product: alt,
          reason: `In your budget (₹${alt.price.toLocaleString('en-IN')})`,
          improvementScore: improvement,
          priceRatio: alt.price / product.price,
          ranking: Math.round(alt.rating),
        });
      }
    }

    return priceAlternatives
      .sort((a, b) => b.improvementScore - a.improvementScore)
      .slice(0, 5);
  }
}
