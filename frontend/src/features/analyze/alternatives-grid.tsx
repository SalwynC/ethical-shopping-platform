"use client";

import NextLink from "next/link";
import { EmptyState } from "../../components/common/EmptyState";
import type { AlternativeProduct } from "../../types/api";
import { useUsdInrRate, formatDual } from "../../lib/currency";

interface AlternativesGridProps {
  alternatives?: AlternativeProduct[];
  isLoading?: boolean;
}

export function AlternativesGrid({ alternatives = [], isLoading }: AlternativesGridProps) {
  const fx = useUsdInrRate();
  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-600 dark:text-gray-400">Loading alternatives...</p>
      </div>
    );
  }

  if (!alternatives.length) {
    return (
      <EmptyState
        title="No Alternatives Found"
        description="We couldn't find any alternative products for this item."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alternatives.map((alternative, index) => (
        <div 
          key={`${alternative.title}-${index}`} 
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg text-gray-900 dark:text-white line-clamp-2">
                {alternative.title}
              </h3>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                {alternative.ethicalScore}% Ethical
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {alternative.rationale}
            </p>
            
            <div className="flex justify-between items-center">
              {typeof alternative.price === 'number' && (
                <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                  {(() => {
                    const base = 'USD';
                    if (fx) {
                      const dual = formatDual(alternative.price!, base, fx.rate);
                      return `${dual.inr} · ${dual.usd}`;
                    }
                    return `$${alternative.price.toFixed(2)}`;
                  })()}
                </span>
              )}
              
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
      ))}
    </div>
  );
}