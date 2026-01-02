/* eslint-disable react/forbid-dom-props */
'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IconSearch,
  IconLoader2,
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
  IconCode,
  IconDatabase,
  IconBrain,
  IconTrendingUp,
  IconLeaf,
  IconShield,
  IconServer,
} from '@tabler/icons-react';
import { formatCurrency } from '../../lib/currency';

interface APIResponse {
  status: 'idle' | 'loading' | 'success' | 'error';
  timestamp: string;
  endpoint: string;
  data?: any;
  error?: string;
  duration: number;
}

interface BackendStatus {
  connected: boolean;
  healthy: boolean;
  uptime?: number;
  message: string;
  responseTime?: number;
}

export default function IntegratedDashboardPage() {
  const [productUrl, setProductUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResponses, setApiResponses] = useState<APIResponse[]>([]);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    connected: false,
    healthy: false,
    message: 'Checking backend...',
  });

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const startTime = Date.now();
        const response = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          setBackendStatus({
            connected: true,
            healthy: true,
            uptime: data.uptime,
            message: '✅ Backend is healthy',
            responseTime,
          });
        } else {
          setBackendStatus({
            connected: false,
            healthy: false,
            message: `❌ Backend error: ${response.status}`,
          });
        }
      } catch (err) {
        setBackendStatus({
          connected: false,
          healthy: false,
          message: `❌ Backend unreachable: ${err instanceof Error ? err.message : 'Unknown error'}`,
        });
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const analyzeProduct = async () => {
    if (!productUrl.trim()) {
      alert('Please enter a product URL');
      return;
    }

    setIsAnalyzing(true);
    setApiResponses([]);

    try {
      // Call backend API through our frontend route
      const startTime = Date.now();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: productUrl }),
      });
      const duration = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Log the API response
      setApiResponses([
        {
          status: 'success',
          timestamp: new Date().toLocaleTimeString(),
          endpoint: '/api/analyze',
          data: data,
          duration: duration,
        },
      ]);
    } catch (error) {
      setApiResponses([
        {
          status: 'error',
          timestamp: new Date().toLocaleTimeString(),
          endpoint: '/api/analyze',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0,
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentResponse = apiResponses[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              🔬 Integrated Testing Dashboard
            </h1>
            <p className="text-xl text-gray-300">
              See Frontend & Backend Integration in Real-Time
            </p>
          </div>

          {/* Backend Status Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconServer
                  size={24}
                  className={
                    backendStatus.healthy ? 'text-green-500' : 'text-red-500'
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-gray-300">
                    Backend Status
                  </p>
                  <p className="text-lg font-bold text-white">
                    {backendStatus.message}
                  </p>
                  {backendStatus.responseTime && (
                    <p className="text-xs text-gray-400">
                      Response: {backendStatus.responseTime}ms
                    </p>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-4 h-4 rounded-full ${backendStatus.healthy ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </div>
          </motion.div>

          {/* Input Section */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Product URL
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeProduct()}
                placeholder="https://www.amazon.com/dp/..."
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={analyzeProduct}
                disabled={isAnalyzing}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <IconLoader2 className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <IconSearch size={20} />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: API Request Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 h-fit"
          >
            <div className="flex items-center gap-2 mb-4">
              <IconCode className="text-blue-400" size={24} />
              <h2 className="text-lg font-bold text-white">Frontend Request</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <p className="text-gray-400">Endpoint</p>
                <p className="text-blue-400 font-mono">POST /api/analyze</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <p className="text-gray-400">Payload</p>
                <pre className="text-green-400 font-mono text-xs overflow-auto max-h-32">
                  {JSON.stringify(
                    { url: productUrl || '(enter URL)' },
                    null,
                    2,
                  )}
                </pre>
              </div>
              <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <p className="text-gray-400">Status</p>
                <p
                  className={`font-semibold ${isAnalyzing ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                  {isAnalyzing ? '🔄 Pending...' : '⏳ Ready'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center: Processing Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-purple-900/50 to-slate-800/50 backdrop-blur border border-purple-700/30 rounded-xl p-6 flex flex-col justify-center"
          >
            <div className="space-y-4">
              <ProcessStep
                icon={<IconDatabase size={20} />}
                title="1. Web Scraping"
                desc="Extract product data"
                active={
                  currentResponse?.status === 'loading' ||
                  currentResponse?.status === 'success'
                }
              />
              <ProcessStep
                icon={<IconBrain size={20} />}
                title="2. AI Analysis"
                desc="Google Gemini processing"
                active={
                  currentResponse?.status === 'loading' ||
                  currentResponse?.status === 'success'
                }
              />
              <ProcessStep
                icon={<IconTrendingUp size={20} />}
                title="3. Price Prediction"
                desc="ML forecasting"
                active={
                  currentResponse?.status === 'loading' ||
                  currentResponse?.status === 'success'
                }
              />
              <ProcessStep
                icon={<IconLeaf size={20} />}
                title="4. Sustainability"
                desc="Carbon & ethics"
                active={
                  currentResponse?.status === 'loading' ||
                  currentResponse?.status === 'success'
                }
              />
            </div>
          </motion.div>

          {/* Right: API Response Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 h-fit"
          >
            <div className="flex items-center gap-2 mb-4">
              <IconDatabase className="text-green-400" size={24} />
              <h2 className="text-lg font-bold text-white">Backend Response</h2>
            </div>

            {!currentResponse ? (
              <div className="text-center py-8 text-gray-400">
                <p>No analysis yet</p>
                <p className="text-sm">Enter a URL and click Analyze</p>
              </div>
            ) : currentResponse.status === 'error' ? (
              <div className="bg-red-900/30 border border-red-700 rounded p-4">
                <div className="flex items-start gap-2">
                  <IconAlertCircle
                    className="text-red-400 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-red-300">Error</p>
                    <p className="text-sm text-red-200">
                      {currentResponse.error}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="bg-green-900/30 border border-green-700 rounded p-3">
                  <div className="flex items-center gap-2">
                    <IconCheck className="text-green-400" size={18} />
                    <p className="text-green-300">✅ Success</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                  <p className="text-gray-400 mb-2">Response Time</p>
                  <p className="text-cyan-400 font-mono">
                    {currentResponse.duration}ms
                  </p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded border border-slate-600 max-h-40 overflow-auto">
                  <p className="text-gray-400 mb-2">Data</p>
                  <pre className="text-amber-400 font-mono text-xs">
                    {JSON.stringify(currentResponse.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Detailed Response Section */}
        {currentResponse && currentResponse.status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <IconShield className="text-blue-400" size={28} />
              Complete Analysis Results
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-bold text-blue-300 mb-3">
                  📦 Product Information
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Title:</span>{' '}
                    {currentResponse.data?.productInfo?.title || 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Brand:</span>{' '}
                    {currentResponse.data?.productInfo?.brand || 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Platform:</span>{' '}
                    {currentResponse.data?.platform || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-bold text-green-300 mb-3">
                  💰 Pricing Analysis
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Current:</span>{' '}
                    <PriceNow
                      currency={currentResponse.data?.priceTrend?.currency}
                      amount={currentResponse.data?.priceTrend?.current}
                    />
                  </p>
                  <p>
                    <span className="text-gray-400">Deal Score:</span>{' '}
                    {currentResponse.data?.dealScore || 'N/A'}/100
                  </p>
                  <p>
                    <span className="text-gray-400">Recommendation:</span>{' '}
                    {currentResponse.data?.decision || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Ethics & Sustainability */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-bold text-green-300 mb-3">
                  🌍 Sustainability
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Ethical Score:</span>{' '}
                    {currentResponse.data?.ethicalScore || 'N/A'}/100
                  </p>
                  <p>
                    <span className="text-gray-400">Trust Level:</span>{' '}
                    {currentResponse.data?.trustScore?.overallTrust || 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Carbon Impact:</span>{' '}
                    {currentResponse.data?.sustainabilityMetrics
                      ?.carbonFootprint || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-bold text-purple-300 mb-3">
                  💡 Recommendations
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Action:</span>{' '}
                    {currentResponse.data?.recommendation?.action || 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-400">Confidence:</span>{' '}
                    {currentResponse.data?.recommendation?.confidence || 'N/A'}%
                  </p>
                  <p>
                    <span className="text-gray-400">Urgency:</span>{' '}
                    {currentResponse.data?.recommendation?.urgency || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Raw JSON */}
            <div className="mt-6 bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-bold text-cyan-300 mb-3">
                📋 Full JSON Response
              </h3>
              <pre className="bg-slate-900 p-4 rounded text-cyan-400 font-mono text-xs overflow-auto max-h-64">
                {JSON.stringify(currentResponse.data, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-gray-400 text-sm"
        >
          <p>
            🔗 This page shows real-time integration between Frontend & Backend
          </p>
          <p className="mt-2">
            Frontend runs on <strong>Next.js 14</strong> • Backend runs on{' '}
            <strong>NestJS</strong> • Deployed on <strong>Vercel</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function PriceNow({
  currency,
  amount,
}: {
  currency?: string;
  amount?: number;
}) {
  if (typeof amount !== 'number') return <span>N/A</span>;
  const base =
    currency?.toUpperCase() === 'USD' || currency === '$' ? 'USD' : 'INR';
  const inrAmount = base === 'USD' ? Math.round(amount * 84) : amount;
  return <span>{formatCurrency(inrAmount, 'INR')}</span>;
}

function ProcessStep({
  icon,
  title,
  desc,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${active ? 'bg-purple-700/40 border border-purple-500/50' : 'bg-slate-700/30 border border-slate-600/50'}`}
    >
      <div className={`mt-1 ${active ? 'text-purple-400' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <p
          className={`font-semibold text-sm ${active ? 'text-purple-200' : 'text-gray-300'}`}
        >
          {title}
        </p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </div>
  );
}
