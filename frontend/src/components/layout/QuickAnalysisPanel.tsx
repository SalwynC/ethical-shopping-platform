"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconAnalyze,
  IconX,
  IconLeaf,
  IconShoppingCart,
  IconBolt
} from '@tabler/icons-react';

// Quick test products for analysis
const QUICK_TEST_PRODUCTS = [
  {
    title: "Organic Cotton T-Shirt",
    url: "https://example.com/organic-cotton-tshirt",
    category: "clothing",
    expectedScore: 85,
    icon: "👕"
  },
  {
    title: "iPhone 15 Pro",
    url: "https://apple.com/iphone-15-pro",
    category: "electronics",
    expectedScore: 65,
    icon: "📱"
  },
  {
    title: "Fair Trade Coffee",
    url: "https://example.com/fair-trade-coffee",
    category: "food",
    expectedScore: 92,
    icon: "☕"
  },
  {
    title: "Fast Fashion Sneakers",
    url: "https://example.com/fast-fashion-sneakers",
    category: "footwear",
    expectedScore: 35,
    icon: "👟"
  }
];

interface QuickAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAnalysisPanel({ isOpen, onClose }: QuickAnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  // Track a quick analysis
  const trackQuickAnalysis = async (product: typeof QUICK_TEST_PRODUCTS[0]) => {
    setIsAnalyzing(true);
    setLastResult(null);

    try {
      const analysisPayload = {
        action: 'track_analysis',
        productData: {
          url: product.url,
          title: product.title,
          category: product.category,
          source: 'manual' as const
        },
        analysisResults: {
          ethicalScore: product.expectedScore,
          environmentalImpact: product.expectedScore > 80 ? 'Low Impact' : 
                              product.expectedScore > 60 ? 'Moderate Impact' : 'High Impact',
          laborPractices: product.expectedScore > 75 ? 'Ethical' : 
                         product.expectedScore > 50 ? 'Questionable' : 'Concerning',
          alternatives: Math.floor(Math.random() * 5) + 1
        }
      };

      const response = await fetch('/api/track-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': `quick_${Date.now()}`
        },
        body: JSON.stringify(analysisPayload)
      });

      if (response.ok) {
        const result = await response.json();
        setLastResult(`✅ ${product.icon} Analyzed: ${product.title} (Score: ${product.expectedScore}/100)`);
        
        // Update the quick analysis counter in the LiveStatusIndicator
        const counterElement = document.getElementById('quick-analysis-counter');
        if (counterElement) {
          const currentCount = parseInt(counterElement.textContent || '0');
          counterElement.textContent = (currentCount + 1).toString();
          
          // Add a visual flash effect
          counterElement.style.transform = 'scale(1.2)';
          counterElement.style.color = '#8b5cf6';
          setTimeout(() => {
            counterElement.style.transform = 'scale(1)';
            counterElement.style.color = '';
          }, 300);
        }
      } else {
        setLastResult(`❌ Failed to analyze: ${product.title}`);
      }
    } catch (error) {
      console.error('Quick analysis failed:', error);
      setLastResult(`❌ Error during analysis`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-5 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <IconAnalyze size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Quick Analysis Test
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <IconX size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Quick Test Products */}
          <div className="space-y-2 mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Click to test real analysis tracking:
            </p>
            
            {QUICK_TEST_PRODUCTS.map((product, index) => (
              <button
                key={index}
                onClick={() => trackQuickAnalysis(product)}
                disabled={isAnalyzing}
                className="w-full p-3 text-left bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{product.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.expectedScore > 80 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : product.expectedScore > 60 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {product.expectedScore}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Status */}
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
            >
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {lastResult}
              </p>
            </motion.div>
          )}

          {isAnalyzing && (
            <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <IconBolt size={16} className="text-blue-600" />
              </motion.div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Analyzing product...
              </span>
            </div>
          )}

          {/* Note */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Watch the analytics update in real-time! Check the "Analyses Today" counter.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}