/* eslint-disable react/forbid-dom-props */
import React from 'react';
import { motion } from 'framer-motion';
import { CompetitiveFeatures } from '../../types/api';

// Local minimal ScoreRing fallback to avoid missing module error.
// Kept intentionally small — replace with your full implementation when available.
interface ScoreRingProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  color?: 'green' | 'red' | string;
}
const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 'medium',
  label,
  color = 'blue',
}) => {
  const dim = size === 'small' ? 40 : size === 'large' ? 64 : 48;
  const colorClass =
    color === 'green'
      ? 'text-green-600'
      : color === 'red'
        ? 'text-red-600'
        : 'text-blue-600';
  return (
    // eslint-disable-next-line react/forbid-dom-props
    <div className="flex flex-col items-center" style={{ width: dim }}>
      {/* eslint-disable-next-line react/forbid-dom-props */}
      <div
        className={`rounded-full flex items-center justify-center ${colorClass} font-semibold text-center`}
        style={{ height: dim, width: dim }}
      >
        {Math.round(score)}
        <span className="text-xs ml-1">%</span>
      </div>
      {label && <div className="text-xs text-gray-500 mt-1">{label}</div>}
    </div>
  );
};

interface CompetitiveFeaturesDisplayProps {
  features: CompetitiveFeatures;
  isLoading?: boolean;
}

export const CompetitiveFeaturesDisplay: React.FC<
  CompetitiveFeaturesDisplayProps
