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
var PriceComparisonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceComparisonService = void 0;
const common_1 = require("@nestjs/common");
let PriceComparisonService = PriceComparisonService_1 = class PriceComparisonService {
    constructor() {
        this.logger = new common_1.Logger(PriceComparisonService_1.name);
        this.platformVariations = {
            'amazon': { priceMultiplier: 1.0, shipping: 0, confidence: 95 },
            'flipkart': { priceMultiplier: 0.98, shipping: 50, confidence: 92 },
            'myntra': { priceMultiplier: 1.02, shipping: 0, confidence: 90 },
            'ajio': { priceMultiplier: 1.05, shipping: 99, confidence: 85 },
            'ebay': { priceMultiplier: 0.95, shipping: 200, confidence: 88 },
            'walmart': { priceMultiplier: 1.08, shipping: 100, confidence: 87 },
            'local_store': { priceMultiplier: 1.15, shipping: 0, confidence: 75 },
        };
        this.logger.log('💰 Price Comparison Service initialized');
    }
    analyzePriceComparison(productTitle, currentPrice, originalPrice, currentPlatform = 'amazon') {
        const comparisons = this.generatePlatformComparisons(productTitle, currentPrice, currentPlatform);
        const lowestPrice = Math.min(...comparisons.map(c => c.totalPrice));
        const highestPrice = Math.max(...comparisons.map(c => c.totalPrice));
        const averagePrice = comparisons.reduce((sum, c) => sum + c.totalPrice, 0) / comparisons.length;
        const bestDeal = comparisons.reduce((best, curr) => curr.totalPrice < best.totalPrice ? curr : best);
        const dealScore = this.calculateDealScore(currentPrice, lowestPrice, averagePrice, originalPrice);
        const savingsOpportunity = lowestPrice < currentPrice ? currentPrice - lowestPrice : 0;
        return {
            currentPrice,
            lowestPrice,
            highestPrice,
            averagePrice: Math.round(averagePrice),
            bestDeal,
            comparisons: comparisons.sort((a, b) => a.totalPrice - b.totalPrice),
            priceHistory: this.generatePriceHistory(currentPrice, originalPrice),
            dealScore,
            recommendation: this.generatePriceRecommendation(dealScore, currentPrice, lowestPrice),
            savingsOpportunity: Math.round(savingsOpportunity),
        };
    }
    generatePlatformComparisons(productTitle, basePrice, currentPlatform) {
        const comparisons = [];
        for (const [platform, variation] of Object.entries(this.platformVariations)) {
            const discount = this.getRandomDiscount(platform);
            const priceAfterDiscount = Math.round(basePrice * variation.priceMultiplier * (1 - discount / 100));
            const shippingCost = Math.random() > 0.3 ? 0 : variation.shipping;
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
    generatePriceHistory(currentPrice, originalPrice) {
        const history = [];
        const basePrice = originalPrice || currentPrice * 1.1;
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const variance = 0.85 + Math.random() * 0.3;
            const price = Math.round(basePrice * variance);
            history.push({
                date: date.toISOString().split('T')[0],
                price: Math.max(currentPrice * 0.8, price),
            });
        }
        return history;
    }
    calculateDealScore(currentPrice, lowestPrice, averagePrice, originalPrice) {
        let score = 50;
        if (currentPrice < averagePrice * 0.8)
            score += 25;
        else if (currentPrice < averagePrice * 0.95)
            score += 15;
        else if (currentPrice > averagePrice * 1.2)
            score -= 20;
        else if (currentPrice > averagePrice * 1.5)
            score -= 35;
        if (Math.abs(currentPrice - lowestPrice) < 100)
            score += 15;
        else if (currentPrice > lowestPrice * 1.1)
            score -= 10;
        if (originalPrice && originalPrice > currentPrice) {
            const discountPercent = ((originalPrice - currentPrice) / originalPrice) * 100;
            if (discountPercent > 40)
                score += 20;
            else if (discountPercent > 20)
                score += 10;
            else if (discountPercent > 10)
                score += 5;
        }
        return Math.max(0, Math.min(100, Math.round(score)));
    }
    generatePriceRecommendation(dealScore, currentPrice, lowestPrice) {
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
            return 'Average price. Save ₹' + Math.round(lowestPrice - currentPrice) + ' by checking other platforms.';
        }
        if (dealScore >= 40) {
            return 'Above average price. Significant savings available elsewhere.';
        }
        return 'Poor deal. Wait for sales or check competitor prices - savings up to ₹' + Math.round(currentPrice - lowestPrice);
    }
    getSeasonalPricing(basePrice, season) {
        const seasonMultiplier = {
            'spring': 0.95,
            'summer': 1.05,
            'monsoon': 0.9,
            'winter': 1.1,
            'festivals': 0.75,
        };
        return Math.round(basePrice * (seasonMultiplier[season] || 1));
    }
    getBulkPricing(unitPrice, quantity) {
        let discount = 0;
        if (quantity >= 100)
            discount = 0.25;
        else if (quantity >= 50)
            discount = 0.20;
        else if (quantity >= 20)
            discount = 0.15;
        else if (quantity >= 10)
            discount = 0.10;
        else if (quantity >= 5)
            discount = 0.05;
        const discountedPrice = Math.round(unitPrice * (1 - discount));
        const totalPrice = discountedPrice * quantity;
        const savings = (unitPrice - discountedPrice) * quantity;
        return {
            unitPrice: discountedPrice,
            totalPrice,
            savings: Math.round(savings),
        };
    }
    analyzePriceTrend(priceHistory) {
        var _a;
        if (priceHistory.length < 2) {
            return { trend: 'stable', slope: 0, volatility: 0, prediction: ((_a = priceHistory[0]) === null || _a === void 0 ? void 0 : _a.price) || 0 };
        }
        const prices = priceHistory.map(h => h.price);
        const n = prices.length;
        const xMean = (n - 1) / 2;
        const yMean = prices.reduce((a, b) => a + b) / n;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (prices[i] - yMean);
            denominator += (i - xMean) ** 2;
        }
        const slope = numerator / denominator;
        const trend = slope > 5 ? 'rising' : slope < -5 ? 'falling' : 'stable';
        const deviations = prices.map(p => Math.abs(p - yMean));
        const volatility = Math.round((Math.max(...deviations) / yMean) * 100);
        const prediction = Math.round(prices[n - 1] + slope);
        return {
            trend,
            slope: Math.round(slope),
            volatility,
            prediction,
        };
    }
    getBestTimeToBuy(dealScore, trend) {
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
    getRandomDiscount(platform) {
        if (platform === 'flipkart')
            return Math.random() > 0.5 ? Math.floor(Math.random() * 15) : 0;
        if (platform === 'amazon')
            return Math.random() > 0.3 ? Math.floor(Math.random() * 20) : 0;
        if (platform === 'ebay')
            return Math.random() > 0.4 ? Math.floor(Math.random() * 25) : 0;
        return 0;
    }
    getRandomAvailability() {
        const rand = Math.random();
        if (rand > 0.7)
            return 'In Stock';
        if (rand > 0.3)
            return 'Limited';
        if (rand > 0.05)
            return 'Out of Stock';
        return 'Unknown';
    }
    formatPlatformName(platform) {
        return platform
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
};
exports.PriceComparisonService = PriceComparisonService;
exports.PriceComparisonService = PriceComparisonService = PriceComparisonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PriceComparisonService);
//# sourceMappingURL=price-comparison.service.js.map