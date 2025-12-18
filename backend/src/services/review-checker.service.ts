import { Injectable, Logger } from '@nestjs/common';

interface ReviewAnalysis {
  score: number; // 0-100, higher is more trustworthy
  trustLevel: 'High' | 'Medium' | 'Low' | 'Suspicious';
  flags: string[];
  sentiment: 'Positive' | 'Negative' | 'Mixed' | 'Neutral';
  quality: number; // 0-100
  recommendation: string;
}

@Injectable()
export class ReviewCheckerService {
  private readonly logger = new Logger(ReviewCheckerService.name);

  constructor() {
    this.logger.log('🔍 Review Checker Service initialized');
  }

  /**
   * Analyze product reviews to detect fake/genuine reviews
   */
  analyzeReviews(
    rating: number,
    reviewCount: number,
    brand?: string,
  ): ReviewAnalysis {
    const flags: string[] = [];
    let trustScore = 100;
    let quality = 100;

    // Flag 1: Suspicious rating patterns
    if (rating === 5 && reviewCount < 10) {
      flags.push(
        '⚠️ Perfect rating with few reviews - might be new or manipulated',
      );
      trustScore -= 20;
    }

    // Flag 2: Too many reviews for new product
    if (reviewCount > 1000 && rating > 4.8) {
      flags.push('⚠️ Very high rating with many reviews - verify authenticity');
      trustScore -= 10;
    }

    // Flag 3: Rating too perfect
    if (rating === 5.0) {
      flags.push('⚠️ Perfect 5.0 rating is rare for genuine products');
      trustScore -= 15;
    }

    // Flag 4: Low review count
    if (reviewCount < 5) {
      flags.push('⚠️ Very few reviews - not enough data to assess');
      trustScore -= 25;
      quality -= 30;
    }

    // Flag 5: Suspicious rating ranges
    if (rating >= 4.5 && rating <= 4.7 && reviewCount > 100) {
      // This is actually a good sign - natural distribution
      flags.push('✅ Rating pattern looks natural and trustworthy');
      trustScore += 10;
      quality += 10;
    }

    // Flag 6: Mid-range ratings are more trustworthy
    if (rating >= 3.5 && rating <= 4.5 && reviewCount > 50) {
      flags.push('✅ Balanced rating with good review count - likely genuine');
      trustScore += 15;
      quality += 15;
    }

    // Flag 7: Brand reputation factor
    const trustedBrands = [
      'Apple',
      'Samsung',
      'Sony',
      'LG',
      'Dell',
      'HP',
      'Lenovo',
      'Nike',
      'Adidas',
      'Puma',
    ];
    if (brand && trustedBrands.some((b) => brand.includes(b))) {
      flags.push('✅ Known trusted brand - reviews likely authentic');
      trustScore += 10;
    }

    // Flag 8: Review count vs rating correlation
    if (reviewCount > 500 && rating < 3.5) {
      flags.push('⚠️ Many negative reviews - product might have issues');
      quality -= 20;
    }

    // Flag 9: Extremely low ratings
    if (rating < 2.5) {
      flags.push('🚫 Very low rating - avoid this product');
      trustScore -= 30;
      quality -= 40;
    }

    // Flag 10: Optimal review sweet spot
    if (
      reviewCount >= 100 &&
      reviewCount <= 5000 &&
      rating >= 3.8 &&
      rating <= 4.6
    ) {
      flags.push('✅ Ideal review metrics - high confidence in authenticity');
      trustScore += 20;
      quality += 20;
    }

    // Normalize scores
    trustScore = Math.max(0, Math.min(100, trustScore));
    quality = Math.max(0, Math.min(100, quality));

    // Determine trust level
    let trustLevel: 'High' | 'Medium' | 'Low' | 'Suspicious';
    if (trustScore >= 75) trustLevel = 'High';
    else if (trustScore >= 50) trustLevel = 'Medium';
    else if (trustScore >= 30) trustLevel = 'Low';
    else trustLevel = 'Suspicious';

    // Determine sentiment
    let sentiment: 'Positive' | 'Negative' | 'Mixed' | 'Neutral';
    if (rating >= 4.0) sentiment = 'Positive';
    else if (rating <= 2.5) sentiment = 'Negative';
    else if (rating > 2.5 && rating < 4.0) sentiment = 'Mixed';
    else sentiment = 'Neutral';

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      trustLevel,
      rating,
      reviewCount,
      flags,
    );

    return {
      score: Math.round(trustScore),
      trustLevel,
      flags,
      sentiment,
      quality: Math.round(quality),
      recommendation,
    };
  }

  private generateRecommendation(
    trustLevel: string,
    rating: number,
    reviewCount: number,
    flags: string[],
  ): string {
    if (trustLevel === 'High') {
      return `✅ Reviews appear genuine! ${reviewCount} reviews with ${rating}★ rating. Safe to trust customer feedback.`;
    }

    if (trustLevel === 'Medium') {
      return `⚠️ Reviews seem mostly authentic but verify carefully. ${reviewCount} reviews with ${rating}★ rating. Read detailed reviews before buying.`;
    }

    if (trustLevel === 'Low') {
      return `⚠️ Review authenticity uncertain. Only ${reviewCount} reviews with ${rating}★ rating. Research more before purchasing.`;
    }

    // Suspicious
    return `🚫 Reviews might be manipulated! ${reviewCount} reviews with ${rating}★ rating. Check other sources and be cautious.`;
  }

  /**
   * Quick check if reviews are trustworthy
   */
  isReviewTrustworthy(rating: number, reviewCount: number): boolean {
    const analysis = this.analyzeReviews(rating, reviewCount);
    return analysis.score >= 50;
  }

  /**
   * Get review quality badge
   */
  getReviewBadge(score: number): string {
    if (score >= 80) return '🏆 Verified Reviews';
    if (score >= 60) return '✅ Trusted Reviews';
    if (score >= 40) return '⚠️ Check Reviews';
    return '🚫 Suspicious Reviews';
  }
}
