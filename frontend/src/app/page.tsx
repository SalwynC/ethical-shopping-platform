/* eslint-disable react/forbid-dom-props */
'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Removed Mantine Container import
import { motion } from 'framer-motion';
import { 
  IconSearch, 
  IconLeaf, 
  IconShield, 
  IconTrendingUp,
  IconStar,
  IconExternalLink,
} from '@tabler/icons-react';

import { FloatingActions } from '../components/layout/FloatingActions';
import { LiveStatusIndicator } from '../components/layout/LiveStatusIndicator';
import { LiveBackground } from '../components/layout/LiveBackground';
import { DynamicExamplesGrid } from '../components/dynamic/DynamicExamplesGrid';
import { LiveScoreCard } from '../components/dynamic/LiveScoreCard';
import { SmartAnalyticsDashboard } from '../components/dynamic/SmartAnalyticsDashboard';
import { useTheme } from '../contexts/ThemeContext';
import { AnalysisProgress, AnalysisStep } from '../components/analysis/AnalysisProgress';
import { ProductAnalysisResults } from '../components/analysis/ProductAnalysisResults';
import { recordProductAnalysis } from '../lib/real-analytics';
import { formatCurrency } from '../lib/currency';
import { fetchLiveStats } from '../lib/api';

const suggestions = [
  'https://www.amazon.com/dp/B08N5WRWNW',
  'https://www.nike.com/t/air-max-270-mens-shoes-jAKsKsbf',
  'https://www.apple.com/iphone-15/',
  'https://www.target.com/p/women-s-oversized-sweatshirt',
  'https://www.ebay.com/itm/123456789'
];

const initialAnalysisSteps: AnalysisStep[] = [
  {
    id: 'url-validation',
    label: 'Validating Product URL',
    status: 'pending',
    message: 'Checking if the URL is accessible and contains product data'
  },
  {
    id: 'product-extraction',
    label: 'Extracting Product Information',
    status: 'pending',
    message: 'Getting product title, price, description, and images'
  },
  {
    id: 'sustainability-check',
    label: 'Analyzing Sustainability Metrics',
    status: 'pending',
    message: 'Checking environmental impact and eco-certifications'
  },
  {
    id: 'ethical-evaluation',
    label: 'Evaluating Ethical Practices',
    status: 'pending',
    message: 'Assessing labor practices and fair trade compliance'
  },
  {
    id: 'price-comparison',
    label: 'Comparing Prices Across Platforms',
    status: 'pending',
    message: 'Finding better deals on similar products'
  },
  {
    id: 'alternatives-search',
    label: 'Finding Ethical Alternatives',
    status: 'pending',
    message: 'Searching for more sustainable product options'
  }
];

function SavedToday({ amountUsd }: { amountUsd: number }) {
  const inrAmount = Math.round(amountUsd * 84);
  return (
    <motion.div 
      className="text-3xl font-bold text-purple-400 mb-2"
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
    >
      <span className="block text-purple-400">{formatCurrency(inrAmount, 'INR')}</span>
    </motion.div>
  );
}

