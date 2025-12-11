import { Schema, model, Document } from 'mongoose';

export interface IAnalysisHistory extends Document {
  productUrl: string;
  productTitle: string;
  productPrice?: string;
  originalPrice?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  ethicalScore: number;
  dealScore: number;
  reviewChecker: {
    score: number;
    trustLevel: string;
    sentiment: string;
    quality: string;
    badge: string;
    flags: string[];
    recommendation: string;
  };
  alternatives: any[];
  priceComparison: {
    currentPrice: number;
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    recommendation: string;
  };
  sustainability: {
    score: number;
    concerns: string[];
    badges: string[];
  };
  analyzedAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

const AnalysisHistorySchema = new Schema<IAnalysisHistory>({
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
    recommendation: { type: String, required: true }
  },
  alternatives: [{ type: Schema.Types.Mixed }],
  priceComparison: {
    currentPrice: { type: Number },
    averagePrice: { type: Number },
    lowestPrice: { type: Number },
    highestPrice: { type: Number },
    recommendation: { type: String }
  },
  sustainability: {
    score: { type: Number },
    concerns: [{ type: String }],
    badges: [{ type: String }]
  },
  analyzedAt: { type: Date, default: Date.now, index: true },
  userAgent: { type: String },
  ipAddress: { type: String }
});

// Create indexes for efficient querying
AnalysisHistorySchema.index({ analyzedAt: -1 });
AnalysisHistorySchema.index({ productUrl: 1, analyzedAt: -1 });
AnalysisHistorySchema.index({ brand: 1, analyzedAt: -1 });

export const AnalysisHistory = model<IAnalysisHistory>('AnalysisHistory', AnalysisHistorySchema);
