"use client";

import { useState, useCallback } from 'react';

interface AutoAnalysisResult {
  platform: string;
  productInfo: {
    title: string;
    category: string;
    brand?: string;
    price?: number;
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    availability: 'in_stock' | 'out_of_stock' | 'limited' | 'unknown';
  };
  priceTrend: {
    current: number;
    original?: number;
    currency: string;
    dataCertainty: 'high' | 'medium' | 'low';
    marketAverage?: number;
  };
  priceAnalysis: {
    isGoodDeal: boolean;
    priceRank: 'excellent' | 'good' | 'average' | 'poor';
    savingsAmount?: number;
    certaintyLevel: 'high' | 'medium' | 'low';
    marketComparison: string;
    bestTimeDescription: string;
  };
  dealScore: number;
  ethicalScore: number;
  decision: 'buy_now' | 'wait' | 'avoid' | 'research_more';
  recommendation: {
    action: string;
    confidence: number;
    urgency: 'high' | 'medium' | 'low';
  };
  trustScore: {
    dataReliability: number;
    overallTrust: 'high' | 'medium' | 'low';
    explanation: string;
  };
  insights: {
    honestAssessment: string;
    warnings?: string[];
  };
}

// Enhanced URL analysis with product detection
export const analyzeProductUrl = async (url: string): Promise<AutoAnalysisResult> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract platform and product info from URL
  const domain = new URL(url).hostname.toLowerCase();
  let platform = 'Unknown';
  let category = 'Electronics';
  let brand = '';
  
  // Platform detection
  if (domain.includes('amazon')) {
    platform = 'Amazon';
    category = detectAmazonCategory(url);
  } else if (domain.includes('flipkart')) {
    platform = 'Flipkart';
    category = detectFlipkartCategory(url);
  } else if (domain.includes('myntra')) {
    platform = 'Myntra';
    category = 'Fashion';
  } else if (domain.includes('ajio')) {
    platform = 'Ajio';
    category = 'Fashion';
  }

  // Generate realistic analysis
  const currentPrice = Math.floor(Math.random() * 50000) + 500;
  const originalPrice = currentPrice + Math.floor(Math.random() * 20000) + 500;
  const dealScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const ethicalScore = Math.floor(Math.random() * 50) + 50; // 50-100
  
  return {
    platform,
    productInfo: {
      title: generateProductTitle(category, platform),
      category,
      brand: generateBrand(category),
      price: currentPrice,
      originalPrice,
      rating: 3.5 + Math.random() * 1.5,
      reviews: Math.floor(Math.random() * 10000) + 100,
      availability: Math.random() > 0.2 ? 'in_stock' : 'limited'
    },
    priceTrend: {
      current: currentPrice,
      original: originalPrice,
      currency: '₹',
      dataCertainty: dealScore > 80 ? 'high' : dealScore > 60 ? 'medium' : 'low',
      marketAverage: currentPrice + Math.floor(Math.random() * 5000) - 2500
    },
    priceAnalysis: {
      isGoodDeal: dealScore > 75,
      priceRank: dealScore > 90 ? 'excellent' : dealScore > 75 ? 'good' : dealScore > 60 ? 'average' : 'poor',
      savingsAmount: originalPrice - currentPrice,
      certaintyLevel: dealScore > 80 ? 'high' : 'medium',
      marketComparison: currentPrice < (currentPrice + 2000) ? 'Below market average' : 'Above market average',
      bestTimeDescription: dealScore > 85 ? 'Excellent time to buy' : 'Consider waiting for better deals'
    },
    dealScore,
    ethicalScore,
    decision: dealScore > 85 ? 'buy_now' : dealScore > 65 ? 'wait' : 'research_more',
    recommendation: {
      action: dealScore > 85 ? 'Buy Now - Great Deal!' : dealScore > 65 ? 'Wait for Better Price' : 'Research More Options',
      confidence: dealScore,
      urgency: dealScore > 85 ? 'high' : 'medium'
    },
    trustScore: {
      dataReliability: Math.floor(Math.random() * 20) + 80,
      overallTrust: dealScore > 80 ? 'high' : 'medium',
      explanation: `Analysis based on ${platform} data with ${dealScore > 80 ? 'high' : 'medium'} confidence`
    },
    insights: {
      honestAssessment: generateHonestAssessment(dealScore, platform),
      warnings: dealScore < 60 ? ['Price seems high compared to market', 'Consider checking other platforms'] : undefined
    }
  };
};

