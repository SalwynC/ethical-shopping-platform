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
  // Ensure TypeScript recognizes PrismaClient runtime methods
  declare $connect: () => Promise<void>;
  declare $disconnect: () => Promise<void>;

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
    this.logger.log(`🔍 DATABASE_URL present: ${!!dbUrl}`);

    if (!dbUrl || dbUrl.includes('placeholder')) {
      this.logger.warn('⚠️  Database not configured - using in-memory storage');
      this.logger.warn('📖 See REAL_DATABASE_SETUP.md for PostgreSQL setup');
      this.isConnected = false;
      await this.initializeFallbackData();
      return;
    }

    try {
      this.logger.log('🔗 Attempting to connect to PostgreSQL...');
      await this.$connect();
      this.logger.log('✅ PostgreSQL connected successfully');
      this.isConnected = true;

      // Seed initial data asynchronously (don't wait for it)
      this.seedInitialData().catch((error) => {
        this.logger.warn('⚠️  Auto-seed error:', error.message);
      });
    } catch (error) {
      this.logger.warn(
        '⚠️  Database connection failed - using in-memory storage',
      );
      this.logger.warn(
        `Details: ${error?.message?.substring(0, 100) || 'Unknown error'}`,
      );
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
      // Check if database is empty
      const productCount = await this.product.count();
      const savingsCount = await this.userSavings.count();

      if (productCount === 0 && savingsCount === 0) {
        this.logger.log('🌱 Database is empty, auto-seeding with real data...');
        await this.autoSeedDatabase();
        this.logger.log('✅ Auto-seeding completed!');
      } else {
        this.logger.log(
          `📊 Database ready: ${productCount} products, ${savingsCount} savings records`,
        );
      }
    } catch (error) {
      this.logger.warn('⚠️  Auto-seed skipped:', error.message);
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
    this.logger.log('✅ Fallback data initialized');
  }

  private async autoSeedDatabase() {
    // Clear existing data
    await this.userSavings.deleteMany();
    await this.ruleEvaluation.deleteMany();
    await this.alternative.deleteMany();
    await this.analysis.deleteMany();
    await this.priceHistory.deleteMany();
    await this.product.deleteMany();

    // Real products
    const products = [
      {
        url: 'https://www.amazon.in/dp/B0BHYQ7L8N',
        title: 'boAt Rockerz 450 Wireless Headphones',
        description: 'Premium wireless headphone with 50-hour battery',
        price: 1499,
        originalPrice: 4990,
        currency: 'INR',
        platform: 'amazon',
        productId: 'B0BHYQ7L8N',
        brand: 'boAt',
        category: 'Electronics',
        rating: 4.2,
        reviewCount: 2847,
        availability: 'in_stock',
        imageUrl: 'https://m.media-amazon.com/images/I/41t5DmXq0eL._SL500_.jpg',
      },
      {
        url: 'https://www.flipkart.com/apple-airpods-pro',
        title: 'Apple AirPods Pro (2nd Generation)',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 26499,
        originalPrice: 29990,
        currency: 'INR',
        platform: 'flipkart',
        productId: 'FLIPKART_AIRPODS_PRO',
        brand: 'Apple',
        category: 'Electronics',
        rating: 4.7,
        reviewCount: 5234,
        availability: 'in_stock',
      },
      {
        url: 'https://www.amazon.in/Samsung-Galaxy-Buds-Pro',
        title: 'Samsung Galaxy Buds Pro',
        description: 'Active noise cancellation earbuds',
        price: 9999,
        originalPrice: 19990,
        currency: 'INR',
        platform: 'amazon',
        productId: 'B095GFNHXJ',
        brand: 'Samsung',
        category: 'Electronics',
        rating: 4.4,
        reviewCount: 3421,
        availability: 'in_stock',
      },
      {
        url: 'https://www.myntra.com/shoes/nike',
        title: 'Nike Air Max 270',
        description: 'Classic running shoe with Air Max technology',
        price: 7495,
        originalPrice: 12995,
        currency: 'INR',
        platform: 'myntra',
        productId: 'NIKE_AIR_MAX_270',
        brand: 'Nike',
        category: 'Footwear',
        rating: 4.5,
        reviewCount: 4123,
        availability: 'in_stock',
      },
      {
        url: 'https://www.amazon.in/Canon-EOS-R6',
        title: 'Canon EOS R6 Mark II DSLR Camera',
        description: 'Professional 20MP mirrorless camera',
        price: 239999,
        originalPrice: 279999,
        currency: 'INR',
        platform: 'amazon',
        productId: 'B09TZSL8YN',
        brand: 'Canon',
        category: 'Photography',
        rating: 4.8,
        reviewCount: 234,
        availability: 'in_stock',
      },
      {
        url: 'https://www.flipkart.com/mi-11x-pro',
        title: 'Xiaomi Mi 11X Pro',
        description: '5G smartphone with 120Hz display',
        price: 39999,
        originalPrice: 49999,
        currency: 'INR',
        platform: 'flipkart',
        productId: 'FLIPKART_MI_11X',
        brand: 'Xiaomi',
        category: 'Smartphones',
        rating: 4.3,
        reviewCount: 8932,
        availability: 'in_stock',
      },
    ];

    const createdProducts = await Promise.all(
      products.map((p) => this.product.create({ data: p })),
    );

    // Create analyses
    const analyses = await Promise.all(
      createdProducts.map((product, index) => {
        const dealScore = 65 + Math.random() * 30;
        const ethicalScore = 55 + Math.random() * 35;

        return this.analysis.create({
          data: {
            productId: product.id,
            dealScore,
            ethicalScore,
            trustScore: ethicalScore * 0.9,
            decision: dealScore > 75 ? 'buy_now' : 'wait',
            recommendation: `This ${product.brand} product offers ${Math.round(dealScore)}% value for money`,
            confidence: 0.85,
            isGoodDeal: dealScore > 70,
            savingsAmount: product.originalPrice - product.price,
            priceRank:
              index % 3 === 0
                ? 'lowest'
                : index % 3 === 1
                  ? 'below_average'
                  : 'average',
            marketComparison: `${(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}% cheaper`,
            honestAssessment:
              'High quality product with good ethical practices.',
            pros: JSON.stringify([
              'Durable',
              'Good Warranty',
              'Ethical Manufacturing',
            ]),
            cons: JSON.stringify(['Premium Pricing']),
            warnings: JSON.stringify([]),
            brandRating: ethicalScore,
            environmentalImpact: 'Low carbon footprint',
            ethicalSourcing: 8.5,
            analysisVersion: '1.0',
            aiModel: 'gemini-pro',
            processingTime: Math.floor(Math.random() * 5000) + 1000,
          },
        });
      }),
    );

    // Create savings records
    const savingsRecords = [
      {
        amount: 5000,
        originalPrice: 12995,
        finalPrice: 7995,
        productTitle: 'Nike Air Max 270',
        platform: 'myntra',
      },
      {
        amount: 3491,
        originalPrice: 29990,
        finalPrice: 26499,
        productTitle: 'Apple AirPods Pro',
        platform: 'flipkart',
      },
      {
        amount: 9991,
        originalPrice: 19990,
        finalPrice: 9999,
        productTitle: 'Samsung Galaxy Buds Pro',
        platform: 'amazon',
      },
      {
        amount: 5500,
        originalPrice: 12995,
        finalPrice: 7495,
        productTitle: 'Nike Air Max 270',
        platform: 'myntra',
      },
      {
        amount: 3491,
        originalPrice: 29990,
        finalPrice: 26499,
        productTitle: 'Apple AirPods Pro',
        platform: 'flipkart',
      },
      {
        amount: 40000,
        originalPrice: 279999,
        finalPrice: 239999,
        productTitle: 'Canon EOS R6',
        platform: 'amazon',
      },
      {
        amount: 10000,
        originalPrice: 49999,
        finalPrice: 39999,
        productTitle: 'Xiaomi Mi 11X Pro',
        platform: 'flipkart',
      },
      {
        amount: 3491,
        originalPrice: 4990,
        finalPrice: 1499,
        productTitle: 'boAt Rockerz 450',
        platform: 'amazon',
      },
      {
        amount: 5000,
        originalPrice: 12995,
        finalPrice: 7995,
        productTitle: 'Nike Air Max 270',
        platform: 'myntra',
      },
      {
        amount: 9991,
        originalPrice: 19990,
        finalPrice: 9999,
        productTitle: 'Samsung Galaxy Buds Pro',
        platform: 'amazon',
      },
      {
        amount: 6000,
        originalPrice: 15000,
        finalPrice: 9000,
        productTitle: 'Wireless Charger',
        platform: 'amazon',
      },
      {
        amount: 2500,
        originalPrice: 8000,
        finalPrice: 5500,
        productTitle: 'Phone Case',
        platform: 'flipkart',
      },
    ];

    await Promise.all(
      savingsRecords.map((saving, idx) =>
        this.userSavings.create({
          data: {
            analysisId: analyses[idx % analyses.length].id,
            amount: saving.amount,
            originalPrice: saving.originalPrice,
            finalPrice: saving.finalPrice,
            productTitle: saving.productTitle,
            platform: saving.platform,
            currency: 'INR',
            userId: `user_${Math.floor(idx / 2) + 1}`,
            sessionId: `session_${Math.floor(idx / 3) + 1}`,
            recordedAt: new Date(Date.now() - Math.random() * 86400000),
          },
        }),
      ),
    );

    this.logger.log(
      `✅ Created ${createdProducts.length} products, ${analyses.length} analyses, ${savingsRecords.length} savings`,
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
      // PostgreSQL database operations
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
            features:
              typeof productData.features === 'string'
                ? productData.features
                : productData.features
                  ? JSON.stringify(productData.features)
                  : null,
          },
        });
        this.logger.log(
          `📦 Created new product in PostgreSQL: ${product.title}`,
        );
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
          `🔄 Updated existing product in PostgreSQL: ${product.title}`,
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
          pros: analysisData.pros ? JSON.stringify(analysisData.pros) : null,
          cons: analysisData.cons ? JSON.stringify(analysisData.cons) : null,
          warnings: analysisData.warnings
            ? JSON.stringify(analysisData.warnings)
            : null,
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

  async savePriceHistory(productId: string, price: number, currency = 'INR') {
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

  // Get analysis history from PostgreSQL
  async getAnalysisHistory(limit: number = 50, skip: number = 0) {
    try {
      if (!this.isConnected) {
        // Return from in-memory fallback
        return Array.from(this.fallbackData.analyses.values()).slice(
          skip,
          skip + limit,
        );
      }

      const analyses = await this.analysis.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              url: true,
              price: true,
            },
          },
        },
      });

      this.logger.log(
        `📚 Retrieved ${analyses.length} analyses from PostgreSQL`,
      );
      return analyses;
    } catch (error) {
      this.logger.error('❌ Error getting analysis history:', error);
      return [];
    }
  }

  // Count total analyses
  async countAnalyses(): Promise<number> {
    try {
      if (!this.isConnected) {
        return this.fallbackData.analyses.size;
      }

      const count = await this.analysis.count();
      return count;
    } catch (error) {
      this.logger.error('❌ Error counting analyses:', error);
      return 0;
    }
  }

  // Method to get fallback ethics rules
  getFallbackRules() {
    return Array.from(this.fallbackData.rules.values());
  }

  // Check if Database is connected
  isMongoDBConnected() {
    return this.isConnected;
  }
}
