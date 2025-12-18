import { Injectable, Logger } from '@nestjs/common';

export interface SustainabilityAnalysis {
  score: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  factors: SustainabilityFactor[];
  certification: string[];
  impact: string;
  recommendation: string;
  breakeven: number; // How long until sustainable purchase pays off
}

export interface SustainabilityFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

@Injectable()
export class SustainabilityAnalyzerService {
  private readonly logger = new Logger(SustainabilityAnalyzerService.name);

  // Brand sustainability database
  private brandScores: Record<
    string,
    { base: number; certifications: string[] }
  > = {
    // High Ethical Brands (80+)
    patagonia: {
      base: 95,
      certifications: ['B Corp', 'Certified Climate Neutral', 'Fair Trade'],
    },
    organic: { base: 90, certifications: ['USDA Organic', 'Fair Trade'] },
    eco: { base: 85, certifications: ['Eco-Label', 'Carbon Neutral'] },

    // Good Ethical Brands (70-79)
    apple: { base: 75, certifications: ['Carbon Neutral', 'Fair Trade Gold'] },
    unilever: {
      base: 72,
      certifications: ['Rainforest Alliance', 'FSC Certified'],
    },
    microsoft: {
      base: 78,
      certifications: ['Carbon Negative', 'Renewable Energy'],
    },
    google: {
      base: 77,
      certifications: ['Carbon Neutral', 'Renewable Energy'],
    },

    // Medium Ethical Brands (60-69)
    nike: { base: 68, certifications: ['Fair Trade', 'Responsible Sports'] },
    adidas: {
      base: 67,
      certifications: ['Responsible Sports', 'Better Cotton'],
    },
    amazon: {
      base: 65,
      certifications: ['Climate Pledge', 'Renewable Energy'],
    },
    tesla: { base: 72, certifications: ['Zero Emissions', 'Clean Energy'] },

    // Need Improvement (50-59)
    puma: { base: 58, certifications: ['Better Cotton'] },
    'h&m': { base: 55, certifications: ['Conscious Collection'] },
    zara: { base: 52, certifications: [] },

    // Low Ethical Brands (Below 50)
    walmart: { base: 48, certifications: [] },
    alibaba: { base: 45, certifications: [] },
  };

  // Category-specific sustainability factors
  private categoryFactors: Record<string, SustainabilityFactor[]> = {
    Electronics: [
      {
        name: 'Energy Efficiency',
        score: 0,
        weight: 25,
        description: 'Power consumption and efficiency rating',
      },
      {
        name: 'Material Sourcing',
        score: 0,
        weight: 20,
        description: 'Use of recycled and conflict-free materials',
      },
      {
        name: 'Manufacturing',
        score: 0,
        weight: 20,
        description: 'Carbon footprint in production',
      },
      {
        name: 'E-Waste Recycling',
        score: 0,
        weight: 20,
        description: 'Take-back and recycling programs',
      },
      {
        name: 'Packaging',
        score: 0,
        weight: 15,
        description: 'Minimalist, recyclable packaging',
      },
    ],
    Fashion: [
      {
        name: 'Labor Practices',
        score: 0,
        weight: 25,
        description: 'Fair wages and worker conditions',
      },
      {
        name: 'Sustainable Materials',
        score: 0,
        weight: 25,
        description: 'Organic cotton, recycled fibers',
      },
      {
        name: 'Water Usage',
        score: 0,
        weight: 20,
        description: 'Water conservation in production',
      },
      {
        name: 'Chemical Safety',
        score: 0,
        weight: 15,
        description: 'Non-toxic dyes and chemicals',
      },
      {
        name: 'Transportation',
        score: 0,
        weight: 15,
        description: 'Local production and shipping',
      },
    ],
    Beauty: [
      {
        name: 'Natural Ingredients',
        score: 0,
        weight: 30,
        description: 'Percentage of natural vs synthetic',
      },
      {
        name: 'Cruelty-Free',
        score: 0,
        weight: 25,
        description: 'No animal testing',
      },
      {
        name: 'Packaging',
        score: 0,
        weight: 20,
        description: 'Recyclable and plastic-free',
      },
      {
        name: 'Chemical Safety',
        score: 0,
        weight: 15,
        description: 'Non-toxic and hypoallergenic',
      },
      {
        name: 'Fair Trade',
        score: 0,
        weight: 10,
        description: 'Fair trade sourcing',
      },
    ],
    Home: [
      {
        name: 'Durability',
        score: 0,
        weight: 20,
        description: 'Longevity and repairability',
      },
      {
        name: 'Energy Efficiency',
        score: 0,
        weight: 25,
        description: 'Energy star certification',
      },
      {
        name: 'Materials',
        score: 0,
        weight: 20,
        description: 'Recycled and sustainable materials',
      },
      {
        name: 'Manufacturing',
        score: 0,
        weight: 20,
        description: 'Local production, low waste',
      },
      {
        name: 'End-of-Life',
        score: 0,
        weight: 15,
        description: 'Recyclability at end of life',
      },
    ],
  };

  constructor() {
    this.logger.log('🌱 Sustainability Analyzer Service initialized');
  }

