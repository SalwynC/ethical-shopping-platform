"use client";

import { 
  IconCurrency,
  IconInfoCircle,
  IconExternalLink,
  IconShield,
  IconClock,
  IconStar,
} from "@tabler/icons-react";
import { PriceIntelligenceReport } from "./PriceIntelligenceReport";
import { generateMockPriceIntelligence } from "./mockPriceData";
import { CompetitiveFeaturesDisplay } from "./CompetitiveFeaturesDisplay";
import { CompetitiveFeatures } from "../../types/api";

interface ProductVariant {
  name: string;
  price: number;
  availability: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown';
  ethicalScore: number;
}

interface MarketStats {
  competitorAnalysis?: {
    similarProducts: number;
    averageMarketPrice: number;
    pricePosition: 'below_market' | 'at_market' | 'above_market';
  };
  trendDirection?: 'rising' | 'stable' | 'declining';
  marketPosition?: string;
  demandForecast?: number;
}

interface AnalysisResult {
  platform?: string;
  productInfo?: {
    title?: string;
    category?: string;
    brand?: string;
    rating?: number;
    reviews?: number;
    availability?: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown';
  };
  priceTrend?: {
    current?: number;
    original?: number;
    currency?: string;
    dataCertainty?: 'high' | 'medium' | 'low';
    marketAverage?: number;
  };
  priceAnalysis?: {
    isGoodDeal?: boolean;
    priceRank?: 'excellent' | 'good' | 'average' | 'poor';
    savingsAmount?: number;
    certaintyLevel?: 'high' | 'medium' | 'low';
    marketComparison?: string;
    bestTimeDescription?: string;
  };
  dealScore?: number;
  ethicalScore?: number;
  decision?: 'buy_now' | 'wait' | 'avoid' | 'research_more';
  recommendation?: {
    action?: string;
    confidence?: number;
    urgency?: 'high' | 'medium' | 'low';
  };
  insights?: {
    honestAssessment?: string;
    warnings?: string[];
  };
  trustScore?: {
    dataReliability?: number;
    overallTrust?: 'high' | 'medium' | 'low';
    explanation?: string;
  };
  
  // Enhanced comprehensive data
  productVariants?: ProductVariant[];
  priceHistory?: Array<{ date: string; price: number; source: string }>;
  marketStats?: MarketStats;
  alternatives?: Array<{
    title: string;
    ethicalScore: number;
    priceComparison: number;
    reasonForRecommendation: string;
  }>;
  
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
}

interface ProductAnalysisResultsProps {
  result: AnalysisResult;
  url: string;
}

