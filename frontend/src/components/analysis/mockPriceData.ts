"use client";

// Enhanced mock data generator for testing PriceIntelligenceReport
export const generateMockPriceIntelligence = (url?: string) => {
  // Generate realistic prices based on URL patterns
  const basePrice = Math.floor(Math.random() * 50000) + 500;
  const originalPrice = basePrice + Math.floor(Math.random() * 20000) + 500;
  const marketAverage = basePrice + Math.floor(Math.random() * 5000) - 2500;
  
  // Generate realistic scores
  const dealScore = Math.floor(Math.random() * 30) + 70; // 70-100
  const ethicalScore = Math.floor(Math.random() * 50) + 50; // 50-100
  const dataTrust = Math.floor(Math.random() * 20) + 80; // 80-100
  
  return {
    currentPrice: {
      amount: basePrice,
      confidence: dealScore > 90 ? 'HIGH' as const : dealScore > 70 ? 'MEDIUM' as const : 'LOW' as const,
      currency: '₹'
    },
    originalPrice: {
      amount: originalPrice,
      savings: originalPrice - basePrice,
      discountPercentage: Math.round(((originalPrice - basePrice) / originalPrice) * 100)
    },
    marketAnalysis: {
      averagePrice: marketAverage,
      platforms: ['Amazon', 'Flipkart', 'Myntra', 'Snapdeal', 'Paytm Mall'],
      trend: 'FALLING' as const,
      position: basePrice < marketAverage ? 'Below market average' : 'Above market average'
    },
    recommendation: {
      action: dealScore > 85 ? 'BUY_NOW' as const : dealScore > 60 ? 'WAIT' as const : 'AVOID' as const,
      timing: dealScore > 85 ? 'NOW' : 'WAIT FOR BETTER DEAL',
      priority: dealScore > 90 ? 'HIGH' as const : dealScore > 70 ? 'MEDIUM' as const : 'LOW' as const,
      confidence: dealScore,
      reasoning: dealScore > 85 
        ? 'Exceptional deal with high savings potential'
        : dealScore > 60 
        ? 'Good price but might drop further'
        : 'Overpriced - wait for better offers'
    },
    scores: {
      dealScore,
      dataTrust,
      ethicalScore,
      overallRating: Math.round((dealScore + ethicalScore) / 2)
    }
  };
};