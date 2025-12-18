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
var ReviewCheckerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewCheckerService = void 0;
const common_1 = require("@nestjs/common");
let ReviewCheckerService = ReviewCheckerService_1 = class ReviewCheckerService {
    constructor() {
        this.logger = new common_1.Logger(ReviewCheckerService_1.name);
        this.logger.log('🔍 Review Checker Service initialized');
    }
    analyzeReviews(rating, reviewCount, brand) {
        const flags = [];
        let trustScore = 100;
        let quality = 100;
        if (rating === 5 && reviewCount < 10) {
            flags.push('⚠️ Perfect rating with few reviews - might be new or manipulated');
            trustScore -= 20;
        }
        if (reviewCount > 1000 && rating > 4.8) {
            flags.push('⚠️ Very high rating with many reviews - verify authenticity');
            trustScore -= 10;
        }
        if (rating === 5.0) {
            flags.push('⚠️ Perfect 5.0 rating is rare for genuine products');
            trustScore -= 15;
        }
        if (reviewCount < 5) {
            flags.push('⚠️ Very few reviews - not enough data to assess');
            trustScore -= 25;
            quality -= 30;
        }
        if (rating >= 4.5 && rating <= 4.7 && reviewCount > 100) {
            flags.push('✅ Rating pattern looks natural and trustworthy');
            trustScore += 10;
            quality += 10;
        }
        if (rating >= 3.5 && rating <= 4.5 && reviewCount > 50) {
            flags.push('✅ Balanced rating with good review count - likely genuine');
            trustScore += 15;
            quality += 15;
        }
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
        if (reviewCount > 500 && rating < 3.5) {
            flags.push('⚠️ Many negative reviews - product might have issues');
            quality -= 20;
        }
        if (rating < 2.5) {
            flags.push('🚫 Very low rating - avoid this product');
            trustScore -= 30;
            quality -= 40;
        }
        if (reviewCount >= 100 &&
            reviewCount <= 5000 &&
            rating >= 3.8 &&
            rating <= 4.6) {
            flags.push('✅ Ideal review metrics - high confidence in authenticity');
            trustScore += 20;
            quality += 20;
        }
        trustScore = Math.max(0, Math.min(100, trustScore));
        quality = Math.max(0, Math.min(100, quality));
        let trustLevel;
        if (trustScore >= 75)
            trustLevel = 'High';
        else if (trustScore >= 50)
            trustLevel = 'Medium';
        else if (trustScore >= 30)
            trustLevel = 'Low';
        else
            trustLevel = 'Suspicious';
        let sentiment;
        if (rating >= 4.0)
            sentiment = 'Positive';
        else if (rating <= 2.5)
            sentiment = 'Negative';
        else if (rating > 2.5 && rating < 4.0)
            sentiment = 'Mixed';
        else
            sentiment = 'Neutral';
        const recommendation = this.generateRecommendation(trustLevel, rating, reviewCount, flags);
        return {
            score: Math.round(trustScore),
            trustLevel,
            flags,
            sentiment,
            quality: Math.round(quality),
            recommendation,
        };
    }
    generateRecommendation(trustLevel, rating, reviewCount, flags) {
        if (trustLevel === 'High') {
            return `✅ Reviews appear genuine! ${reviewCount} reviews with ${rating}★ rating. Safe to trust customer feedback.`;
        }
        if (trustLevel === 'Medium') {
            return `⚠️ Reviews seem mostly authentic but verify carefully. ${reviewCount} reviews with ${rating}★ rating. Read detailed reviews before buying.`;
        }
        if (trustLevel === 'Low') {
            return `⚠️ Review authenticity uncertain. Only ${reviewCount} reviews with ${rating}★ rating. Research more before purchasing.`;
        }
        return `🚫 Reviews might be manipulated! ${reviewCount} reviews with ${rating}★ rating. Check other sources and be cautious.`;
    }
    isReviewTrustworthy(rating, reviewCount) {
        const analysis = this.analyzeReviews(rating, reviewCount);
        return analysis.score >= 50;
    }
    getReviewBadge(score) {
        if (score >= 80)
            return '🏆 Verified Reviews';
        if (score >= 60)
            return '✅ Trusted Reviews';
        if (score >= 40)
            return '⚠️ Check Reviews';
        return '🚫 Suspicious Reviews';
    }
};
exports.ReviewCheckerService = ReviewCheckerService;
exports.ReviewCheckerService = ReviewCheckerService = ReviewCheckerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ReviewCheckerService);
//# sourceMappingURL=review-checker.service.js.map