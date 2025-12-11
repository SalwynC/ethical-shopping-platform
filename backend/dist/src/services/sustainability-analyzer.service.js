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
var SustainabilityAnalyzerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SustainabilityAnalyzerService = void 0;
const common_1 = require("@nestjs/common");
let SustainabilityAnalyzerService = SustainabilityAnalyzerService_1 = class SustainabilityAnalyzerService {
    constructor() {
        this.logger = new common_1.Logger(SustainabilityAnalyzerService_1.name);
        this.brandScores = {
            'patagonia': { base: 95, certifications: ['B Corp', 'Certified Climate Neutral', 'Fair Trade'] },
            'organic': { base: 90, certifications: ['USDA Organic', 'Fair Trade'] },
            'eco': { base: 85, certifications: ['Eco-Label', 'Carbon Neutral'] },
            'apple': { base: 75, certifications: ['Carbon Neutral', 'Fair Trade Gold'] },
            'unilever': { base: 72, certifications: ['Rainforest Alliance', 'FSC Certified'] },
            'microsoft': { base: 78, certifications: ['Carbon Negative', 'Renewable Energy'] },
            'google': { base: 77, certifications: ['Carbon Neutral', 'Renewable Energy'] },
            'nike': { base: 68, certifications: ['Fair Trade', 'Responsible Sports'] },
            'adidas': { base: 67, certifications: ['Responsible Sports', 'Better Cotton'] },
            'amazon': { base: 65, certifications: ['Climate Pledge', 'Renewable Energy'] },
            'tesla': { base: 72, certifications: ['Zero Emissions', 'Clean Energy'] },
            'puma': { base: 58, certifications: ['Better Cotton'] },
            'h&m': { base: 55, certifications: ['Conscious Collection'] },
            'zara': { base: 52, certifications: [] },
            'walmart': { base: 48, certifications: [] },
            'alibaba': { base: 45, certifications: [] },
        };
        this.categoryFactors = {
            'Electronics': [
                { name: 'Energy Efficiency', score: 0, weight: 25, description: 'Power consumption and efficiency rating' },
                { name: 'Material Sourcing', score: 0, weight: 20, description: 'Use of recycled and conflict-free materials' },
                { name: 'Manufacturing', score: 0, weight: 20, description: 'Carbon footprint in production' },
                { name: 'E-Waste Recycling', score: 0, weight: 20, description: 'Take-back and recycling programs' },
                { name: 'Packaging', score: 0, weight: 15, description: 'Minimalist, recyclable packaging' },
            ],
            'Fashion': [
                { name: 'Labor Practices', score: 0, weight: 25, description: 'Fair wages and worker conditions' },
                { name: 'Sustainable Materials', score: 0, weight: 25, description: 'Organic cotton, recycled fibers' },
                { name: 'Water Usage', score: 0, weight: 20, description: 'Water conservation in production' },
                { name: 'Chemical Safety', score: 0, weight: 15, description: 'Non-toxic dyes and chemicals' },
                { name: 'Transportation', score: 0, weight: 15, description: 'Local production and shipping' },
            ],
            'Beauty': [
                { name: 'Natural Ingredients', score: 0, weight: 30, description: 'Percentage of natural vs synthetic' },
                { name: 'Cruelty-Free', score: 0, weight: 25, description: 'No animal testing' },
                { name: 'Packaging', score: 0, weight: 20, description: 'Recyclable and plastic-free' },
                { name: 'Chemical Safety', score: 0, weight: 15, description: 'Non-toxic and hypoallergenic' },
                { name: 'Fair Trade', score: 0, weight: 10, description: 'Fair trade sourcing' },
            ],
            'Home': [
                { name: 'Durability', score: 0, weight: 20, description: 'Longevity and repairability' },
                { name: 'Energy Efficiency', score: 0, weight: 25, description: 'Energy star certification' },
                { name: 'Materials', score: 0, weight: 20, description: 'Recycled and sustainable materials' },
                { name: 'Manufacturing', score: 0, weight: 20, description: 'Local production, low waste' },
                { name: 'End-of-Life', score: 0, weight: 15, description: 'Recyclability at end of life' },
            ],
        };
        this.logger.log('🌱 Sustainability Analyzer Service initialized');
    }
    analyzeSustainability(brand, category, price, originalPrice) {
        const brandInfo = this.getBrandSustainabilityInfo(brand);
        const factors = this.calculateCategoryFactors(category, brandInfo.base, price, originalPrice);
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
    getBrandSustainabilityInfo(brand) {
        const brandLower = brand.toLowerCase();
        for (const [key, value] of Object.entries(this.brandScores)) {
            if (brandLower.includes(key) || key.includes(brandLower)) {
                return value;
            }
        }
        return { base: 60, certifications: [] };
    }
    calculateCategoryFactors(category, brandScore, price, originalPrice) {
        const baseFactors = this.categoryFactors[category] || this.categoryFactors['Electronics'];
        return baseFactors.map(factor => (Object.assign(Object.assign({}, factor), { score: this.calculateFactorScore(factor.name, brandScore, price, originalPrice) })));
    }
    calculateFactorScore(factorName, brandScore, price, originalPrice) {
        let score = brandScore;
        if (price > 50000)
            score += 5;
        if (price > 100000)
            score += 8;
        if (originalPrice && originalPrice > price) {
            const discountPercent = ((originalPrice - price) / originalPrice) * 100;
            if (discountPercent > 30)
                score -= 5;
        }
        switch (factorName) {
            case 'Durability':
                score += (price > 30000) ? 10 : 5;
                break;
            case 'Cruelty-Free':
                score = Math.min(100, score + 15);
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
    calculateWeightedScore(factors) {
        const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
        const weightedSum = factors.reduce((sum, f) => sum + (f.score * f.weight), 0);
        return weightedSum / totalWeight;
    }
    getGradeFromScore(score) {
        if (score >= 95)
            return 'A+';
        if (score >= 90)
            return 'A';
        if (score >= 80)
            return 'B';
        if (score >= 70)
            return 'C';
        if (score >= 60)
            return 'D';
        return 'F';
    }
    generateImpactStatement(score, grade, brand) {
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
    generateRecommendation(score, grade) {
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
    calculateBreakeven(price, originalPrice, score) {
        const scoreMultiplier = score ? (score / 100) * 0.5 + 0.5 : 0.75;
        const baseDays = Math.max(30, Math.min(1000, (price / 1000) * 100));
        return Math.round(baseDays * (1 - (scoreMultiplier - 0.5)));
    }
    compareProducts(brand1, category1, price1, brand2, category2, price2) {
        const analysis1 = this.analyzeSustainability(brand1, category1, price1);
        const analysis2 = this.analyzeSustainability(brand2, category2, price2);
        let recommendation = '';
        if (analysis1.score > analysis2.score + 10) {
            recommendation = `Product 1 (${brand1}) is more sustainable`;
        }
        else if (analysis2.score > analysis1.score + 10) {
            recommendation = `Product 2 (${brand2}) is more sustainable`;
        }
        else {
            recommendation = 'Both products have similar sustainability profiles';
        }
        return { product1: analysis1, product2: analysis2, recommendation };
    }
};
exports.SustainabilityAnalyzerService = SustainabilityAnalyzerService;
exports.SustainabilityAnalyzerService = SustainabilityAnalyzerService = SustainabilityAnalyzerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SustainabilityAnalyzerService);
//# sourceMappingURL=sustainability-analyzer.service.js.map