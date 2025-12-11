'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlternativeProduct } from '@/types/api';

interface ProductAlternativesProps {
  alternatives?: AlternativeProduct[];
  isLoading?: boolean;
}

export const ProductAlternatives: React.FC<ProductAlternativesProps> = ({
  alternatives = [],
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Finding Alternatives...</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Searching for better options...
          </p>
        </div>
      </div>
    );
  }

  if (!alternatives || alternatives.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-4 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Alternatives Found</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We couldn't find any alternative products at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Alternative Products</h3>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {alternatives.length} found
          </span>
        </div>

        <div className="space-y-4">
          {alternatives.map((alternative, index) => (
            <motion.div
              key={`${alternative.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <a 
                        href={alternative.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        {alternative.title}
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {alternative.rationale}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ${alternative.price?.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {alternative.confidence && (
                        <span 
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            alternative.confidence >= 0.8 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                              : alternative.confidence >= 0.6 
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}
                        >
                          Confidence: {Math.round(alternative.confidence * 100)}%
                        </span>
                      )}
                      
                      {alternative.ethicalScore && (
                        <span 
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            alternative.ethicalScore >= 80 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                              : alternative.ethicalScore >= 60 
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}
                        >
                          Ethics: {alternative.ethicalScore}%
                        </span>
                      )}
                    </div>

                    <a 
                      href={alternative.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded text-sm font-medium transition-colors"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {alternatives.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {alternatives.length} ethical alternative{alternatives.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAlternatives;