  /**
   * Analyze sustainability of a product based on brand and category
   */
  analyzeSustainability(
    brand: string,
    category: string,
    price: number,
    originalPrice?: number,
  ): SustainabilityAnalysis {
    const brandInfo = this.getBrandSustainabilityInfo(brand);
    const factors = this.calculateCategoryFactors(
      category,
      brandInfo.base,
      price,
      originalPrice,
    );
    const score = this.calculateWeightedScore(factors);
    const grade = this.getGradeFromScore(score);

    return {
      score: Math.round(score),
      grade,
      factors,
      certification: brandInfo.certifications,
      impact: this.generateImpactStatement(score, grade, brand),
      recommendation: this.generateRecommendation(score, grade),
      breakeven: this.calculateBreakeven(price, originalPrice, score),
    };
  }

  /**
   * Get brand sustainability information
   */
  private getBrandSustainabilityInfo(brand: string): {
    base: number;
    certifications: string[];
  } {
    const brandLower = brand.toLowerCase();

    for (const [key, value] of Object.entries(this.brandScores)) {
      if (brandLower.includes(key) || key.includes(brandLower)) {
        return value;
      }
    }

    // Default score for unknown brands
    return { base: 60, certifications: [] };
  }

  /**
   * Calculate category-specific sustainability factors
   */
  private calculateCategoryFactors(
    category: string,
    brandScore: number,
    price: number,
    originalPrice?: number,
  ): SustainabilityFactor[] {
    const baseFactors =
      this.categoryFactors[category] || this.categoryFactors['Electronics'];

    // Clone factors and calculate scores
    return baseFactors.map((factor) => ({
      ...factor,
      score: this.calculateFactorScore(
        factor.name,
        brandScore,
        price,
        originalPrice,
      ),
    }));
  }

  /**
   * Calculate individual factor score
   */
  private calculateFactorScore(
    factorName: string,
    brandScore: number,
    price: number,
    originalPrice?: number,
  ): number {
    let score = brandScore;

    // Adjust based on price (expensive = potentially better quality)
    if (price > 50000) score += 5;
    if (price > 100000) score += 8;

    // Adjust based on discount (larger discount might indicate sales, not sustainable)
    if (originalPrice && originalPrice > price) {
      const discountPercent = ((originalPrice - price) / originalPrice) * 100;
      if (discountPercent > 30) score -= 5; // Too much discount = possibly not premium/sustainable
    }

    // Factor-specific adjustments
    switch (factorName) {
      case 'Durability':
        score += price > 30000 ? 10 : 5; // Expensive items usually more durable
        break;
      case 'Cruelty-Free':
        score = Math.min(100, score + 15); // Premium boost for explicitly cruelty-free
        break;
      case 'Natural Ingredients':
        score += 8;
        break;
      case 'Fair Trade':
        score += 12;
        break;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate weighted sustainability score
   */
  private calculateWeightedScore(factors: SustainabilityFactor[]): number {
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    const weightedSum = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
    return weightedSum / totalWeight;
  }

  /**
   * Get letter grade from score
   */
  private getGradeFromScore(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate impact statement
   */
  private generateImpactStatement(
    score: number,
    grade: string,
    brand: string,
  ): string {
    if (score >= 90) {
      return `Excellent choice! ${brand} is a sustainability leader. Buying this product supports ethical and environmental practices.`;
    }
    if (score >= 75) {
      return `Good sustainability practices. ${brand} demonstrates commitment to ethical sourcing and environmental responsibility.`;
    }
    if (score >= 60) {
      return `Average sustainability. ${brand} is making improvements but has room for growth in ethical practices.`;
    }
    if (score >= 45) {
      return `Consider alternatives. ${brand} has limited sustainability initiatives. Look for better options.`;
    }
    return `Poor sustainability record. We recommend choosing a brand with stronger ethical and environmental commitments.`;
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(score: number, grade: string): string {
    if (score >= 85) {
      return 'Highly recommended - strong sustainable choice';
    }
    if (score >= 70) {
      return 'Recommended with mindfulness - consider resale/durability';
    }
    if (score >= 60) {
      return 'Acceptable - but explore eco-friendly alternatives';
    }
    if (score >= 50) {
      return 'Consider alternatives - other brands have better practices';
    }
    return 'Not recommended - choose a more sustainable option';
  }

  /**
   * Calculate breakeven point (how long until premium sustainable product pays off)
   */
  private calculateBreakeven(
    price: number,
    originalPrice?: number,
    score?: number,
  ): number {
    const scoreMultiplier = score ? (score / 100) * 0.5 + 0.5 : 0.75; // 50-100% factor based on score

    // More sustainable = shorter breakeven
    const baseDays = Math.max(30, Math.min(1000, (price / 1000) * 100)); // Scale with price
    return Math.round(baseDays * (1 - (scoreMultiplier - 0.5)));
  }

  /**
   * Compare sustainability of two products
   */
  compareProducts(
    brand1: string,
    category1: string,
    price1: number,
    brand2: string,
    category2: string,
    price2: number,
  ): {
    product1: SustainabilityAnalysis;
    product2: SustainabilityAnalysis;
    recommendation: string;
  } {
    const analysis1 = this.analyzeSustainability(brand1, category1, price1);
    const analysis2 = this.analyzeSustainability(brand2, category2, price2);

    let recommendation = '';
    if (analysis1.score > analysis2.score + 10) {
      recommendation = `Product 1 (${brand1}) is more sustainable`;
    } else if (analysis2.score > analysis1.score + 10) {
      recommendation = `Product 2 (${brand2}) is more sustainable`;
    } else {
      recommendation = 'Both products have similar sustainability profiles';
    }

    return { product1: analysis1, product2: analysis2, recommendation };
  }
}
