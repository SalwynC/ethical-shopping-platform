"use client";

import { PriceIntelligenceReport } from "./PriceIntelligenceReport";
import { useState } from "react";

// Sample data matching your design exactly
const sampleData = {
  currentPrice: {
    amount: 1999,
    confidence: 'HIGH' as const,
    currency: '₹'
  },
  originalPrice: {
    amount: 7990,
    savings: 5991,
    discountPercentage: 75
  },
  marketAnalysis: {
    averagePrice: 2198.9,
    platforms: ['Amazon', 'Flipkart', 'Myntra', 'Snapdeal'],
    trend: 'FALLING' as const,
    position: 'Lowest price tracked'
  },
  recommendation: {
    action: 'BUY_NOW' as const,
    timing: 'NOW',
    priority: 'HIGH' as const,
    confidence: 100,
    reasoning: 'Exceptional deal that may not last'
  },
  scores: {
    dealScore: 95,
    dataTrust: 100,
    ethicalScore: 65,
    overallRating: 80
  }
};

export function PriceIntelligenceDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          🎯 Price Intelligence Report Demo
        </h1>
        
        <div className="flex justify-center">
          <button 
            onClick={handleRefresh} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing...
              </div>
            ) : (
              "Refresh Analysis"
            )}
          </button>
        </div>
        
        <div className="w-full">
          <PriceIntelligenceReport 
            data={sampleData} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}