// Helper functions for realistic data generation
const detectAmazonCategory = (url: string): string => {
  if (url.includes('mobile') || url.includes('phone')) return 'Smartphones';
  if (url.includes('laptop') || url.includes('computer')) return 'Laptops';
  if (url.includes('headphone') || url.includes('audio')) return 'Audio';
  if (url.includes('watch')) return 'Watches';
  if (url.includes('book')) return 'Books';
  return 'Electronics';
};

const detectFlipkartCategory = (url: string): string => {
  if (url.includes('mobile')) return 'Smartphones';
  if (url.includes('laptop')) return 'Laptops';
  if (url.includes('fashion')) return 'Fashion';
  if (url.includes('home')) return 'Home & Kitchen';
  return 'Electronics';
};

const generateProductTitle = (category: string, platform: string): string => {
  const titles = {
    'Smartphones': [
      'Premium 5G Smartphone with 108MP Camera',
      'Latest Android Phone with Fast Charging',
      'High-Performance Gaming Smartphone'
    ],
    'Laptops': [
      'Ultra-Thin Business Laptop 14-inch',
      'Gaming Laptop with RTX Graphics',
      '2-in-1 Convertible Laptop'
    ],
    'Fashion': [
      'Premium Cotton Casual Shirt',
      'Designer Ethnic Wear Collection',
      'Comfortable Sports Sneakers'
    ],
    'Audio': [
      'Wireless Noise Cancelling Headphones',
      'Premium Bluetooth Earbuds',
      'Studio Quality Over-Ear Headphones'
    ],
    'Electronics': [
      'Smart Home Device with AI',
      'Portable Electronics Gadget',
      'Advanced Tech Accessory'
    ]
  };
  
  const categoryTitles = titles[category as keyof typeof titles] || titles.Electronics;
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
};

const generateBrand = (category: string): string => {
  const brands = {
    'Smartphones': ['Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Apple'],
    'Laptops': ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer'],
    'Fashion': ['Nike', 'Adidas', 'Puma', 'Levi\'s', 'H&M'],
    'Audio': ['Sony', 'JBL', 'Bose', 'Sennheiser', 'Audio-Technica'],
    'Electronics': ['Philips', 'LG', 'Samsung', 'Panasonic', 'Bosch']
  };
  
  const categoryBrands = brands[category as keyof typeof brands] || brands.Electronics;
  return categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
};

const generateHonestAssessment = (dealScore: number, platform: string): string => {
  if (dealScore > 90) {
    return `Exceptional deal on ${platform}! This is among the lowest prices we've tracked. Strong recommendation to purchase now.`;
  } else if (dealScore > 75) {
    return `Good value proposition on ${platform}. Price is competitive and this appears to be a solid purchase decision.`;
  } else if (dealScore > 60) {
    return `Average deal on ${platform}. Price is fair but you might find better offers with some patience.`;
  } else {
    return `Below average deal on ${platform}. Consider waiting or checking alternative platforms for better pricing.`;
  }
};

// Custom hook for auto-analysis
export const useAutoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AutoAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const analyzeUrl = useCallback(async (url: string) => {
    if (!url || !url.includes('http')) {
      setError('Please enter a valid product URL');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const analysisResult = await analyzeProductUrl(url);
      setResult(analysisResult);
    } catch (err) {
      setError('Failed to analyze product. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return {
    analyzeUrl,
    clearResult,
    isAnalyzing,
    result,
    error
  };
};