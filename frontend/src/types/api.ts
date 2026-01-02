export type EthicalRuleExplanation = {
  rule: string;
  contribution: number;
  reason: string;
};

export type AlternativeProduct = {
  title: string;
  url: string;
  ethicalScore: number;
  rationale: string;
  price?: number;
  confidence?: number;
};

export type AnalysisMeta = {
  analyzedAt: string;
  latencyMs: number;
  version: string;
};

export type PriceTrend = {
  current: number;
  original?: number;
  predictedNextWeek: number;
  confidence: number;
  history?: Array<{ timestamp: string; price: number }>;
  discountPercent?: number;
  currency: string;
};

export type SourceCitation = {
  label: string;
  href: string;
};

export type PricePrediction = {
  nextWeekPrice: number;
  nextMonthPrice: number;
  bestTimeToNuy: string;
  priceDirection: 'up' | 'down' | 'stable';
  confidence: number;
  historicalPattern: string;
};

export type CarbonFootprint = {
  totalScore: number;
  breakdown: {
    manufacturing: number;
    shipping: number;
    packaging: number;
    disposal: number;
  };
  comparison: string;
  improvementSuggestions: string[];
};

export type SupplyChainTransparency = {
  riskScore: number;
  riskFactors: string[];
  certifications: string[];
  laborStandards: 'excellent' | 'good' | 'average' | 'poor' | 'unknown';
  geographicalRisks: string[];
  recommendations: string[];
};

export type BrandReputation = {
  overallScore: number;
  trustScore: number;
  ethicalScore: number;
  customerSatisfactionScore: number;
  socialImpactScore: number;
  transparency: number;
  controversies: string[];
  positiveActions: string[];
  marketPosition: string;
};

export type SmartInsights = {
  hiddenCosts: {
    estimatedShipping: number;
    taxes: number;
    returns: number;
    warranty: number;
    total: number;
  };
  valueAnalysis: {
    pricePerFeature: number;
    durabilityScore: number;
    resaleValue: number;
    totalCostOfOwnership: number;
  };
  socialProof: {
    trendingScore: number;
    virality: 'high' | 'medium' | 'low';
    influencerEndorsements: string[];
    socialMediaMentions: number;
  };
  competitorComparison: Array<{
    competitor: string;
    price: number;
    advantage: string;
    disadvantage: string;
  }>;
};

export type CompetitiveFeatures = {
  pricePrediction: PricePrediction;
  carbonFootprint: CarbonFootprint;
  supplyChainTransparency: SupplyChainTransparency;
  brandReputation: BrandReputation;
  smartInsights: SmartInsights;
};

export type AnalyzeResponse = {
  decision: 'buy_now' | 'wait' | 'insufficient_data';
  ethicalScore: number;
  dealScore?: number;
  priceTrend: PriceTrend;
  explanations: EthicalRuleExplanation[];
  alternatives: AlternativeProduct[];
  sources: SourceCitation[];
  meta: AnalysisMeta;
  // New competitive features
  competitiveFeatures?: CompetitiveFeatures;
  uniqueInsights?: {
    carbonFootprint: string;
    supplyChainRisk: string;
    brandTrustScore: number;
    hiddenCosts: string;
    futureValuePrediction: string;
  };
  aiModel?: string;
};

export type AnalyzeRequest = {
  url: string;
  locale?: string;
  includeAlternatives?: boolean;
};

export type PredictPriceRequest = {
  productId?: string;
  url?: string;
  horizonDays?: number;
};

export type PredictPriceResponse = {
  trend: 'up' | 'down' | 'flat';
  confidence: number;
  forecast: Array<{ timestamp: string; price: number }>;
  meta: AnalysisMeta;
};

export type AlternativesResponse = {
  items: AlternativeProduct[];
  meta: {
    query: string;
    tookMs: number;
  };
};

export type RulesResponse = {
  rules: Array<{
    id: string;
    rule_name: string;
    condition: string;
    weight: number;
    description: string;
    category: string;
  }>;
  lastUpdated: string;
};

export type HealthResponse = {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  services: Array<{
    name: string;
    status: 'ok' | 'degraded' | 'down';
    latencyMs?: number;
    message?: string;
  }>;
};
