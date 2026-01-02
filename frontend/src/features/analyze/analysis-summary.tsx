'use client';

import { IconTrendingUp, IconShield, IconCurrency } from '@tabler/icons-react';

interface AnalysisSummaryProps {
  ethicalScore?: number;
  dealScore?: number;
  recommendation?: string;
  confidence?: number;
}

export function AnalysisSummary({
  ethicalScore = 75,
  dealScore = 85,
  recommendation = 'Good choice with ethical practices',
  confidence = 0.8,
}: AnalysisSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Analysis Summary
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {Math.round(confidence * 100)}% Confidence
          </span>
        </div>

        <div className="space-y-4">
          {/* Ethical Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                  <IconShield size={14} className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Ethical Score
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {ethicalScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(ethicalScore)}`}
                style={{ width: `${ethicalScore}%` }}
              />
            </div>
          </div>

          {/* Deal Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                  <IconCurrency size={14} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Deal Score
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {dealScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(dealScore)}`}
                style={{ width: `${dealScore}%` }}
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <IconTrendingUp size={14} className="text-blue-600" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900">
                  Recommendation
                </div>
                <div className="text-sm text-gray-600">{recommendation}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
