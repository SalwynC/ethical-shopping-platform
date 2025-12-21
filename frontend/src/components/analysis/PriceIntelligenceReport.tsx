"use client";

// Simplified PriceIntelligenceReport component - Tailwind version
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  IconCurrency,
  IconTrendingUp,
  IconTrendingDown,
  IconShield,
  IconStar,
  IconTarget,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import { useUsdInrRate, formatDual } from "../../lib/currency";

interface PriceIntelligenceData {
  currentPrice: {
    amount: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    currency: string;
  };
  originalPrice: {
    amount: number;
    savings: number;
    discountPercentage: number;
  };
  marketAnalysis: {
    averagePrice: number;
    platforms: string[];
    trend: 'RISING' | 'FALLING' | 'STABLE';
    position: string;
  };
  recommendation: {
    action: 'BUY_NOW' | 'WAIT' | 'AVOID' | 'RESEARCH';
    timing: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    confidence: number;
    reasoning: string;
  };
  scores: {
    dealScore: number;
    dataTrust: number;
    ethicalScore: number;
    overallRating: number;
  };
}

interface PriceIntelligenceReportProps {
  data: PriceIntelligenceData;
  isLoading?: boolean;
}

export function PriceIntelligenceReport({ data, isLoading }: PriceIntelligenceReportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const fx = useUsdInrRate();
  const resolveCurrency = (c: string): 'USD' | 'INR' => (c?.toUpperCase() === 'USD' || c === '$') ? 'USD' : 'INR';

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY_NOW': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'WAIT': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'AVOID': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return 'text-green-600 dark:text-green-400';
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-400';
      case 'LOW': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <IconCurrency size={24} />
          </div>
          <h3 className="text-xl font-bold">💰 Price Intelligence Report</h3>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            {data.currentPrice.confidence} CERTAINTY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Current Price */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm opacity-90">Current Price</div>
            <div className="text-2xl font-bold">
              {fx ? (
                (() => {
                  const base = resolveCurrency(data.currentPrice.currency);
                  const dual = formatDual(data.currentPrice.amount, base, fx.rate);
                  return (
                    <div>
                      <div>{dual.inr}</div>
                      <div className="text-lg opacity-90">{dual.usd}</div>
                    </div>
                  );
                })()
              ) : (
                <span>
                  {data.currentPrice.currency}{data.currentPrice.amount.toLocaleString()}
                </span>
              )}
            </div>
            <div className={`text-sm ${getConfidenceColor(data.currentPrice.confidence)}`}>
              {data.currentPrice.confidence} Confidence
            </div>
          </div>

          {/* Savings */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm opacity-90">You Save</div>
            <div className="text-2xl font-bold text-green-300">
              {fx ? (
                (() => {
                  const base = resolveCurrency(data.currentPrice.currency);
                  const dual = formatDual(data.originalPrice.savings, base, fx.rate);
                  return (
                    <div>
                      <div>{dual.inr}</div>
                      <div className="text-lg opacity-90">{dual.usd}</div>
                    </div>
                  );
                })()
              ) : (
                <span>
                  {data.currentPrice.currency}{data.originalPrice.savings.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-sm text-green-200">
              {data.originalPrice.discountPercentage}% off
            </div>
          </div>

          {/* Market Position */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm opacity-90">Market Position</div>
            <div className="text-lg font-bold">
              {data.marketAnalysis.position}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {data.marketAnalysis.trend === 'FALLING' ? (
                <IconTrendingDown className="text-green-300" size={16} />
              ) : data.marketAnalysis.trend === 'RISING' ? (
                <IconTrendingUp className="text-red-300" size={16} />
              ) : null}
              <span>{data.marketAnalysis.trend}</span>
            </div>
          </div>

          {/* Deal Score */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm opacity-90">Deal Score</div>
            <div className="text-2xl font-bold">
              {data.scores.dealScore}/100
            </div>
            <div className="text-sm text-green-200">
              Excellent Value
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Recommendation Banner */}
        <div className={`p-4 rounded-lg border mb-6 ${getActionColor(data.recommendation.action)}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">Recommendation: {data.recommendation.action.replace('_', ' ')}</h4>
            <div className="flex items-center gap-2">
              <IconTarget size={20} />
              <span className="font-medium">{data.recommendation.confidence}% Confident</span>
            </div>
          </div>
          <p className="text-sm opacity-90">{data.recommendation.reasoning}</p>
        </div>

        {/* Market Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900 dark:text-white">Market Comparison</h5>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Market Average</span>
                <span className="font-medium">
                  {fx ? (
                    (() => {
                      const base = resolveCurrency(data.currentPrice.currency);
                      const dual = formatDual(data.marketAnalysis.averagePrice, base, fx.rate);
                      return (
                        <span>
                          {dual.inr} · {dual.usd}
                        </span>
                      );
                    })()
                  ) : (
                    <span>{data.currentPrice.currency}{data.marketAnalysis.averagePrice.toLocaleString()}</span>
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Based on {data.marketAnalysis.platforms.join(', ')}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900 dark:text-white">Trust Metrics</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Data Trust</span>
                <span className="font-medium">{data.scores.dataTrust}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Ethical Score</span>
                <span className="font-medium">{data.scores.ethicalScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Overall Rating</span>
                <span className="font-medium">{data.scores.overallRating}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            {showDetails ? 'Hide Details' : 'Show More Details'}
          </button>
        </div>

        {/* Additional Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h6 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Advanced Price Intelligence
              </h6>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Our AI analyzes pricing patterns, market trends, and consumer behavior to provide 
                the most accurate recommendations. This analysis is based on real-time data from 
                multiple sources and our proprietary algorithms.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