export function ProductAnalysisResults({ result, url }: ProductAnalysisResultsProps) {
  const formatPrice = (amount?: number) => {
    return amount ? `₹${amount.toLocaleString('en-IN')}` : 'N/A';
  };

  const getDecisionColorClass = (decision?: string) => {
    switch (decision) {
      case 'buy_now': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'wait': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800';
      case 'avoid': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  const getCertaintyColorClass = (certainty?: string) => {
    switch (certainty) {
      case 'high': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      default: return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
    }
  };

  const getScoreColorClass = (score?: number) => {
    if (!score) return 'text-gray-600 dark:text-gray-400';
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColorClass = (score?: number) => {
    if (!score) return 'bg-gray-200 dark:bg-gray-700';
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Honest Assessment Banner */}
      {result.insights?.honestAssessment && (
        <div 
          className={`p-6 rounded-xl border transition-all duration-300 ${
            result.trustScore?.overallTrust === 'high' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
            result.trustScore?.overallTrust === 'medium' 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 
              'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                result.trustScore?.overallTrust === 'high' 
                  ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' : 
                result.trustScore?.overallTrust === 'medium' 
                  ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-400' : 
                  'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400'
              }`}>
                <IconShield size={20} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Honest Assessment</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {result.insights.honestAssessment}
            </p>
          </div>
        </div>
      )}

      {/* AI Model Badge */}
      {result.aiModel && (
        <div className="flex justify-center">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            result.aiModel === 'gemini-pro' 
              ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200'
              : 'bg-gray-100 text-gray-700 border border-gray-200'
          }`}>
            🤖 Powered by {result.aiModel === 'gemini-pro' ? 'Google Gemini Pro AI' : 'Advanced Fallback Analysis'}
          </span>
        </div>
      )}

      {/* Competitive Features - Our Unique Value Proposition */}
      {result.competitiveFeatures && (
        <div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-full font-bold text-lg shadow-lg">
              🎯 UNIQUE INSIGHTS - NO COMPETITOR OFFERS THESE
            </div>
          </div>
          <CompetitiveFeaturesDisplay features={result.competitiveFeatures} />
        </div>
      )}

      {/* Unique Insights Summary */}
      {result.uniqueInsights && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            EthiShop Exclusive Insights
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-600 mb-1">🌱 Carbon Impact</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{result.uniqueInsights.carbonFootprint}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm font-medium text-orange-600 mb-1">🔍 Supply Chain</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{result.uniqueInsights.supplyChainRisk}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm font-medium text-purple-600 mb-1">🏢 Brand Trust</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{result.uniqueInsights.brandTrustScore}/100</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm font-medium text-red-600 mb-1">💰 Hidden Costs</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{result.uniqueInsights.hiddenCosts}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-600 mb-1">📈 Future Value</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{result.uniqueInsights.futureValuePrediction}</div>
            </div>
          </div>
        </div>
      )}

      {/* Price Intelligence Report */}
      <PriceIntelligenceReport 
        data={generateMockPriceIntelligence(url)}
      />

      {/* Product Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {result.productInfo?.title || 'Product Analysis'}
          </h2>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium capitalize">
              {result.platform || 'Unknown Platform'}
            </span>
            {result.productInfo?.brand && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                {result.productInfo.brand}
              </span>
            )}
            {result.productInfo?.availability && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.productInfo.availability === 'in_stock' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {result.productInfo.availability.replace('_', ' ').toUpperCase()}
              </span>
            )}
            {result.priceTrend?.dataCertainty && (
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCertaintyColorClass(result.priceTrend.dataCertainty)}`}
                title={result.trustScore?.explanation}
              >
                {result.priceTrend.dataCertainty.toUpperCase()} CERTAINTY
              </span>
            )}
          </div>

          {/* Action Recommendation */}
          {result.recommendation?.action && (
            <div className={`px-6 py-3 rounded-lg border text-center font-semibold ${getDecisionColorClass(result.decision)}`}>
              {result.recommendation.action}
            </div>
          )}
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Deal Score */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Deal Score</h3>
            <div className={`text-3xl font-bold ${getScoreColorClass(result.dealScore)}`}>
              {result.dealScore}/100
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColorClass(result.dealScore)}`}
                style={{ width: `${result.dealScore || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Overall value rating</p>
          </div>
        </div>

        {/* Ethical Score */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Ethical Score</h3>
            <div className={`text-3xl font-bold ${getScoreColorClass(result.ethicalScore)}`}>
              {result.ethicalScore}/100
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColorClass(result.ethicalScore)}`}
                style={{ width: `${result.ethicalScore || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Sustainability & ethics</p>
          </div>
        </div>

        {/* Data Trust */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Data Trust</h3>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {result.trustScore?.dataReliability || 95}/100
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${result.trustScore?.dataReliability || 95}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Information reliability</p>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Overall Rating</h3>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(((result.dealScore || 95) + (result.ethicalScore || 65)) / 2)}/100
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${Math.round(((result.dealScore || 95) + (result.ethicalScore || 65)) / 2)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Combined recommendation</p>
          </div>
        </div>
      </div>

      {/* Product Variants Section */}
      {result.productVariants && result.productVariants.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <IconCurrency className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            Available Options & Variants
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.productVariants.map((variant, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border-2 border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{variant.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      variant.availability === 'in_stock' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : variant.availability === 'limited'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {variant.availability.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ${variant.price.toFixed(2)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Ethical Score</span>
                      <span className={`font-medium ${getScoreColorClass(variant.ethicalScore)}`}>
                        {variant.ethicalScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColorClass(variant.ethicalScore)}`}
                        style={{ width: `${variant.ethicalScore}%` }}
                      />
                    </div>
                  </div>
                  
                  <button className="w-full py-2 px-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-300 rounded-lg transition-colors text-sm font-medium">
                    Select Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Statistics */}
      {result.marketStats && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <IconStar className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            Market Intelligence
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.marketStats.competitorAnalysis && (
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.marketStats.competitorAnalysis.similarProducts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Similar Products</div>
              </div>
            )}
            
            {result.marketStats.competitorAnalysis?.averageMarketPrice && (
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${result.marketStats.competitorAnalysis.averageMarketPrice}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Average</div>
              </div>
            )}
            
            {result.marketStats.trendDirection && (
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className={`text-2xl font-bold capitalize ${
                  result.marketStats.trendDirection === 'rising' ? 'text-green-600 dark:text-green-400' :
                  result.marketStats.trendDirection === 'declining' ? 'text-red-600 dark:text-red-400' :
                  'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {result.marketStats.trendDirection}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Trend</div>
              </div>
            )}
            
            {result.marketStats.demandForecast && (
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.marketStats.demandForecast}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Demand Forecast</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alternative Recommendations */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <IconShield className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            Recommended Alternatives
          </h3>
          
          <div className="space-y-4">
            {result.alternatives.map((alternative, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{alternative.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alternative.reasonForRecommendation}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getScoreColorClass(alternative.ethicalScore)}`}>
                      {alternative.ethicalScore}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Ethics</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      alternative.priceComparison < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {alternative.priceComparison > 0 ? '+' : ''}{alternative.priceComparison}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Price</div>
                  </div>
                  
                  <button className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors text-sm font-medium">
                    View Alternative
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <IconExternalLink size={20} />
          View Product
        </a>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium">
          <IconInfoCircle size={20} />
          More Details
        </button>
      </div>
    </div>
  );
}