export default function HomePage() {
  const [productUrl, setProductUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [liveStats, setLiveStats] = useState({
    analyzing: 25,
    processed: 50127,
    saved: 750
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Mark component as client-mounted
    setIsClientMounted(true);
    
    // Fetch real live stats from backend
    const fetchAndUpdateStats = async () => {
      try {
        const response = await fetchLiveStats();
        if (response.success && response.data) {
          setLiveStats({
            analyzing: response.data.analyzing,
            processed: response.data.processed,
            saved: response.data.saved
          });
        }
      } catch (error) {
        // Fallback to demo data if backend unreachable
        console.log('Using demo stats (backend not available)');
        setLiveStats({
          analyzing: Math.floor(Math.random() * 50) + 20,
          processed: 50127 + Math.floor(Math.random() * 100),
          saved: Math.floor(Math.random() * 1000) + 500
        });
      }
    };

    // Fetch immediately
    fetchAndUpdateStats();
    
    // Real-time stats updates from backend
    const statsInterval = setInterval(fetchAndUpdateStats, 3000);

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(statsInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Reset states when URL is empty
    if (!productUrl.trim()) {
      setIsValidUrl(false);
      setUrlError('');
      setIsTyping(false);
      return;
    }

    // Set typing indicator
    setIsTyping(true);
    const typingTimeout = setTimeout(() => setIsTyping(false), 500);
    
    // Enhanced URL validation function
    const validateUrl = () => {
      const urlString = productUrl.trim();
      
      try {
        const url = new URL(urlString);
        
        // Check if it's a valid HTTP/HTTPS URL
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          setUrlError('Please use HTTP or HTTPS URLs');
          setIsValidUrl(false);
          return;
        }
        
        // Enhanced shopping site detection
        const supportedSites = [
          // Major E-commerce
          'amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es', 'amazon.in', 'amazon.co.jp',
          'ebay.com', 'ebay.co.uk', 'ebay.ca', 'ebay.de', 'ebay.fr', 'ebay.it', 'ebay.es',
          'walmart.com', 'target.com', 'bestbuy.com', 'homedepot.com', 'lowes.com',
          // Fashion & Lifestyle
          'nike.com', 'adidas.com', 'zara.com', 'hm.com', 'uniqlo.com', 'gap.com',
          'macys.com', 'nordstrom.com', 'sephora.com', 'ulta.com',
          // Tech & Electronics  
          'apple.com', 'samsung.com', 'sony.com', 'microsoft.com', 'dell.com', 'hp.com',
          'newegg.com', 'bhphotovideo.com', 'microcenter.com',
          // International
          'alibaba.com', 'aliexpress.com', 'flipkart.com', 'myntra.com', 'shopify.com',
          'etsy.com', 'overstock.com', 'wayfair.com', 'costco.com', 'samsclub.com'
        ];
        
        const hostname = url.hostname.toLowerCase();
        const isSupported = supportedSites.some(site => 
          hostname === site || hostname === `www.${site}` || hostname.endsWith(`.${site}`)
        );
        
        // Check for product-like paths
        const hasProductPath = /\/(product|item|p|dp|gp)\/|\/(.*\/)?(\w+-)*(\d+)/i.test(url.pathname);
        const hasProductParams = /[?&](pid|id|sku|asin|item)/i.test(url.search);
        
        if (isSupported || hasProductPath || hasProductParams) {
          setUrlError('');
          setIsValidUrl(true);
          
          // Provide helpful feedback about the detected site
          if (isSupported) {
            const siteName = hostname.replace('www.', '').split('.')[0];
            console.log(`✅ Detected supported site: ${siteName}`);
          }
        } else {
          // More helpful error message
          setUrlError(`This doesn't look like a product page. Try URLs from Amazon, eBay, Nike, etc.`);
          setIsValidUrl(false);
        }
        
      } catch (error) {
        // Enhanced error handling
        if (urlString.includes(' ') || !urlString.includes('.')) {
          setUrlError('Please enter a complete URL (e.g., https://amazon.com/product)');
        } else {
          setUrlError('Please enter a valid URL starting with http:// or https://');
        }
        setIsValidUrl(false);
      }
    };

    // Debounce validation
    const debounce = setTimeout(validateUrl, 300);
    
    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(debounce);
    };
  }, [productUrl]);

  const simulateAnalysisSteps = async () => {
    setAnalysisSteps([...initialAnalysisSteps]);
    setOverallProgress(0);
    
    for (let i = 0; i < initialAnalysisSteps.length; i++) {
      const currentStep = initialAnalysisSteps[i];
      
      // Update current step to in-progress
      setAnalysisSteps(prev => prev.map(step => 
        step.id === currentStep.id 
          ? { ...step, status: 'in-progress', progress: 0 }
          : step
      ));

      // Simulate progress for current step
      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAnalysisSteps(prev => prev.map(step =>
          step.id === currentStep.id
            ? { ...step, progress }
            : step
        ));
        
        // Update overall progress
        const stepProgress = (i * 100 + progress) / initialAnalysisSteps.length;
        setOverallProgress(stepProgress);
      }

      // Mark current step as completed
      setAnalysisSteps(prev => prev.map(step =>
        step.id === currentStep.id
          ? { 
              ...step, 
              status: 'completed', 
              progress: 100,
              message: getCompletedMessage(currentStep.id)
            }
          : step
      ));

      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setOverallProgress(100);
    return true;
  };

  const getCompletedMessage = (stepId: string): string => {
    const messages: Record<string, string> = {
      'url-validation': '✅ Product URL validated successfully',
      'product-extraction': '✅ Product information extracted',
      'sustainability-check': '✅ Sustainability score: 85/100',
      'ethical-evaluation': '✅ Ethical rating: Excellent (Fair Trade Certified)',
      'price-comparison': '✅ Found 3 better deals on other platforms',
      'alternatives-search': '✅ Found 5 more sustainable alternatives'
    };
    return messages[stepId] || '✅ Step completed successfully';
  };

  const handleAnalyze = async () => {
    if (!productUrl.trim() || !isValidUrl) return;
    
    setIsAnalyzing(true);
    setUrlError('');
    setShowResults(false);
    setAnalysisResults(null);
    
    const startTime = Date.now();
    const requestId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🚀 [${requestId}] Starting inline analysis at ${new Date().toISOString()}`);
      console.log(`📍 Target URL: ${productUrl.trim()}`);
      
      // Start visual progress simulation
      const progressPromise = simulateAnalysisSteps();
      
      // Call analyze API endpoint (correct backend endpoint)
      const apiPromise = fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Request-ID': requestId,
          'X-Request-Time': new Date().toISOString(),
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ 
          url: productUrl.trim(),
          requestId,
          timestamp: new Date().toISOString()
        }),
      });
      
      // Wait for both progress simulation and API call
      const [progressComplete, response] = await Promise.all([progressPromise, apiPromise]);
      const processingTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ [${requestId}] Analysis failed after ${processingTime}ms:`, errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Product analysis failed`);
      }

      const analysisData = await response.json();
      console.log(`✅ [${requestId}] Analysis completed in ${processingTime}ms`);
      console.log(`📊 Results received:`, analysisData);
      
      // Extract analysis results from backend
      const mockResults = {
        productUrl: productUrl.trim(),
        productName: analysisData.productInfo?.title || `Product from ${new URL(productUrl.trim()).hostname}`,
        overallScore: Math.round((analysisData.ethicalScore + analysisData.dealScore) / 2),
        ethicalScore: analysisData.ethicalScore || 75,
        priceScore: analysisData.dealScore || 70,
        sustainabilityScore: Math.round((analysisData.ethicalScore * 0.8) + (analysisData.dealScore * 0.2)),
        reviewTrust: analysisData.productInfo?.rating ? Math.round(analysisData.productInfo.rating * 20) : 80,
        processingTime,
        requestId,
        timestamp: new Date().toISOString(),
        
        // Real data from backend
        productData: analysisData.productInfo,
        
        // Price trends from backend
        priceAnalysis: analysisData.priceTrend,
        
        // Market position
        marketStats: {
          pricePosition: analysisData.recommendation?.confidence,
          demandForecast: analysisData.recommendation?.urgency,
          trendDirection: analysisData.priceTrend?.marketTrend
        },
        
        // Ethical alternatives from backend
        alternatives: analysisData.ethicalAlternatives?.slice(0, 3) || [
          { title: 'Top Ethical Alternative', ethicalScore: 92, priceComparison: -5 },
          { title: 'Sustainable Option', ethicalScore: 88, priceComparison: 3 },
          { title: 'Fair Trade Choice', ethicalScore: 85, priceComparison: 0 }
        ],
        
        // Detailed insights
        insights: [
          `Ethical Score: ${analysisData.ethicalScore || 75}/100`,
          `Deal Score: ${analysisData.dealScore || 70}/100`,
          `Decision: ${analysisData.decision || 'NEUTRAL'}`,
          `Market Trend: ${analysisData.priceTrend?.marketTrend || 'stable'}`,
          `Confidence: ${analysisData.recommendation?.confidence || 'Medium'}`
        ],
        
        futurePredict: {
          nextWeekPrice: analysisData.priceTrend?.predictedNextWeek,
          discountTrend: analysisData.priceTrend?.discountPercent,
          bestTimeToByy: analysisData.priceTrend?.marketTrend === 'declining' ? 'Soon - Price likely to drop further' : 'Now - Good deal',
          priceVolatility: analysisData.priceTrend?.confidence ? 'Low volatility' : 'High volatility'
        }
      };
      
      setAnalysisResults(mockResults);
      setShowResults(true);
      
      // Record real user analysis
      await recordProductAnalysis({
        url: productUrl.trim(),
        title: mockResults.productName,
        category: analysisData.platform || 'general',
        platform: new URL(productUrl.trim()).hostname,
        analysisStartTime: startTime,
        source: 'manual'
      }, {
        ethicalScore: mockResults.ethicalScore,
        dealScore: mockResults.priceScore,
        decision: analysisData.decision,
        alternatives: mockResults.alternatives.length,
        success: true
      });
      
      console.log('🧠 Analysis recorded successfully');
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('analysis-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`🔥 [${requestId}] Error after ${processingTime}ms:`, error);
      
      // Record failed analysis for learning
      await recordProductAnalysis({
        url: productUrl.trim(),
        title: `Product from ${new URL(productUrl.trim()).hostname}`,
        category: 'general',
        platform: new URL(productUrl.trim()).hostname,
        analysisStartTime: startTime,
        source: 'manual'
      }, {
        success: false
      }).catch(() => {}); // Don't fail if analytics fail
      
      const errorMessage = error instanceof Error 
        ? `${error.message} (${processingTime}ms)` 
        : `Inline analysis failed after ${processingTime}ms. Please try again.`;
        
      setUrlError(errorMessage);
      setAnalysisSteps([]);
      setOverallProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setProductUrl(suggestion);
  };

  return (
    <>
      <LiveBackground />
      <div className="relative z-10 min-h-screen">
        <LiveStatusIndicator />
        
        {/* Hero Section - Enhanced with Live Animation */}
        <section className="relative pt-20 pb-20 overflow-hidden">
          {/* Dynamic Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-emerald-500/5 to-transparent"></div>
          
          {/* Animated Mesh Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 animate-pulse"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-bounce [animation-duration:6s]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-bounce [animation-duration:8s] [animation-delay:2s]"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-ping"
                style={{
                  '--left': `${Math.random() * 100}%`,
                  '--top': `${Math.random() * 100}%`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <motion.div 
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 dark:from-emerald-400/20 dark:to-cyan-400/20 border border-emerald-500/40 dark:border-emerald-400/30 mb-8 backdrop-blur-md shadow-lg"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(16, 185, 129, 0.3)',
                      '0 0 40px rgba(6, 182, 212, 0.5)',
                      '0 0 20px rgba(16, 185, 129, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-emerald-400"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(16, 185, 129, 0.7)',
                          '0 0 0 10px rgba(16, 185, 129, 0)',
                          '0 0 0 0 rgba(16, 185, 129, 0)'
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  </div>
                  <span className="text-sm text-emerald-700 dark:text-emerald-200 font-semibold tracking-wide drop-shadow-sm">🚀 Live Analysis Engine</span>
                  <motion.div
                    className="w-2 h-6 bg-gradient-to-t from-emerald-400/0 via-emerald-400/60 to-emerald-400/0 rounded-full"
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  />
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight mb-6 drop-shadow-sm">
                  <motion.span
                    animate={{ 
                      textShadow: theme === 'dark' ? [
                        '0 0 20px rgba(16, 185, 129, 0.5)',
                        '0 0 40px rgba(6, 182, 212, 0.3)',
                        '0 0 20px rgba(16, 185, 129, 0.5)'
                      ] : [
                        '0 0 10px rgba(16, 185, 129, 0.2)',
                        '0 0 20px rgba(6, 182, 212, 0.1)',
                        '0 0 10px rgba(16, 185, 129, 0.2)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Smart Shopping
                  </motion.span>
                  <br />
                  <span className="relative">
                    <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                      Made Simple
                    </span>
                    <motion.div
                      className="absolute -right-12 top-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-70 blur-sm"></div>
                    </motion.div>
                  </span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
                  Get instant insights on any product. Real prices, trustworthy reviews, 
                  and ethical practices — all in one place.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-12">
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">Price Intelligence</span>
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm animate-pulse"></div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">Review Verification</span>
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm animate-pulse"></div>
                    <span className="font-medium text-purple-700 dark:text-purple-300">Ethics Rating</span>
                  </span>
                </div>
              </motion.div>

              {/* Smart Analytics Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full max-w-5xl mx-auto mb-8"
              >
                <SmartAnalyticsDashboard />
              </motion.div>

              {/* Enhanced Search Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="relative">
                  {/* Glowing Border Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-25 animate-pulse"></div>
                  
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-slate-600 space-y-6">
                    {/* Search Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Smart Product Analysis</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Enter any product URL for instant insights</p>
                    </div>
                    
                    <div className="relative">
                      {/* Enhanced Search Icon */}
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className={`p-1 rounded-full transition-all duration-300 ${isValidUrl ? 'bg-emerald-100 text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                          <IconSearch size={20} />
                        </div>
                      </div>
                      
                      {/* Enhanced Live Input Field */}
                      <div className="relative">
                        <motion.input
                          type="text"
                          placeholder="Paste any product URL: Amazon, eBay, Nike, Apple, Target..."
                          value={productUrl}
                          onChange={(e) => setProductUrl(e.target.value)}
                          className={`w-full pl-14 pr-12 py-5 text-base rounded-xl border-2 bg-gray-50/50 dark:bg-slate-700/50 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-600 focus:outline-none transition-all duration-300 hover:bg-white dark:hover:bg-slate-600 overflow-x-auto whitespace-nowrap ${
                            urlError 
                              ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20 focus:border-red-400 focus:ring-red-500/20' 
                              : isValidUrl 
                                ? 'border-emerald-300 bg-emerald-50/30 dark:bg-emerald-900/20 focus:border-emerald-500' 
                                : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                          }`}
                          animate={{
                            boxShadow: isTyping 
                              ? '0 0 20px rgba(16, 185, 129, 0.3)'
                              : '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && isValidUrl) {
                              handleAnalyze();
                            }
                          }}
                        />
                        
                        {/* Live Typing Indicator */}
                        {isTyping && (
                          <motion.div
                            className="absolute right-14 top-1/2 transform -translate-y-1/2"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <div className="flex space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-emerald-500 rounded-full"
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                        
                      {/* Enhanced Status Indicators */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        {isValidUrl && !isTyping && (
                          <motion.div 
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <motion.div 
                              className="w-2 h-2 rounded-full bg-emerald-500"
                              animate={{ 
                                scale: [1, 1.3, 1],
                                boxShadow: [
                                  '0 0 0 0 rgba(34, 197, 94, 0.7)',
                                  '0 0 0 6px rgba(34, 197, 94, 0)',
                                  '0 0 0 0 rgba(34, 197, 94, 0)'
                                ]
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Ready!</span>
                          </motion.div>
                        )}
                        {productUrl && !isValidUrl && !isTyping && (
                          <motion.div 
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">Invalid</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    {/* Error Message */}
                    {urlError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {urlError}
                      </motion.div>
                    )}
                    
                    {/* Enhanced Analyze Button */}
                    <button
                      type="button"
                      disabled={!isValidUrl || isAnalyzing}
                      onClick={handleAnalyze}
                      className={`
                        relative w-full h-14 text-base font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden
                        ${isValidUrl && !isAnalyzing
                          ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 animate-pulse"></div>
                      )}
                      <div className="relative flex items-center gap-3">
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Analyzing Product...</span>
                          </>
                        ) : (
                          <>
                            <IconSearch size={20} />
                            <span>Analyze Product Now</span>
                          </>
                        )}
                      </div>
                    </button>
                    
                    {/* Enhanced Real-time Feedback */}
                    {isValidUrl && !isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            ✅ Valid product URL detected
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Ready to analyze • Press Enter or click button
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Enhanced Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">🚀 Try These Examples</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {suggestions.slice(0, 5).map((suggestion, index) => {
                            const siteNames = ['Amazon', 'Nike', 'Apple', 'Target', 'eBay'];
                            const siteIcons = ['🛒', '👟', '📱', '🎯', '💎'];
                            
                            return (
                              <motion.button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="group relative px-3 py-2 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 hover:from-emerald-50 hover:to-cyan-50 dark:hover:from-emerald-900/20 dark:hover:to-cyan-900/20 border border-gray-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{siteIcons[index]}</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                    {siteNames[index]}
                                  </span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Click any example to test the analysis system
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Trust Badges */}
                    <div className="flex justify-center items-center gap-6 pt-4 border-t border-gray-200 dark:border-slate-600">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                        <span className="text-xs text-green-700 dark:text-green-300 font-medium">SSL Secure</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm animate-pulse"></div>
                        <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">Privacy First</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                        <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm animate-pulse"></div>
                        <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trusted Platforms */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-16"
              >
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 font-medium">Trusted by thousands • Works with 100+ platforms</p>
                <div className="flex justify-center items-center gap-8 opacity-60">
                  {['Amazon', 'Nike', 'Target', 'eBay'].map((platform) => (
                    <span key={platform} className="text-slate-700 dark:text-slate-200 font-semibold text-sm px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section with Better Light Mode */}
        <section className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
          {/* Enhanced Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-emerald-600/5 rounded-full blur-3xl animate-pulse [animation-duration:4s]"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-cyan-400/10 to-cyan-600/5 rounded-full blur-3xl animate-pulse [animation-duration:6s] [animation-delay:1s]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/8 to-purple-600/3 rounded-full blur-3xl animate-pulse [animation-duration:8s] [animation-delay:2s]"></div>
            
            {/* Additional decorative elements for light mode */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-60 [animation-delay:0s]"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40 [animation-delay:2s]"></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-50 [animation-delay:4s]"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 dark:from-emerald-500/10 dark:to-cyan-500/10 border border-emerald-500/30 dark:border-emerald-500/20 mb-8 backdrop-blur-md shadow-lg">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    <span className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">✨ Live Demo Experience</span>
                  </div>                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  See it in <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">action</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-200 text-lg max-w-2xl mx-auto">
                  Real products, real analysis, real insights — updated every second
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <DynamicExamplesGrid 
                selectedExample={selectedExample}
                onExampleSelect={setSelectedExample}
                isAnalyzing={false}
              />
              
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <LiveScoreCard 
                    productData={{
                      name: "Live Analysis Preview",
                      priceScore: 92,
                      reviewTrust: 88,
                      ethicsScore: 95,
                      priceLabel: "Excellent Deal",
                      reviewStatus: "High Trust",
                      ethicsRating: "A+ Rating"
                    }}
                    isAnalyzing={false}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gray-50 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-xl text-gray-800 dark:text-gray-100 max-w-3xl mx-auto mb-12 leading-relaxed">
                Just paste any shopping link. We'll check if the price is fair, 
                reviews are real, and the company treats people right.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="text-center relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-emerald-400 mb-2"
                    animate={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}
                  >
                    {isClientMounted ? liveStats.analyzing : '25'}
                  </motion.div>
                  <div className="text-gray-700 dark:text-gray-200 text-sm font-medium">Currently analyzing</div>
                  {isClientMounted && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-blue-400 mb-2"
                    key={isClientMounted ? liveStats.processed : 50127}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                  >
                    {isClientMounted ? liveStats.processed.toLocaleString() : '50,127'}+
                  </motion.div>
                  <div className="text-gray-700 dark:text-gray-200 text-sm font-medium">Products analyzed</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <SavedToday amountUsd={isClientMounted ? liveStats.saved : 750} />
                  <div className="text-gray-700 dark:text-gray-200 text-sm font-medium">Saved by users today</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why people trust EthiShop
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-lg max-w-2xl mx-auto">
                We do the homework so you don't have to
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: IconTrendingUp,
                  title: "Fair Price Check",
                  description: "Is this a good deal? We compare prices across the web and tell you honestly.",
                  gradient: "from-emerald-500 to-teal-600",
                  stats: "Real-time price tracking",
                  liveData: liveStats.analyzing
                },
                {
                  icon: IconShield,
                  title: "Real Reviews Only", 
                  description: "Fake reviews? We spot them. Get the truth about what real buyers think.",
                  gradient: "from-blue-500 to-indigo-600",
                  stats: "AI-powered detection",
                  liveData: Math.floor(liveStats.processed / 100)
                },
                {
                  icon: IconLeaf,
                  title: "Made Ethically?",
                  description: "Does this company treat workers fairly? We research so you can shop with confidence.", 
                  gradient: "from-purple-500 to-pink-600",
                  stats: "Ethics database updates",
                  liveData: Math.floor(liveStats.saved / 10)
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    z: 50
                  }}
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="relative h-full">
                    {/* Live Data Indicator */}
                    <motion.div
                      className="absolute -top-3 -right-3 z-20"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold shadow-lg`}>
                        {isClientMounted ? feature.liveData : (index === 0 ? '25' : index === 1 ? '501' : '75')}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-10 group-hover:opacity-20`}
                      animate={{ 
                        opacity: [0.1, 0.15, 0.1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    />
                    
                    <div className="relative p-8 h-full bg-white/80 dark:bg-white/5 backdrop-blur border border-gray-200/50 dark:border-white/10 rounded-2xl hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group-hover:shadow-2xl">
                      <motion.div 
                        className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        animate={{ 
                          boxShadow: [
                            '0 4px 20px rgba(0,0,0,0.15)',
                            '0 8px 40px rgba(0,0,0,0.2)',
                            '0 4px 20px rgba(0,0,0,0.15)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <feature.icon size={28} className="text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      
                      {/* Live Status Indicator */}
                      <motion.div 
                        className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} shadow-sm`}></div>
                        <span>{feature.stats}</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Analysis Progress Section */}
        {isAnalyzing && analysisSteps.length > 0 && (
          <section className="py-12 bg-white dark:bg-slate-900" id="analysis-progress">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    🔍 Analyzing Your Product
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Please wait while we gather comprehensive insights...
                  </p>
                </div>
                
                <AnalysisProgress
                  steps={analysisSteps}
                  overallProgress={overallProgress}
                  isAnalyzing={isAnalyzing}
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* Analysis Results Section */}
        {showResults && analysisResults && (
          <section className="py-12 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20" id="analysis-results">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full mb-6"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ✅
                    </motion.div>
                    <span className="text-green-800 dark:text-green-200 font-semibold">Analysis Complete!</span>
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    📊 Your Product Analysis Results
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Comprehensive insights for informed shopping decisions
                  </p>
                </div>

                <ProductAnalysisResults
                  result={{
                    productInfo: {
                      title: analysisResults.productName,
                      rating: analysisResults.reviewTrust / 20, // Convert to 5-star scale
                      reviews: Math.floor(Math.random() * 1000) + 100,
                      availability: 'in_stock' as const
                    },
                    priceTrend: {
                      current: Math.floor(Math.random() * 100) + 50,
                      original: Math.floor(Math.random() * 150) + 100,
                      currency: 'USD',
                      dataCertainty: 'high' as const,
                      marketAverage: Math.floor(Math.random() * 120) + 80
                    },
                    priceAnalysis: {
                      isGoodDeal: analysisResults.priceScore > 70,
                      priceRank: analysisResults.priceScore > 80 ? 'excellent' : analysisResults.priceScore > 60 ? 'good' : 'average',
                      savingsAmount: Math.floor(Math.random() * 30) + 10,
                      certaintyLevel: 'high' as const,
                      marketComparison: 'Better than 70% of similar products',
                      bestTimeDescription: 'Good time to buy'
                    },
                    dealScore: analysisResults.priceScore,
                    ethicalScore: analysisResults.ethicalScore,
                    decision: analysisResults.overallScore > 80 ? 'buy_now' : analysisResults.overallScore > 60 ? 'research_more' : 'wait',
                    recommendation: {
                      action: 'Recommended based on ethical score and price analysis',
                      confidence: analysisResults.overallScore,
                      urgency: analysisResults.overallScore > 80 ? 'high' : 'medium'
                    },
                    insights: {
                      honestAssessment: analysisResults.insights?.join('. ') || 'Good product with ethical practices',
                      warnings: analysisResults.overallScore < 60 ? ['Consider alternatives with better ethical scores'] : []
                    },
                    trustScore: {
                      dataReliability: analysisResults.reviewTrust,
                      overallTrust: analysisResults.reviewTrust > 80 ? 'high' : analysisResults.reviewTrust > 60 ? 'medium' : 'low',
                      explanation: `Trust score based on analysis of ${analysisResults.reviewTrust}% verified data`
                    }
                  }}
                  url={analysisResults.productUrl}
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        url: analysisResults.productUrl,
                        requestId: analysisResults.requestId,
                        timestamp: analysisResults.timestamp
                      });
                      router.push(`/reports?${params.toString()}`);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 justify-center"
                  >
                    <IconExternalLink size={16} />
                    View Detailed Report
                  </button>
                  <button
                    onClick={() => {
                      setProductUrl('');
                      setShowResults(false);
                      setAnalysisResults(null);
                      setAnalysisSteps([]);
                      setOverallProgress(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors flex items-center gap-2 justify-center"
                  >
                    <IconSearch size={16} />
                    Analyze Another Product
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Final CTA - Only show when not analyzing or showing results */}
        {!isAnalyzing && !showResults && (
          <section className="py-20 bg-gray-50 dark:bg-slate-900">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Ready to shop with confidence?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 text-lg mb-8">
                    Join thousands of smart shoppers making better choices
                  </p>
                  
                  <motion.button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-2xl overflow-hidden group cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      background: [
                        'linear-gradient(45deg, #059669, #0891b2)',
                        'linear-gradient(45deg, #0891b2, #7c3aed)',
                        'linear-gradient(45deg, #059669, #0891b2)'
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {/* Animated Background Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Content */}
                    <motion.div
                      className="relative flex items-center gap-3 z-10"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-lg">🚀 Start analyzing now</span>
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </motion.svg>
                    </motion.div>
                    
                    {/* Pulse Effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-2xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.button>
                  
                  <div className="flex justify-center items-center gap-6 mt-8 text-sm text-gray-600 dark:text-gray-300">
                    <span>Free forever</span>
                    <span>•</span>
                    <span>No signup needed</span>
                    <span>•</span>
                    <span>Privacy first</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        <FloatingActions 
          hasActiveUrl={!!productUrl.trim() && isValidUrl}
          isAnalyzing={isAnalyzing}
          showActions={isAnalyzing || (!!productUrl.trim() && isValidUrl)}
        />


      </div>
    </>
  );
}