> = ({ features, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Price Prediction */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">📈</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              ML Price Prediction
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              UNIQUE FEATURE
            </span>
          </div>
          <div className="ml-auto">
            <ScoreRing
              score={features.pricePrediction.confidence}
              size="small"
              label="Confidence"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              ₹{features.pricePrediction.nextWeekPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Next Week
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              ₹{features.pricePrediction.nextMonthPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Next Month
            </p>
          </div>
          <div className="text-center">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                features.pricePrediction.priceDirection === 'up'
                  ? 'bg-red-100 text-red-800'
                  : features.pricePrediction.priceDirection === 'down'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {features.pricePrediction.priceDirection === 'up' && '↗️'}
              {features.pricePrediction.priceDirection === 'down' && '↘️'}
              {features.pricePrediction.priceDirection === 'stable' && '➡️'}
              {features.pricePrediction.priceDirection}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Trend
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {features.pricePrediction.confidence}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Confidence
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            💡 Smart Recommendation
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {features.pricePrediction.bestTimeToNuy}
          </p>
        </div>
      </motion.div>

      {/* Carbon Footprint */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">🌱</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Carbon Footprint Analysis
            </h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              UNIQUE FEATURE
            </span>
          </div>
          <div className="ml-auto">
            <ScoreRing
              score={100 - features.carbonFootprint.totalScore}
              size="small"
              label="Eco Score"
              color="green"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-lg font-bold text-orange-600">
              {features.carbonFootprint.breakdown.manufacturing}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Manufacturing
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-lg font-bold text-blue-600">
              {features.carbonFootprint.breakdown.shipping}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">Shipping</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-lg font-bold text-purple-600">
              {features.carbonFootprint.breakdown.packaging}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Packaging
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-lg font-bold text-red-600">
              {features.carbonFootprint.breakdown.disposal}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">Disposal</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            📊 {features.carbonFootprint.comparison}
          </p>
        </div>

        {features.carbonFootprint.improvementSuggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              💚 Eco-Friendly Suggestions:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {features.carbonFootprint.improvementSuggestions
                .slice(0, 3)
                .map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Supply Chain & Brand Reputation */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Supply Chain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">🔍</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Supply Chain
              </h3>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                UNIQUE FEATURE
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Risk Level
              </span>
              <span className="text-sm font-bold text-orange-600">
                {features.supplyChainTransparency.riskScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              {/* eslint-disable-next-line react/forbid-dom-props */}
              <div
                className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full transition-all"
                style={{
                  width: `${features.supplyChainTransparency.riskScore}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Labor Standards:
              </span>
              <span
                className={`text-sm font-medium capitalize ${
                  features.supplyChainTransparency.laborStandards ===
                  'excellent'
                    ? 'text-green-600'
                    : features.supplyChainTransparency.laborStandards === 'good'
                      ? 'text-blue-600'
                      : features.supplyChainTransparency.laborStandards ===
                          'average'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                }`}
              >
                {features.supplyChainTransparency.laborStandards}
              </span>
            </div>

            {features.supplyChainTransparency.certifications.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Certifications:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {features.supplyChainTransparency.certifications
                    .slice(0, 3)
                    .map((cert, index) => (
                      <span
                        key={index}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                      >
                        {cert}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Brand Reputation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">🏢</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Brand Reputation
              </h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                UNIQUE FEATURE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center">
              <ScoreRing
                score={features.brandReputation.trustScore}
                size="small"
              />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Trust
              </p>
            </div>
            <div className="text-center">
              <ScoreRing
                score={features.brandReputation.ethicalScore}
                size="small"
                color="green"
              />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Ethics
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Market Position:
              </span>
              <span className="text-sm font-medium text-purple-600">
                {features.brandReputation.marketPosition}
              </span>
            </div>

            {features.brandReputation.positiveActions.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Positive Actions:
                </span>
                <div className="mt-1">
                  {features.brandReputation.positiveActions
                    .slice(0, 2)
                    .map((action, index) => (
                      <div
                        key={index}
                        className="text-xs text-green-700 dark:text-green-300 flex items-start"
                      >
                        <span className="text-green-500 mr-1">✓</span>
                        {action}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {features.brandReputation.controversies.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Concerns:
                </span>
                <div className="mt-1">
                  {features.brandReputation.controversies
                    .slice(0, 2)
                    .map((controversy, index) => (
                      <div
                        key={index}
                        className="text-xs text-red-700 dark:text-red-300 flex items-start"
                      >
                        <span className="text-red-500 mr-1">⚠</span>
                        {controversy}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Smart Financial Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800"
      >
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">🧠</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Smart Financial Insights
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              UNIQUE FEATURE
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Hidden Costs */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Hidden Costs
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Shipping:
                </span>
                <span className="font-medium">
                  ₹
                  {features.smartInsights.hiddenCosts.estimatedShipping.toFixed(
                    0,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Taxes:</span>
                <span className="font-medium">
                  ₹{features.smartInsights.hiddenCosts.taxes.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Returns:
                </span>
                <span className="font-medium">
                  ₹{features.smartInsights.hiddenCosts.returns.toFixed(0)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Extra:</span>
                <span className="text-red-600">
                  ₹{features.smartInsights.hiddenCosts.total.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Value Analysis */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Value Analysis
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Per Feature:
                </span>
                <span className="font-medium">
                  ₹
                  {features.smartInsights.valueAnalysis.pricePerFeature.toFixed(
                    0,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Durability:
                </span>
                <span className="font-medium">
                  {features.smartInsights.valueAnalysis.durabilityScore}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Resale Value:
                </span>
                <span className="font-medium">
                  ₹{features.smartInsights.valueAnalysis.resaleValue.toFixed(0)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>True Cost:</span>
                <span className="text-blue-600">
                  ₹
                  {features.smartInsights.valueAnalysis.totalCostOfOwnership.toFixed(
                    0,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Social Proof
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Trending:
                </span>
                <span className="font-medium">
                  {features.smartInsights.socialProof.trendingScore}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Virality:
                </span>
                <span
                  className={`font-medium capitalize ${
                    features.smartInsights.socialProof.virality === 'high'
                      ? 'text-green-600'
                      : features.smartInsights.socialProof.virality === 'medium'
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                  }`}
                >
                  {features.smartInsights.socialProof.virality}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Mentions:
                </span>
                <span className="font-medium">
                  {features.smartInsights.socialProof.socialMediaMentions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Unique Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg">🎯</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Unique Insights Only EthiShop Provides
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            No other platform offers this level of comprehensive analysis
          </p>

          <div className="grid md:grid-cols-5 gap-3 text-xs">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div className="font-semibold text-blue-600">📈 Price ML</div>
              <div className="text-gray-600 dark:text-gray-300">
                AI Prediction
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div className="font-semibold text-green-600">🌱 Carbon</div>
              <div className="text-gray-600 dark:text-gray-300">
                Real Impact
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div className="font-semibold text-orange-600">🔍 Supply</div>
              <div className="text-gray-600 dark:text-gray-300">
                Chain Intel
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div className="font-semibold text-purple-600">🏢 Brand</div>
              <div className="text-gray-600 dark:text-gray-300">Reputation</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div className="font-semibold text-indigo-600">🧠 Smart</div>
              <div className="text-gray-600 dark:text-gray-300">Finance</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
