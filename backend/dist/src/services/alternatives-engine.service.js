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
var AlternativesEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativesEngineService = void 0;
const common_1 = require("@nestjs/common");
const internal_product_db_service_1 = require("./internal-product-db.service");
let AlternativesEngineService = AlternativesEngineService_1 = class AlternativesEngineService {
    constructor(productDb) {
        this.productDb = productDb;
        this.logger = new common_1.Logger(AlternativesEngineService_1.name);
        this.logger.log('🔄 Alternatives Engine Service initialized');
    }
    getSmartAlternatives(productId, originalProduct) {
        let product = this.productDb.getProductById(productId);
        if (!product && originalProduct) {
            product = originalProduct;
        }
        if (!product) {
            this.logger.warn(`Product not found: ${productId}`);
            return [];
        }
        const alternatives = this.findAlternatives(product);
        return alternatives.sort((a, b) => b.improvementScore - a.improvementScore).slice(0, 5);
    }
    findAlternatives(product) {
        const allProducts = this.productDb.getAllProducts();
        const alternatives = [];
        for (const alt of allProducts) {
            if (alt.id === product.id)
                continue;
            if (alt.category !== product.category)
                continue;
            const improvement = this.calculateImprovement(product, alt);
            const priceRatio = alt.price / product.price;
            const ranking = this.calculateRanking(improvement, priceRatio);
            if (improvement > 0) {
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
    calculateImprovement(current, alternative) {
        let improvement = 0;
        if (alternative.rating > current.rating) {
            improvement += Math.min(30, (alternative.rating - current.rating) * 15);
        }
        if (alternative.ethicalScore > current.ethicalScore) {
            improvement += Math.min(30, (alternative.ethicalScore - current.ethicalScore) * 0.5);
        }
        if (alternative.sustainabilityScore > current.sustainabilityScore) {
            improvement += Math.min(30, (alternative.sustainabilityScore - current.sustainabilityScore) * 0.5);
        }
        const priceRatio = alternative.price / current.price;
        if (priceRatio < 1.2) {
            improvement += Math.min(20, (1 - (priceRatio - 0.8) / 0.4) * 20);
        }
        else if (priceRatio > 1.5) {
            improvement -= Math.min(15, (priceRatio - 1.5) * 10);
        }
        if (alternative.reviews > current.reviews * 1.5) {
            improvement += Math.min(10, 5);
        }
        return Math.max(0, Math.min(100, improvement));
    }
    calculateRanking(improvementScore, priceRatio) {
        let stars = 3;
        if (improvementScore > 50)
            stars += 1;
        if (improvementScore > 75)
            stars += 1;
        if (priceRatio < 1.1)
            stars += 1;
        if (priceRatio > 2)
            stars -= 1;
        if (priceRatio > 3)
            stars -= 1;
        return Math.max(1, Math.min(5, Math.round(stars)));
    }
    generateReason(current, alternative, improvement) {
        const reasons = [];
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
        if (alternative.features.length > current.features.length) {
            const extraFeatures = alternative.features.length - current.features.length;
            reasons.push(`${extraFeatures} additional feature${extraFeatures > 1 ? 's' : ''}`);
        }
        if (reasons.length === 0) {
            reasons.push(`Overall better value (${Math.round(improvement)}% improvement)`);
        }
        return reasons.slice(0, 2).join(' & ');
    }
    getEcoFriendlyAlternatives(productId) {
        const product = this.productDb.getProductById(productId);
        if (!product)
            return [];
        const allProducts = this.productDb.getAllProducts();
        const ecoAlternatives = [];
        for (const alt of allProducts) {
            if (alt.id === product.id)
                continue;
            if (alt.category !== product.category)
                continue;
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
    getBudgetAlternatives(productId, maxBudget) {
        const product = this.productDb.getProductById(productId);
        if (!product)
            return [];
        const budget = maxBudget || product.price * 0.7;
        const allProducts = this.productDb.getAllProducts();
        const budgetAlternatives = [];
        for (const alt of allProducts) {
            if (alt.id === product.id)
                continue;
            if (alt.category !== product.category)
                continue;
            if (alt.price > budget)
                continue;
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
    getPremiumAlternatives(productId) {
        const product = this.productDb.getProductById(productId);
        if (!product)
            return [];
        const allProducts = this.productDb.getAllProducts();
        const premiumAlternatives = [];
        for (const alt of allProducts) {
            if (alt.id === product.id)
                continue;
            if (alt.category !== product.category)
                continue;
            if (alt.price < product.price)
                continue;
            const premiumBenefit = (alt.rating - product.rating) * 15 +
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
    getAlternativesInPriceRange(productId, minPrice, maxPrice) {
        const product = this.productDb.getProductById(productId);
        if (!product)
            return [];
        const allProducts = this.productDb.getAllProducts();
        const priceAlternatives = [];
        for (const alt of allProducts) {
            if (alt.id === product.id)
                continue;
            if (alt.category !== product.category)
                continue;
            if (alt.price < minPrice || alt.price > maxPrice)
                continue;
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
};
exports.AlternativesEngineService = AlternativesEngineService;
exports.AlternativesEngineService = AlternativesEngineService = AlternativesEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [internal_product_db_service_1.InternalProductDbService])
], AlternativesEngineService);
//# sourceMappingURL=alternatives-engine.service.js.map