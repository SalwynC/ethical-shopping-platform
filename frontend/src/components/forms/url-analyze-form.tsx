"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SparklesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";

import type { AnalyzeResponse } from "@/types/api";

type UrlAnalyzeFormProps = {
  onSubmitStart?: () => void;
  onCompleted?: (analysis: AnalyzeResponse) => void;
  onError?: (error: Error | null) => void;
};

const validateUrl = (url: string) => {
  try {
    new URL(url);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
};

export function UrlAnalyzeForm({ 
  onSubmitStart, 
  onCompleted, 
  onError 
}: UrlAnalyzeFormProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [includeAlternatives, setIncludeAlternatives] = useState(true);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const { theme } = useTheme();

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const error = validateUrl(value);
    setUrlError(error || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlError || !url) return;

    setIsAnalyzing(true);
    onSubmitStart?.();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response for now
      const mockResponse: AnalyzeResponse = {
        decision: "buy_now",
        ethicalScore: 85,
        dealScore: 92,
        priceTrend: {
          current: 299.99,
          original: 399.99,
          predictedNextWeek: 320.00,
          confidence: 0.85,
          currency: "USD",
          discountPercent: 25
        },
        explanations: [
          {
            rule: "Price Drop Detection",
            contribution: 40,
            reason: "Price has dropped 25% from original listing"
          },
          {
            rule: "Ethical Brand Assessment",
            contribution: 45,
            reason: "Company has strong sustainability practices and fair labor policies"
          }
        ],
        alternatives: [
          {
            title: "Similar Product Alternative",
            url: "https://example.com/alt1",
            ethicalScore: 90,
            rationale: "Better ethical practices with similar features",
            price: 279.99,
            confidence: 0.8
          }
        ],
        sources: [
          {
            label: "Company Sustainability Report",
            href: "https://example.com/sustainability"
          }
        ],
        meta: {
          analyzedAt: new Date().toISOString(),
          latencyMs: 2000,
          version: "1.0.0"
        }
      };

      onCompleted?.(mockResponse);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      className="p-8 bg-white/95 dark:bg-slate-800/95 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
            Product URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste a product link from Amazon, Flipkart, etc."
              className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 shadow-md ${
                urlError
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500 focus:ring-red-500/30'
                  : url && !urlError
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500'
                  : 'border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-700/90'
              } text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 hover:border-slate-400 dark:hover:border-slate-500`}
            />
            
            {url && !urlError && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              </div>
            )}
          </div>
          
          {urlError && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{urlError}</p>
          )}
          
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We'll analyze the product's pricing, ethics, and find alternatives
          </p>
        </div>

        {/* Alternatives Toggle */}
        <div className="flex items-start space-x-3">
          <div className="flex items-center">
            <input
              id="include-alternatives"
              type="checkbox"
              checked={includeAlternatives}
              onChange={(e) => setIncludeAlternatives(e.target.checked)}
              className="w-5 h-5 text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-2 transition-all duration-200"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="include-alternatives" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Find ethical alternatives
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We'll suggest similar products from more ethical brands
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!url || !!urlError || isAnalyzing}
          className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
            !url || !!urlError || isAnalyzing
              ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-sm'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 hover:from-emerald-600 hover:to-cyan-600 dark:hover:from-emerald-500 dark:hover:to-cyan-500 text-white shadow-xl hover:shadow-2xl'
          }`}
          whileHover={!url || !!urlError || isAnalyzing ? {} : { scale: 1.02 }}
          whileTap={!url || !!urlError || isAnalyzing ? {} : { scale: 0.98 }}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Product...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>Analyze Product</span>
            </>
          )}
        </motion.button>

        {/* Description */}
        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
          Analysis includes price trends, ethical scoring, and alternative recommendations
        </p>
      </form>
    </motion.div>
  );
}

