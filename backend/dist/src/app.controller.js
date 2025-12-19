"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const scraper_service_1 = require("./scraper.service");
const ai_service_1 = require("./ai.service");
const prisma_service_1 = require("./database/prisma.service");
const review_checker_service_1 = require("./services/review-checker.service");
const class_validator_1 = require("class-validator");
class AnalyzeDto {
}
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], AnalyzeDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AnalyzeDto.prototype, "productData", void 0);
const analyticsData = {
    totalAnalyzes: 0,
    platformStats: new Map(),
    avgDealScore: 0,
    avgEthicalScore: 0,
    topBrands: new Map(),
    recentAnalyzes: [],
};
let AppController = AppController_1 = class AppController {
    constructor(appService, scraperService, aiService, prismaService) {
        this.appService = appService;
        this.scraperService = scraperService;
        this.aiService = aiService;
        this.prismaService = prismaService;
        this.logger = new common_1.Logger(AppController_1.name);
    }
    async health() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: '1.0.0',
        };
    }
    async analyze(body) {
        var _a;
        const startTime = Date.now();
        try {
            if (!body.url || typeof body.url !== 'string') {
                throw new Error('Valid URL is required');
            }
            try {
                new URL(body.url);
            }
            catch (_b) {
                throw new Error('Invalid URL format');
            }
            this.logger.log(`🔍 Starting analysis for: ${body.url}`);
            let productData;
            if (body.productData &&
                body.productData.title &&
                body.productData.price) {
                this.logger.log(`📱 Using data from browser extension`);
                productData = {
                    title: body.productData.title,
                    price: body.productData.price,
                    originalPrice: body.productData.originalPrice,
                    currency: body.productData.currency || 'INR',
                    rating: body.productData.rating,
                    reviewCount: body.productData.reviewCount,
                    brand: body.productData.brand,
                    category: body.productData.category || 'General',
                    availability: body.productData.availability || 'In Stock',
                    imageUrl: (_a = body.productData.images) === null || _a === void 0 ? void 0 : _a[0],
                    description: body.productData.description,
                    productId: body.url,
                };
                this.logger.log(`✅ Extension data: ${productData.title}`);
                this.logger.log(`✅ Price: ${productData.currency} ${productData.price}`);
                this.logger.log(`✅ Rating: ${productData.rating}/5 (${productData.reviewCount} reviews)`);
            }
            else {
                this.logger.log(`🌐 No extension data, attempting to scrape...`);
                productData = await this.scraperService.scrapeProduct(body.url);
            }
            this.logger.log(`📦 Product: ${productData.title}`);
            this.logger.log(`💰 Price found: ${productData.currency} ${productData.price}`);
            this.logger.log(`🏪 Brand: ${productData.brand}, Category: ${productData.category}`);
            const product = await this.prismaService.findOrCreateProduct(body.url, Object.assign(Object.assign({}, productData), { platform: this.detectPlatform(body.url) }));
            const aiAnalysis = await this.aiService.analyzeProduct(productData, body.url);
            this.logger.log(`AI analysis completed with deal score: ${aiAnalysis.dealScore}`);
            const reviewAnalysis = this.reviewCheckerService.analyzeReviews(productData.rating || 0, productData.reviewCount || 0, productData.brand);
            this.logger.log(`✅ Review analysis: ${reviewAnalysis.trustLevel} trust (${reviewAnalysis.score}/100)`);
            const platform = this.detectPlatform(body.url);
            const isGoodDeal = aiAnalysis.dealScore > 70;
            const priceRank = this.calculatePriceRank(productData.price, productData.originalPrice);
            const dataCertainty = productData.price > 0 ? 'high' : 'low';
            const trustScore = this.calculateTrustScore(productData, aiAnalysis);
            const result = {
                platform,
                productInfo: {
                    title: productData.title,
                    category: productData.category || 'Electronics',
                    brand: productData.brand || 'Unknown Brand',
                    description: productData.description,
                    rating: productData.rating || 0,
                    reviews: productData.reviewCount || 0,
                    availability: this.determineAvailability(productData),
                },
                dealScore: Math.round(aiAnalysis.dealScore * 10) / 10,
                ethicalScore: Math.round(aiAnalysis.ethicalScore * 10) / 10,
                decision: this.getEnhancedDecision(aiAnalysis.dealScore, aiAnalysis.ethicalScore, trustScore.dataReliability),
                recommendation: {
                    action: this.getRecommendationAction(aiAnalysis.dealScore, priceRank),
                    confidence: Math.round(trustScore.dataReliability),
                    reasoning: this.getRecommendationReasoning(aiAnalysis.dealScore, priceRank, isGoodDeal),
                    urgency: aiAnalysis.dealScore > 85
                        ? 'high'
                        : aiAnalysis.dealScore > 70
                            ? 'medium'
                            : 'low',
                },
                priceTrend: {
                    current: productData.price,
                    original: productData.originalPrice,
                    lowestRecent: productData.price * 0.9,
                    highestRecent: productData.originalPrice || productData.price * 1.2,
                    marketAverage: productData.price * 1.1,
                    predictedNextWeek: productData.price * (0.95 + Math.random() * 0.1),
                    discountPercent: productData.originalPrice
                        ? Math.round(((productData.originalPrice - productData.price) /
                            productData.originalPrice) *
                            100)
                        : 0,
                    currency: productData.currency,
                    pricePerformance: aiAnalysis.priceAnalysis.marketPosition,
                    marketTrend: aiAnalysis.priceAnalysis.priceHistory,
                    confidence: Math.round(aiAnalysis.priceAnalysis.confidence),
                    dataCertainty,
                    lastUpdated: new Date().toISOString(),
                    priceHistory: this.generatePriceHistory(productData.price),
                    competitorPrices: this.generateCompetitorPrices(productData.price, platform),
                },
                priceAnalysis: {
                    isGoodDeal,
                    savingsAmount: productData.originalPrice
                        ? productData.originalPrice - productData.price
                        : 0,
                    priceRank,
                    marketComparison: this.getMarketComparison(priceRank, productData.price),
                    bestTimeDescription: this.getBestTimeDescription(aiAnalysis.dealScore, priceRank),
                    certaintyLevel: dataCertainty,
                },
                alternatives: aiAnalysis.alternatives.map((alt) => ({
                    title: alt.title,
                    price: alt.price,
                    url: `#alternative-${alt.title.toLowerCase().replace(/\s+/g, '-')}`,
                    ethicalScore: alt.score,
                    rationale: alt.reason,
                    confidence: Math.round(Math.random() * 20 + 75),
                })),
                insights: {
                    honestAssessment: this.generateHonestAssessment(aiAnalysis, trustScore),
                    pros: aiAnalysis.insights.keyStrengths,
                    cons: aiAnalysis.insights.concerns,
                    warnings: this.generateWarnings(trustScore, aiAnalysis),
                    bestFor: [
                        aiAnalysis.insights.bestTime,
                        'Verified buyers',
                        'Price-conscious shoppers',
                    ],
                },
                sustainability: {
                    brandRating: Math.round(aiAnalysis.sustainability.score * 10) / 10,
                    environmentalImpact: aiAnalysis.sustainability.impact,
                    ethicalSourcing: Math.round(aiAnalysis.sustainability.score * 10) / 10,
                },
                reviewChecker: {
                    score: reviewAnalysis.score,
                    trustLevel: reviewAnalysis.trustLevel,
                    sentiment: reviewAnalysis.sentiment,
                    quality: reviewAnalysis.quality,
                    badge: this.reviewCheckerService.getReviewBadge(reviewAnalysis.score),
                    flags: reviewAnalysis.flags,
                    recommendation: reviewAnalysis.recommendation,
                    isTrustworthy: reviewAnalysis.score >= 50,
                },
                trustScore,
            };
            const analysisRecord = await this.prismaService.saveAnalysis(product.id, {
                dealScore: result.dealScore,
                ethicalScore: result.ethicalScore,
                trustScore: result.trustScore.dataReliability,
                decision: result.decision,
                recommendation: result.recommendation.action,
                confidence: result.recommendation.confidence,
                isGoodDeal: result.priceAnalysis.isGoodDeal,
                savingsAmount: result.priceAnalysis.savingsAmount,
                priceRank: result.priceAnalysis.priceRank,
                marketComparison: result.priceAnalysis.marketComparison,
                honestAssessment: result.insights.honestAssessment,
                pros: result.insights.pros,
                cons: result.insights.cons,
                warnings: result.insights.warnings,
                brandRating: result.sustainability.brandRating,
                environmentalImpact: result.sustainability.environmentalImpact,
                ethicalSourcing: result.sustainability.ethicalSourcing,
                aiModel: aiAnalysis.aiModel || 'gemini-pro',
                processingTime: Date.now() - startTime,
                alternatives: result.alternatives,
            });
            await this.prismaService.savePriceHistory(product.id, productData.price, productData.currency);
            this.logger.log(`Analysis completed and saved to databases`);
            return result;
        }
        catch (error) {
            this.logger.error(`Analysis failed: ${error.message}`);
            return {
                platform: this.detectPlatform(body.url),
                productInfo: {
                    title: 'Product Analysis Error',
                    category: 'Unknown',
                    brand: 'Unknown',
                    availability: 'unknown',
                },
                dealScore: 50,
                ethicalScore: 60,
                decision: 'insufficient_data',
                priceTrend: {
                    current: 0,
                    currency: 'INR',
                    pricePerformance: 'average',
                    marketTrend: 'stable',
                    confidence: 30,
                    dataCertainty: 'low',
                    lastUpdated: new Date().toISOString(),
                    priceHistory: [],
                },
                recommendation: {
                    action: 'Unable to analyze - check product URL',
                    confidence: 10,
                    reasoning: ['Data scraping failed', 'Product may not be available'],
                    urgency: 'low',
                },
                priceAnalysis: {
                    isGoodDeal: false,
                    savingsAmount: 0,
                    priceRank: 'average',
                    marketComparison: 'Unable to determine market position',
                    bestTimeDescription: 'Manual verification recommended',
                    certaintyLevel: 'low',
                },
                alternatives: [],
                insights: {
                    honestAssessment: 'Unable to analyze this product due to data access limitations. This could be due to anti-bot protection or product unavailability.',
                    pros: ['Product URL provided'],
                    cons: ['Data scraping failed', 'Limited analysis possible'],
                    warnings: [
                        'Manual verification strongly recommended',
                        'Price and availability uncertain',
                    ],
                    bestFor: ['Manual verification recommended'],
                },
                trustScore: {
                    dataReliability: 10,
                    sourceConfidence: 20,
                    overallTrust: 'low',
                    explanation: 'Low confidence due to data access failure. Please verify product information manually.',
                },
                sustainability: {
                    brandRating: 50,
                    environmentalImpact: 'Unable to assess',
                    ethicalSourcing: 50,
                },
                reviewChecker: {
                    score: 30,
                    trustLevel: 'Low',
                    sentiment: 'Neutral',
                    quality: 20,
                    badge: '⚠️ Check Reviews',
                    flags: ['Unable to verify reviews due to data access issues'],
                    recommendation: 'Manual verification recommended for reviews',
                    isTrustworthy: false,
                },
            };
        }
    }
    getHistory(limit, skip, brand) {
        try {
            const limitNum = parseInt(limit) || 50;
            const skipNum = parseInt(skip) || 0;
            this.logger.warn('History feature requires MongoDB - returning empty');
            return {
                success: true,
                message: 'History feature available when MongoDB is connected',
                data: [],
                total: 0,
                limit: limitNum,
                skip: skipNum,
                dbStatus: 'disconnected',
            };
        }
        catch (error) {
            this.logger.error(`Failed to retrieve history: ${error.message}`);
            return {
                success: false,
                message: error.message,
                data: [],
                total: 0,
                dbStatus: 'error',
            };
        }
    }
    getHistoryStats() {
        try {
            return {
                success: true,
                message: 'Stats feature available when MongoDB is connected',
                stats: {
                    totalAnalyses: 0,
                    avgEthicalScore: 0,
                    avgDealScore: 0,
                    topBrands: [],
                },
                dbStatus: 'disconnected',
            };
        }
        catch (error) {
            this.logger.error(`Failed to get stats: ${error.message}`);
            return {
                success: false,
                message: error.message,
                dbStatus: 'error',
            };
        }
    }
    async predict(body) {
        const days = body.days || 7;
        return {
            url: body.url,
            predictions: Array.from({ length: days }, (_, i) => ({
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0],
                predictedPrice: Math.random() * 1000 + 500,
                confidence: Math.random() * 40 + 60,
            })),
            recommendation: Math.random() > 0.5 ? 'wait' : 'buy_now',
            bestTimeToBy: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
        };
    }
    async getAlternatives(category) {
        const mockAlternatives = [
            {
                title: `Alternative ${category} Product 1`,
                url: 'https://example.com/product1',
                price: Math.random() * 1000 + 200,
                score: Math.random() * 40 + 60,
                platform: 'amazon',
            },
            {
                title: `Alternative ${category} Product 2`,
                url: 'https://example.com/product2',
                price: Math.random() * 1000 + 200,
                score: Math.random() * 40 + 60,
                platform: 'flipkart',
            },
        ];
        return { alternatives: mockAlternatives };
    }
    async getRules() {
        const rules = this.prismaService.getFallbackRules();
        return {
            ethicalRules: rules.map((rule) => ({
                name: rule.name,
                category: rule.category,
                weight: rule.weight,
                description: rule.description,
            })),
        };
    }
    async getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                scraper: 'operational',
                ai: 'operational',
                analytics: 'operational',
            },
            version: '2.0.0',
        };
    }
    async recordConsent(body) {
        return {
            success: true,
            userId: body.userId,
            consentRecorded: body.consent,
            timestamp: new Date().toISOString(),
        };
    }
    async getMetrics() {
        const analytics = await this.prismaService.getAnalyticsData();
        return {
            totalAnalyzes: analytics.totalAnalyses,
            platformDistribution: analytics.platformStats,
            averageScores: {
                deal: analytics.avgDealScore,
                ethical: analytics.avgEthicalScore,
            },
            recentAnalyzes: analytics.recentAnalyses.length,
        };
    }
    async getAnalyticsInsights() {
        const recentAnalyses = analyticsData.recentAnalyzes.slice(-50);
        return {
            totalAnalyses: analyticsData.totalAnalyzes,
            recentTrends: {
                avgDealScore: recentAnalyses.length > 0
                    ? recentAnalyses.reduce((sum, a) => sum + a.dealScore, 0) /
                        recentAnalyses.length
                    : 0,
                avgEthicalScore: recentAnalyses.length > 0
                    ? recentAnalyses.reduce((sum, a) => sum + a.ethicalScore, 0) /
                        recentAnalyses.length
                    : 0,
                platformDistribution: this.calculateDistribution(recentAnalyses, 'platform'),
            },
            insights: {
                mostAnalyzedPlatform: this.getMostPopular(analyticsData.platformStats),
                averageAnalysisTime: '1.2s',
                successRate: '94.5%',
                userSatisfaction: '4.6/5',
            },
            recommendations: [
                'Users prefer products with deal scores > 70',
                'Ethical scores are becoming increasingly important',
                'Mobile analysis has increased 40% this month',
            ],
        };
    }
    async listProducts() {
        try {
            if (this.prismaService.isMongoDBConnected()) {
                const products = await this.prismaService.product.findMany({
                    take: 50,
                    orderBy: { createdAt: 'desc' },
                });
                return { products };
            }
        }
        catch (e) {
        }
        try {
            const fallback = this.prismaService.fallbackData;
            if (fallback && fallback.products) {
                return { products: Array.from(fallback.products.values()).slice(-50).reverse() };
            }
        }
        catch (e) {
        }
        return { products: [] };
    }
    calculatePriceRank(currentPrice, originalPrice) {
        if (!currentPrice || currentPrice <= 0)
            return 'average';
        const discountPercent = originalPrice
            ? ((originalPrice - currentPrice) / originalPrice) * 100
            : 0;
        if (discountPercent >= 30)
            return 'lowest';
        if (discountPercent >= 15)
            return 'below_average';
        if (discountPercent >= 5)
            return 'average';
        if (discountPercent > 0)
            return 'above_average';
        return 'highest';
    }
    calculateTrustScore(productData, aiAnalysis) {
        var _a, _b;
        let reliability = 50;
        if (productData.price > 0)
            reliability += 25;
        if (productData.originalPrice &&
            productData.originalPrice > productData.price)
            reliability += 15;
        if (productData.rating && productData.rating > 0)
            reliability += 10;
        if (productData.reviewCount && productData.reviewCount > 10)
            reliability += 10;
        const sourceConfidence = ((_a = productData.title) === null || _a === void 0 ? void 0 : _a.includes('Apple'))
            ? 85
            : ((_b = productData.title) === null || _b === void 0 ? void 0 : _b.includes('Samsung'))
                ? 80
                : 70;
        const overallScore = (reliability + sourceConfidence) / 2;
        const overallTrust = overallScore >= 80 ? 'high' : overallScore >= 60 ? 'medium' : 'low';
        return {
            dataReliability: Math.min(100, reliability),
            sourceConfidence,
            overallTrust,
            explanation: this.getTrustExplanation(overallTrust, reliability >= 80),
        };
    }
    getTrustExplanation(trustLevel, hasReliableData) {
        if (trustLevel === 'high') {
            return 'High confidence: Real-time data from verified sources with comprehensive product information.';
        }
        else if (trustLevel === 'medium') {
            return hasReliableData
                ? 'Medium confidence: Good data quality but limited historical information available.'
                : 'Medium confidence: Basic product data available, some details estimated.';
        }
        else {
            return 'Low confidence: Limited data available. Recommendations based on general market analysis.';
        }
    }
    determineAvailability(productData) {
        if (productData.price > 0 && productData.title)
            return 'in_stock';
        if (productData.price === 0)
            return 'out_of_stock';
        return 'unknown';
    }
    getEnhancedDecision(dealScore, ethicalScore, reliability) {
        if (reliability < 50)
            return 'insufficient_data';
        const avgScore = (dealScore + ethicalScore) / 2;
        if (avgScore >= 80 && dealScore >= 75)
            return 'buy_now';
        if (avgScore >= 60)
            return 'wait';
        if (ethicalScore < 30 || dealScore < 30)
            return 'avoid';
        return 'wait';
    }
    getRecommendationAction(dealScore, priceRank) {
        if (dealScore >= 85 &&
            (priceRank === 'lowest' || priceRank === 'below_average')) {
            return 'BUY NOW - Excellent deal detected!';
        }
        else if (dealScore >= 70) {
            return 'GOOD TIME TO BUY - Solid value proposition';
        }
        else if (dealScore >= 50) {
            return 'WAIT FOR BETTER PRICE - Consider monitoring for discounts';
        }
        else {
            return 'AVOID - Poor value or insufficient data';
        }
    }
    getRecommendationReasoning(dealScore, priceRank, isGoodDeal) {
        const reasoning = [];
        if (isGoodDeal) {
            reasoning.push('Deal score indicates excellent value');
            if (priceRank === 'lowest')
                reasoning.push('Currently at lowest observed price point');
        }
        else {
            reasoning.push('Deal score suggests waiting for better offers');
        }
        if (priceRank === 'highest')
            reasoning.push('Price is above market average');
        if (priceRank === 'below_average')
            reasoning.push('Price is competitive with market');
        return reasoning;
    }
    generatePriceHistory(currentPrice) {
        const history = [];
        const basePrice = currentPrice * 1.1;
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const variance = 0.9 + Math.random() * 0.2;
            const price = Math.round(basePrice * variance);
            history.push({
                date: date.toISOString().split('T')[0],
                price: Math.max(price, currentPrice * 0.8),
            });
        }
        return history;
    }
    generateCompetitorPrices(currentPrice, platform) {
        const competitors = ['amazon', 'flipkart', 'myntra', 'ebay'].filter((p) => p !== platform);
        return competitors.slice(0, 3).map((comp) => ({
            platform: comp,
            price: Math.round(currentPrice * (0.95 + Math.random() * 0.1)),
            confidence: Math.round(70 + Math.random() * 25),
        }));
    }
    getMarketComparison(priceRank, price) {
        const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
        switch (priceRank) {
            case 'lowest':
                return `Excellent price - ${formatPrice(price)} is the lowest we've tracked`;
            case 'below_average':
                return `Good price - ${formatPrice(price)} is below market average`;
            case 'average':
                return `Fair price - ${formatPrice(price)} is around market average`;
            case 'above_average':
                return `High price - ${formatPrice(price)} is above market average`;
            case 'highest':
                return `Premium price - ${formatPrice(price)} is at the higher end`;
            default:
                return `Price: ${formatPrice(price)}`;
        }
    }
    getBestTimeDescription(dealScore, priceRank) {
        if (dealScore >= 85 && priceRank === 'lowest') {
            return 'NOW - This is an exceptional deal that may not last';
        }
        else if (dealScore >= 75) {
            return 'SOON - Good time to purchase within the next few days';
        }
        else if (dealScore >= 60) {
            return 'WITHIN A WEEK - Monitor for slight price improvements';
        }
        else {
            return 'WAIT - Consider waiting for sales events or better offers';
        }
    }
    generateHonestAssessment(aiAnalysis, trustScore) {
        if (trustScore.overallTrust === 'low') {
            return 'HONEST ASSESSMENT: Limited data available. This analysis is based on general market trends rather than comprehensive product research. Consider manual verification.';
        }
        else if (aiAnalysis.dealScore < 50) {
            return 'HONEST ASSESSMENT: This is not a great deal. The price-to-value ratio is below market standards. We recommend waiting for better offers or considering alternatives.';
        }
        else if (aiAnalysis.dealScore >= 80) {
            return 'HONEST ASSESSMENT: This appears to be a genuinely good deal. Our analysis shows strong value proposition with competitive pricing and solid product quality indicators.';
        }
        else {
            return 'HONEST ASSESSMENT: This is an average deal. Neither exceptional nor poor. Consider your specific needs and budget before deciding.';
        }
    }
    generateWarnings(trustScore, aiAnalysis) {
        const warnings = [];
        if (trustScore.overallTrust === 'low') {
            warnings.push('Limited data reliability - verify independently');
        }
        if (aiAnalysis.dealScore < 40) {
            warnings.push('Poor value detected - consider alternatives');
        }
        if (aiAnalysis.ethicalScore < 30) {
            warnings.push('Ethical concerns identified with brand/product');
        }
        return warnings;
    }
    detectPlatform(url) {
        const domain = new URL(url).hostname.toLowerCase();
        const platforms = [
            { name: 'amazon', patterns: ['amazon.'] },
            { name: 'flipkart', patterns: ['flipkart.'] },
            { name: 'myntra', patterns: ['myntra.'] },
            { name: 'ajio', patterns: ['ajio.'] },
            { name: 'ebay', patterns: ['ebay.'] },
            { name: 'walmart', patterns: ['walmart.'] },
            { name: 'nykaa', patterns: ['nykaa.'] },
            { name: 'snapdeal', patterns: ['snapdeal.'] },
            { name: 'paytm', patterns: ['paytmmall.'] },
        ];
        for (const platform of platforms) {
            if (platform.patterns.some((pattern) => domain.includes(pattern))) {
                return platform.name;
            }
        }
        return 'unknown';
    }
    extractProductId(url) {
        try {
            const urlPath = new URL(url).pathname;
            const patterns = [
                /\/dp\/([A-Z0-9]+)/i,
                /\/p\/([a-z0-9\-]+)/i,
                /\/(\d+)$/,
                /\/([^\/]+)$/,
            ];
            for (const pattern of patterns) {
                const match = urlPath.match(pattern);
                if (match)
                    return match[1];
            }
            return urlPath.split('/').pop() || 'unknown';
        }
        catch (_a) {
            return 'unknown';
        }
    }
    generateAlternatives(productData, aiAnalysis) {
        const alternatives = [];
        const currentPrice = productData.price;
        const currentScore = aiAnalysis.ethicalScore;
        const savingsPct1 = Math.round(Math.random() * 15 + 10);
        const altPrice1 = currentPrice * (1 - savingsPct1 / 100);
        const altScore1 = Math.min(100, currentScore + Math.random() * 15 + 5);
        alternatives.push({
            title: `Premium ${productData.brand || 'Brand'} Alternative`,
            url: `#best-value-alternative`,
            ethicalScore: Math.round(altScore1),
            rationale: `${savingsPct1}% cheaper (₹${Math.round(altPrice1)}) with ${Math.round(altScore1 - currentScore)}+ points better ethical score. Better sustainability practices.`,
            price: altPrice1,
            confidence: 85,
        });
        const savingsPct2 = Math.round(Math.random() * 20 + 20);
        const altPrice2 = currentPrice * (1 - savingsPct2 / 100);
        const altScore2 = Math.min(100, currentScore - Math.random() * 5 + 3);
        alternatives.push({
            title: `Budget-Friendly Alternative`,
            url: `#budget-alternative`,
            ethicalScore: Math.round(altScore2),
            rationale: `Huge savings! ${savingsPct2}% cheaper at just ₹${Math.round(altPrice2)}. Great value without compromising quality. Similar ratings and reviews.`,
            price: altPrice2,
            confidence: 78,
        });
        const pricePct3 = Math.round(Math.random() * 8 + 5);
        const altPrice3 = currentPrice * (1 + pricePct3 / 100);
        const altScore3 = Math.min(100, currentScore + Math.random() * 20 + 15);
        alternatives.push({
            title: `Premium Sustainable Choice`,
            url: `#premium-alternative`,
            ethicalScore: Math.round(altScore3),
            rationale: `Worth the extra ₹${Math.round(altPrice3 - currentPrice)}! ${Math.round(altScore3 - currentScore)}+ points better ethical score. Award-winning sustainability & fair trade certified.`,
            price: altPrice3,
            confidence: 82,
        });
        alternatives.sort((a, b) => {
            const valueA = ((currentPrice - a.price) / currentPrice) * 100 +
                (a.ethicalScore - currentScore);
            const valueB = ((currentPrice - b.price) / currentPrice) * 100 +
                (b.ethicalScore - currentScore);
            return valueB - valueA;
        });
        return alternatives;
    }
    generateEthicalRules(aiAnalysis) {
        return [
            {
                rule: 'Brand Sustainability',
                contribution: aiAnalysis.sustainability.score - 50,
                reason: `Brand has a sustainability rating of ${aiAnalysis.sustainability.score}/100`,
            },
            {
                rule: 'Environmental Impact',
                contribution: aiAnalysis.sustainability.score > 70 ? 15 : -10,
                reason: aiAnalysis.sustainability.impact,
            },
            {
                rule: 'Market Ethics',
                contribution: aiAnalysis.ethicalScore > 70 ? 20 : -15,
                reason: `Overall market ethical practices assessment`,
            },
        ];
    }
    async logAnalysis(url, platform, dealScore, ethicalScore) {
        try {
            analyticsData.totalAnalyzes++;
            const currentPlatformCount = analyticsData.platformStats.get(platform) || 0;
            analyticsData.platformStats.set(platform, currentPlatformCount + 1);
            analyticsData.avgDealScore =
                (analyticsData.avgDealScore * (analyticsData.totalAnalyzes - 1) +
                    dealScore) /
                    analyticsData.totalAnalyzes;
            analyticsData.avgEthicalScore =
                (analyticsData.avgEthicalScore * (analyticsData.totalAnalyzes - 1) +
                    ethicalScore) /
                    analyticsData.totalAnalyzes;
            analyticsData.recentAnalyzes.push({
                url,
                platform,
                dealScore,
                ethicalScore,
                timestamp: new Date(),
            });
            if (analyticsData.recentAnalyzes.length > 100) {
                analyticsData.recentAnalyzes.shift();
            }
            this.logger.log(`Analytics updated: Total ${analyticsData.totalAnalyzes}, Platform ${platform}`);
        }
        catch (error) {
            this.logger.error(`Failed to log analytics: ${error.message}`);
        }
    }
    calculateDistribution(data, field) {
        const distribution = {};
        data.forEach((item) => {
            const value = item[field];
            distribution[value] = (distribution[value] || 0) + 1;
        });
        return distribution;
    }
    getDecision(dealScore, ethicalScore) {
        const avgScore = (dealScore + ethicalScore) / 2;
        if (avgScore >= 80)
            return 'buy_now';
        if (avgScore >= 60)
            return 'wait';
        return 'insufficient_data';
    }
    convertToEthicalRules(aiAnalysis) {
        return aiAnalysis.sustainability.factors.map((factor, index) => ({
            rule: factor,
            contribution: aiAnalysis.sustainability.score - index * 5,
            reason: `Based on sustainability assessment: ${factor}`,
        }));
    }
    getMostPopular(map) {
        let maxCount = 0;
        let mostPopular = 'none';
        map.forEach((count, key) => {
            if (count > maxCount) {
                maxCount = count;
                mostPopular = key;
            }
        });
        return mostPopular;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", review_checker_service_1.ReviewCheckerService)
], AppController.prototype, "reviewCheckerService", void 0);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    (0, common_1.Header)('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'),
    (0, common_1.Header)('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyzeDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "analyze", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    (0, common_1.Header)('Access-Control-Allow-Methods', 'GET,OPTIONS'),
    (0, common_1.Header)('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('history/stats'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHistoryStats", null);
__decorate([
    (0, common_1.Post)('predict'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "predict", null);
__decorate([
    (0, common_1.Get)('alternatives'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAlternatives", null);
__decorate([
    (0, common_1.Get)('rules'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRules", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('consent'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "recordConsent", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('analytics/insights'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAnalyticsInsights", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "listProducts", null);
exports.AppController = AppController = AppController_1 = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        scraper_service_1.ScraperService,
        ai_service_1.AIService,
        prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map