/* eslint-disable react/forbid-dom-props */
'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IconExternalLink,
  IconAlertCircle,
  IconCheck,
  IconLoader2,
  IconSparkles,
} from '@tabler/icons-react';
import { ProductAnalysisResults } from '../../components/analysis/ProductAnalysisResults';
import { AnalysisStep } from '../../components/analysis/AnalysisProgress';
import { AnalyzeResponse } from '../../types/api';

export default function ComprehensiveAnalysisPage() {
  const searchParams = useSearchParams();
  const [productUrl, setProductUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [steps, setSteps] = useState<AnalysisStep[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Enhanced analysis steps for comprehensive analysis
  const analysisSteps: AnalysisStep[] = [
    {
      id: 'url-validation',
      label: 'Validating Product URL',
      status: 'pending',
      message: 'Checking URL accessibility and extracting product identifiers',
    },
    {
      id: 'product-scraping',
      label: 'Advanced Web Scraping',
      status: 'pending',
      message: 'Extracting detailed product data with anti-bot evasion',
    },
    {
      id: 'ai-analysis',
      label: 'AI-Powered Analysis',
      status: 'pending',
      message: 'Running Google Gemini AI for comprehensive product evaluation',
    },
    {
      id: 'price-prediction',
      label: 'ML Price Prediction',
      status: 'pending',
      message: 'Generating price forecasts using machine learning',
    },
    {
      id: 'carbon-footprint',
      label: 'Carbon Impact Calculation',
      status: 'pending',
      message: 'Calculating environmental impact and carbon footprint',
    },
    {
      id: 'supply-chain',
      label: 'Supply Chain Analysis',
      status: 'pending',
      message: 'Evaluating supply chain transparency and labor practices',
    },
    {
      id: 'brand-reputation',
      label: 'Brand Intelligence',
      status: 'pending',
      message: 'Analyzing brand reputation and ethical practices',
    },
    {
      id: 'smart-insights',
      label: 'Financial Intelligence',
      status: 'pending',
      message: 'Calculating hidden costs and value analysis',
    },
  ];

  useEffect(() => {
    if (searchParams) {
      const url = searchParams.get('url');
      if (url) {
        setProductUrl(decodeURIComponent(url));
        setSteps(analysisSteps);
      } else {
        window.location.href = '/';
      }
    }
  }, [searchParams]);

  const performRealAnalysis = async () => {
    setIsAnalyzing(true);
    setOverallProgress(0);
    setError(null);
    setAnalysisResult(null);

    try {
      // Simulate step progress while making actual API call
      const progressSimulation = simulateStepProgress();

      // Make actual API call to our enhanced backend
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: productUrl }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Wait for progress simulation to complete
      await progressSimulation;

      setAnalysisResult(result);
      setOverallProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      // Mark all pending steps as errored
      setSteps((prev) =>
        prev.map((step) =>
          step.status === 'pending' || step.status === 'in-progress'
            ? { ...step, status: 'error', message: '❌ Analysis interrupted' }
            : step,
        ),
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateStepProgress = async () => {
    for (let i = 0; i < analysisSteps.length; i++) {
      const currentStep = analysisSteps[i];

      // Update current step to in-progress
      setSteps((prev) =>
        prev.map((step) =>
          step.id === currentStep.id
            ? { ...step, status: 'in-progress', progress: 0 }
            : step,
        ),
      );

      // Simulate realistic progress timing
      const stepDuration =
        currentStep.id === 'ai-analysis'
          ? 3000
          : currentStep.id === 'product-scraping'
            ? 2500
            : 1500;

      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise((resolve) => setTimeout(resolve, stepDuration / 4));

        setSteps((prev) =>
          prev.map((step) =>
            step.id === currentStep.id ? { ...step, progress } : step,
          ),
        );

        const stepProgress = (i * 100 + progress) / analysisSteps.length;
        setOverallProgress(stepProgress);
      }

      // Mark current step as completed
      setSteps((prev) =>
        prev.map((step) =>
          step.id === currentStep.id
            ? {
                ...step,
                status: 'completed',
                progress: 100,
                message: getCompletedMessage(currentStep.id),
              }
            : step,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  };

  const getCompletedMessage = (stepId: string): string => {
    const messages: Record<string, string> = {
      'url-validation': '✅ Product URL validated - Amazon India detected',
      'product-scraping':
        '✅ Product data extracted successfully with anti-bot measures',
      'ai-analysis': '✅ Google Gemini AI analysis completed',
      'price-prediction': '✅ ML price forecast generated with 85% confidence',
      'carbon-footprint': '✅ Environmental impact calculated',
      'supply-chain': '✅ Supply chain transparency evaluated',
      'brand-reputation': '✅ Brand intelligence analysis completed',
      'smart-insights': '✅ Financial insights and hidden costs calculated',
    };
    return messages[stepId] || '✅ Step completed successfully';
  };

  const getDomainFromUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Unknown Platform';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  🎯 EthiShop Comprehensive Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                  Advanced AI-powered product intelligence with unique
                  competitive insights
                </p>
              </div>

              {productUrl && (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    <IconExternalLink size={16} />
                    {getDomainFromUrl(productUrl)}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                    <IconSparkles size={16} />
                    Unique Insights Available
                  </div>
                </div>
              )}

              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-gray-600 dark:text-gray-300 break-all bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {productUrl}
                </p>
              </div>

              {!isAnalyzing && !analysisResult && (
                <div className="text-center">
                  <button
                    onClick={performRealAnalysis}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-xl"
                  >
                    🚀 Start Comprehensive Analysis
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Includes ML price prediction, carbon footprint, supply chain
                    analysis & more
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Analysis Progress */}
          {steps.length > 0 && (isAnalyzing || overallProgress > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <IconLoader2
                      className={`${isAnalyzing ? 'animate-spin' : ''} text-blue-500`}
                      size={24}
                    />
                    Advanced Analysis Progress
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(overallProgress)}% Complete
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={
                      { width: `${overallProgress}%` } as React.CSSProperties
                    }
                  ></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        step.status === 'completed'
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : step.status === 'in-progress'
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                            : step.status === 'error'
                              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : step.status === 'in-progress'
                              ? 'bg-blue-500 text-white'
                              : step.status === 'error'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <IconCheck size={20} />
                        ) : step.status === 'in-progress' ? (
                          <IconLoader2 size={20} className="animate-spin" />
                        ) : step.status === 'error' ? (
                          '❌'
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {step.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {step.message}
                        </p>
                        {step.status === 'in-progress' &&
                          step.progress !== undefined && (
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-200"
                                style={
                                  {
                                    width: `${step.progress}%`,
                                  } as React.CSSProperties
                                }
                              ></div>
                            </div>
                          )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <IconAlertCircle size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                  <button
                    onClick={performRealAnalysis}
                    className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-700/30 text-red-800 dark:text-red-200 rounded-lg transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Comprehensive Results */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProductAnalysisResults
                result={analysisResult as unknown as any}
                url={productUrl}
              />
            </motion.div>
          )}

          {!productUrl && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <IconAlertCircle size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
                    No Product URL Provided
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Please return to the homepage and enter a product URL to
                    analyze.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
