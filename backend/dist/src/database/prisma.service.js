"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.isConnected = false;
        this.fallbackData = {
            products: new Map(),
            analyses: new Map(),
            rules: new Map(),
        };
    }
    async onModuleInit() {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl || dbUrl.includes('placeholder')) {
            this.logger.warn('⚠️  Database not configured - using in-memory storage');
            this.logger.warn('📖 See REAL_DATABASE_SETUP.md for PostgreSQL setup');
            this.isConnected = false;
            await this.initializeFallbackData();
            return;
        }
        try {
            await this.$connect();
            this.logger.log('✅ PostgreSQL connected successfully');
            this.isConnected = true;
            await this.seedInitialData();
        }
        catch (error) {
            this.logger.warn('⚠️  Database connection failed - using in-memory storage');
            this.logger.warn(`Details: ${error.message.substring(0, 100)}`);
            this.isConnected = false;
            await this.initializeFallbackData();
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('🔌 Database disconnected');
    }
    async seedInitialData() {
        this.logger.log('ℹ️ Using in-memory ethics rules fallback');
    }
    async initializeFallbackData() {
        this.logger.log('🔄 Initializing in-memory fallback data...');
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
        this.logger.log(`✅ Initialized ${ethicsRules.length} ethics rules in memory`);
    }
    async findOrCreateProduct(url, productData) {
        if (!this.isConnected) {
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
                        features: typeof productData.features === 'string'
                            ? productData.features
                            : productData.features
                                ? JSON.stringify(productData.features)
                                : null,
                    },
                });
                this.logger.log(`📦 Created new product in PostgreSQL: ${product.title}`);
            }
            else {
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
                this.logger.log(`🔄 Updated existing product in PostgreSQL: ${product.title}`);
            }
            return product;
        }
        catch (error) {
            this.logger.error('❌ Error in findOrCreateProduct:', error);
            throw error;
        }
    }
    async saveAnalysis(productId, analysisData) {
        if (!this.isConnected) {
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
                    pros: analysisData.pros
                        ? JSON.stringify(analysisData.pros)
                        : null,
                    cons: analysisData.cons
                        ? JSON.stringify(analysisData.cons)
                        : null,
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
        }
        catch (error) {
            this.logger.error('❌ Error saving analysis:', error);
            throw error;
        }
    }
    async savePriceHistory(productId, price, currency = 'INR') {
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
        }
        catch (error) {
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
            const platformStats = recentAnalyses.reduce((acc, analysis) => {
                const platform = analysis.product.platform;
                acc[platform] = (acc[platform] || 0) + 1;
                return acc;
            }, {});
            const avgDealScore = recentAnalyses.length > 0
                ? recentAnalyses.reduce((sum, a) => sum + a.dealScore, 0) /
                    recentAnalyses.length
                : 0;
            const avgEthicalScore = recentAnalyses.length > 0
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
        }
        catch (error) {
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
    getFallbackRules() {
        return Array.from(this.fallbackData.rules.values());
    }
    isMongoDBConnected() {
        return this.isConnected;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map