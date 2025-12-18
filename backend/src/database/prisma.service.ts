import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;
  private fallbackData = {
    products: new Map(),
    analyses: new Map(),
    rules: new Map(),
  };

  async onModuleInit() {
    // Check if DATABASE_URL is properly configured
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes('placeholder')) {
      this.logger.warn('⚠️  MongoDB not configured - using in-memory storage');
      this.logger.warn(
        '📖 See MONGODB_SETUP.md for MongoDB setup instructions',
      );
      this.isConnected = false;
      await this.initializeFallbackData();
      return;
    }

    try {
      await this.$connect();
      this.logger.log('✅ MongoDB connected successfully');
      this.isConnected = true;

      // Seed initial data if needed
      await this.seedInitialData();
    } catch (error) {
      this.logger.warn(
        '⚠️  MongoDB connection failed - using in-memory storage',
      );
      this.logger.warn(
        '📋 Connection Issue: IP not whitelisted in MongoDB Atlas',
      );
      this.logger.warn(
        '📝 Fix: Go to https://cloud.mongodb.com/ → Network Access → Allow your IP',
      );
      this.logger.warn(`Details: ${error.message.substring(0, 100)}`);
      this.isConnected = false;

      // Initialize fallback data
      await this.initializeFallbackData();
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Database disconnected');
  }

  private async seedInitialData() {
    try {
      // Check if ethics rules exist
      try {
        const rulesCount = await this.ethicsRule.count();

        if (rulesCount === 0) {
          this.logger.log('🌱 Seeding initial ethics rules...');

          const ethicsRules = [
            {
              name: 'Labor Practices',
              category: 'labor',
              description: 'Fair labor practices and working conditions',
              weight: 0.3,
              criteria: {
                factors: ['fair_wages', 'worker_rights', 'safety_standards'],
                thresholds: { excellent: 90, good: 70, average: 50 },
              },
            },
            {
              name: 'Environmental Impact',
              category: 'environment',
              description: 'Environmental sustainability and carbon footprint',
              weight: 0.25,
              criteria: {
                factors: [
                  'carbon_footprint',
                  'renewable_energy',
                  'waste_management',
                ],
                thresholds: { excellent: 85, good: 65, average: 45 },
              },
            },
            {
              name: 'Supply Chain Transparency',
              category: 'transparency',
              description: 'Transparency in supply chain and sourcing',
              weight: 0.2,
              criteria: {
                factors: ['supplier_disclosure', 'traceability', 'auditing'],
                thresholds: { excellent: 80, good: 60, average: 40 },
              },
            },
            {
              name: 'Community Impact',
              category: 'community',
              description: 'Positive impact on local communities',
              weight: 0.15,
              criteria: {
                factors: [
                  'local_sourcing',
                  'community_programs',
                  'economic_impact',
                ],
                thresholds: { excellent: 75, good: 55, average: 35 },
              },
            },
            {
              name: 'Corporate Governance',
              category: 'governance',
              description: 'Ethical business practices and governance',
              weight: 0.1,
              criteria: {
                factors: [
                  'transparency',
                  'ethics_code',
                  'stakeholder_engagement',
                ],
                thresholds: { excellent: 85, good: 65, average: 45 },
              },
            },
          ];

          for (const rule of ethicsRules) {
            await this.ethicsRule.create({
              data: rule,
            });
          }

          this.logger.log(`✅ Seeded ${ethicsRules.length} ethics rules`);
        }
      } catch (seedError) {
        this.logger.warn(
          '⚠️  Could not seed database (will use in-memory fallback)',
        );
      }
    } catch (error) {
      this.logger.error(
        '❌ Error seeding data:',
        error.message.substring(0, 50),
      );
    }
  }

  private async initializeFallbackData() {
    this.logger.log('🔄 Initializing in-memory fallback data...');

    // Initialize ethics rules in memory
    const ethicsRules = [
      {
        id: '1',
        name: 'Labor Practices',
        category: 'labor',
        description: 'Fair labor practices and working conditions',
        weight: 0.3,
      },
      {
        id: '2',
        name: 'Environmental Impact',
        category: 'environment',
        description: 'Environmental sustainability and carbon footprint',
        weight: 0.25,
      },
      {
        id: '3',
        name: 'Supply Chain Transparency',
        category: 'transparency',
        description: 'Transparency in supply chain and sourcing',
        weight: 0.2,
      },
      {
        id: '4',
        name: 'Community Impact',
        category: 'community',
        description: 'Positive impact on local communities',
        weight: 0.15,
      },
      {
        id: '5',
        name: 'Corporate Governance',
        category: 'governance',
        description: 'Ethical business practices and governance',
        weight: 0.1,
      },
    ];

    ethicsRules.forEach((rule) => {
      this.fallbackData.rules.set(rule.id, rule);
    });

    this.logger.log(
      `✅ Initialized ${ethicsRules.length} ethics rules in memory`,
    );
  }

  // Helper methods for common queries
  async findOrCreateProduct(url: string, productData: any) {
    if (!this.isConnected) {
      // Use in-memory fallback
      const productId = Date.now().toString();
      const product = {
        id: productId,
        url,
        title: productData.title,
        description: productData.description,
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        currency: productData.currency || 'INR',
        platform: productData.platform,
        productId: productData.productId,
        brand: productData.brand,
        category: productData.category,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        availability: productData.availability || 'unknown',
        imageUrl: productData.imageUrl,
        features: productData.features || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.fallbackData.products.set(product.id, product);
      this.logger.log(`📦 Created product in memory: ${product.title}`);
      return product;
    }

    try {
      // MongoDB database operations
      let product = await this.product.findUnique({
        where: { url },
      });

      if (!product) {
        product = await this.product.create({
          data: {
            url,
            title: productData.title,
            description: productData.description,
            price: productData.price || 0,
            originalPrice: productData.originalPrice,
            currency: productData.currency || 'INR',
            platform: productData.platform,
            productId: productData.productId,
            brand: productData.brand,
            category: productData.category,
            rating: productData.rating,
            reviewCount: productData.reviewCount,
            availability: productData.availability || 'unknown',
            imageUrl: productData.imageUrl,
            features: productData.features || null,
          },
        });
        this.logger.log(`📦 Created new product in MongoDB: ${product.title}`);
      } else {
        product = await this.product.update({
          where: { id: product.id },
          data: {
            price: productData.price || product.price,
            originalPrice: productData.originalPrice || product.originalPrice,
            rating: productData.rating || product.rating,
            reviewCount: productData.reviewCount || product.reviewCount,
            availability: productData.availability || product.availability,
            updatedAt: new Date(),
          },
        });
        this.logger.log(
          `🔄 Updated existing product in MongoDB: ${product.title}`,
        );
      }

      return product;
    } catch (error) {
      this.logger.error('❌ Error in findOrCreateProduct:', error);
      throw error;
    }
  }

  async saveAnalysis(productId: string, analysisData: any) {
    if (!this.isConnected) {
      // Use in-memory fallback
      const analysisId = Date.now().toString();
      const analysis = {
        id: analysisId,
        productId,
        dealScore: analysisData.dealScore,
        ethicalScore: analysisData.ethicalScore,
        trustScore: analysisData.trustScore || 70,
        decision: analysisData.decision,
        recommendation: analysisData.recommendation,
        confidence: analysisData.confidence,
        createdAt: new Date(),
      };

      this.fallbackData.analyses.set(analysisId, analysis);
      this.logger.log(`📊 Saved analysis in memory for product: ${productId}`);
      return analysis;
    }

    try {
      const analysis = await this.analysis.create({
        data: {
          productId,
          dealScore: analysisData.dealScore,
          ethicalScore: analysisData.ethicalScore,
          trustScore: analysisData.trustScore || 70,
          decision: analysisData.decision,
          recommendation: analysisData.recommendation,
          confidence: analysisData.confidence,
          isGoodDeal: analysisData.isGoodDeal,
          savingsAmount: analysisData.savingsAmount,
          priceRank: analysisData.priceRank,
          marketComparison: analysisData.marketComparison,
          honestAssessment: analysisData.honestAssessment,
          pros: analysisData.pros || [],
          cons: analysisData.cons || [],
          warnings: analysisData.warnings || [],
          brandRating: analysisData.brandRating || 60,
          environmentalImpact: analysisData.environmentalImpact || 'Unknown',
          ethicalSourcing: analysisData.ethicalSourcing || 60,
          aiModel: analysisData.aiModel || 'gemini-pro',
          processingTime: analysisData.processingTime || 0,
        },
      });

      // Save alternatives if any
      if (analysisData.alternatives && analysisData.alternatives.length > 0) {
        for (const alt of analysisData.alternatives) {
          await this.alternative.create({
            data: {
              analysisId: analysis.id,
              title: alt.title,
              url: alt.url,
              price: alt.price,
              ethicalScore: alt.ethicalScore || alt.score,
              rationale: alt.rationale || alt.reason,
              confidence: alt.confidence || 75,
              platform: alt.platform || 'unknown',
            },
          });
        }
      }

      this.logger.log(`📊 Saved analysis for product: ${productId}`);
      return analysis;
    } catch (error) {
      this.logger.error('❌ Error saving analysis:', error);
      throw error;
    }
  }

  async savePriceHistory(
    productId: string,
    price: number,
    currency = 'INR',
    source = 'direct_scrape',
  ) {
    if (!this.isConnected) {
      this.logger.log('ℹ️ Skipping saving price history (no DB connection)');
      return;
    }

    try {
      await this.priceHistory.create({
        data: {
          productId,
          price,
          currency,
          source,
        },
      });
    } catch (error) {
      this.logger.error('❌ Error saving price history:', error);
    }
  }

  async getAnalyticsData() {
    try {
      const totalAnalyses = await this.analysis.count();
      const recentAnalyses = await this.analysis.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { platform: true },
          },
        },
      });

      const platformStats = recentAnalyses.reduce(
        (acc, analysis) => {
          const platform = analysis.product.platform;
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const avgDealScore =
        recentAnalyses.length > 0
          ? recentAnalyses.reduce((sum, a) => sum + a.dealScore, 0) /
            recentAnalyses.length
          : 0;

      const avgEthicalScore =
        recentAnalyses.length > 0
          ? recentAnalyses.reduce((sum, a) => sum + a.ethicalScore, 0) /
            recentAnalyses.length
          : 0;

      return {
        totalAnalyses,
        platformStats,
        avgDealScore: Math.round(avgDealScore * 10) / 10,
        avgEthicalScore: Math.round(avgEthicalScore * 10) / 10,
        recentAnalyses: recentAnalyses.slice(0, 10),
      };
    } catch (error) {
      this.logger.error('❌ Error getting analytics:', error);
      return {
        totalAnalyses: 0,
        platformStats: {},
        avgDealScore: 0,
        avgEthicalScore: 0,
        recentAnalyses: [],
      };
    }
  }

  // Method to get fallback ethics rules
  getFallbackRules() {
    return Array.from(this.fallbackData.rules.values());
  }

  // Check if MongoDB is connected
  isMongoDBConnected() {
    return this.isConnected;
  }
}
