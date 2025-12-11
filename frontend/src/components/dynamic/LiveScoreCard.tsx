'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconTrendingUp, IconShield, IconSearch } from '@tabler/icons-react';

interface LiveScoreCardProps {
  productData: {
    name: string;
    priceScore: number;
    reviewTrust: number;
    ethicsScore: number;
    priceLabel: string;
    reviewStatus: string;
    ethicsRating: string;
  } | null;
  isAnalyzing: boolean;
}

export function LiveScoreCard({ productData, isAnalyzing }: LiveScoreCardProps) {
  const [animatedValues, setAnimatedValues] = useState({ price: 0, trust: 0, ethics: 0 });

  useEffect(() => {
    if (productData && !isAnalyzing) {
      const timer = setTimeout(() => {
        setAnimatedValues({
          price: productData.priceScore,
          trust: productData.reviewTrust,
          ethics: productData.ethicsScore
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [productData, isAnalyzing]);

  return (
    <motion.div 
      className="relative p-8 rounded-3xl bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-slate-800/95 dark:via-slate-800/95 dark:to-slate-900/95 border-2 border-gray-200/60 dark:border-slate-600/60 shadow-xl dark:shadow-2xl min-h-80 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-t-3xl"></div>
      <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
      
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center min-h-72 space-y-6">
          <motion.div 
            className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl"
            animate={{ 
              rotateY: [0, 360],
              boxShadow: [
                "0 10px 30px rgba(16, 185, 129, 0.4)",
                "0 20px 60px rgba(6, 182, 212, 0.6)",
                "0 10px 30px rgba(16, 185, 129, 0.4)"
              ]
            }}
            transition={{ 
              rotateY: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <IconSearch size={32} className="text-white" />
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          
          <div className="text-center space-y-2">
            <motion.p 
              className="font-bold text-lg text-slate-800 dark:text-white"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🔍 Analyzing Product...
            </motion.p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Getting comprehensive insights</p>
          </div>
          
          {/* Loading Animation */}
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      ) : productData ? (
        <div className="space-y-8">
          {/* Header with Icon */}
          <div className="text-center space-y-4">
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 border border-emerald-200 dark:border-emerald-700 rounded-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Live Analysis</span>
            </motion.div>
            
            <h2 className="font-bold text-2xl text-center text-slate-800 dark:text-white leading-tight">
              {productData.name}
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Price Score - Enhanced */}
            <motion.div 
              className="space-y-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200/50 dark:border-emerald-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IconTrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Price Score</span>
                </div>
                <motion.span 
                  className="font-bold text-xl text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {productData.priceScore}/100
                </motion.span>
              </div>
              <div className="w-full bg-emerald-200/50 dark:bg-emerald-800/30 rounded-full h-3 shadow-inner">
                <motion.div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full shadow-sm relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedValues.price}%` }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{productData.priceLabel}</p>
            </motion.div>

            {/* Review Trust - Enhanced */}
            <motion.div 
              className="space-y-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IconShield size={18} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Review Trust</span>
                </div>
                <motion.span 
                  className="font-bold text-xl text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-100 dark:bg-blue-800/50 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {productData.reviewTrust}%
                </motion.span>
              </div>
              <div className="w-full bg-blue-200/50 dark:bg-blue-800/30 rounded-full h-3 shadow-inner">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedValues.trust}%` }}
                  transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">{productData.reviewStatus}</p>
            </motion.div>

            {/* Ethics Score - Enhanced */}
            <motion.div 
              className="space-y-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 dark:bg-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">Ethics Score</span>
                </div>
                <motion.span 
                  className="font-bold text-xl text-purple-600 dark:text-purple-400 px-3 py-1 bg-purple-100 dark:bg-purple-800/50 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {productData.ethicsScore}/100
                </motion.span>
              </div>
              <div className="w-full bg-purple-200/50 dark:bg-purple-800/30 rounded-full h-3 shadow-inner">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-sm relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedValues.ethics}%` }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">{productData.ethicsRating}</p>
            </motion.div>
          </div>
          
          {/* Bottom Status */}
          <motion.div
            className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200 dark:border-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Analysis Complete</span>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-72 space-y-6">
          <motion.div 
            className="relative w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-3xl flex items-center justify-center shadow-xl"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 10px 30px rgba(100, 116, 139, 0.3)",
                "0 20px 60px rgba(100, 116, 139, 0.4)",
                "0 10px 30px rgba(100, 116, 139, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <IconSearch size={32} className="text-white" />
          </motion.div>
          
          <div className="text-center space-y-3 max-w-xs">
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">
              Ready for Analysis
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste any product URL above to see comprehensive analysis with pricing, reviews, and ethics insights
            </p>
          </div>
          
          {/* Demo Indicators */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Price Check</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Review Trust</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Ethics Rating</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}