"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisHistory = void 0;
const mongoose_1 = require("mongoose");
const AnalysisHistorySchema = new mongoose_1.Schema({
    productUrl: { type: String, required: true, index: true },
    productTitle: { type: String, required: true },
    productPrice: { type: String },
    originalPrice: { type: String },
    brand: { type: String, index: true },
    rating: { type: Number },
    reviewCount: { type: Number },
    ethicalScore: { type: Number, required: true },
    dealScore: { type: Number, required: true },
    reviewChecker: {
        score: { type: Number, required: true },
        trustLevel: { type: String, required: true },
        sentiment: { type: String, required: true },
        quality: { type: String, required: true },
        badge: { type: String, required: true },
        flags: [{ type: String }],
        recommendation: { type: String, required: true },
    },
    alternatives: [{ type: mongoose_1.Schema.Types.Mixed }],
    priceComparison: {
        currentPrice: { type: Number },
        averagePrice: { type: Number },
        lowestPrice: { type: Number },
        highestPrice: { type: Number },
        recommendation: { type: String },
    },
    sustainability: {
        score: { type: Number },
        concerns: [{ type: String }],
        badges: [{ type: String }],
    },
    analyzedAt: { type: Date, default: Date.now, index: true },
    userAgent: { type: String },
    ipAddress: { type: String },
});
AnalysisHistorySchema.index({ analyzedAt: -1 });
AnalysisHistorySchema.index({ productUrl: 1, analyzedAt: -1 });
AnalysisHistorySchema.index({ brand: 1, analyzedAt: -1 });
exports.AnalysisHistory = (0, mongoose_1.model)('AnalysisHistory', AnalysisHistorySchema);
//# sourceMappingURL=analysis-history.schema.js.map