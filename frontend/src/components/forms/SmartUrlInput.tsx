'use client';

import React, { useState } from 'react';
import { IconLink } from '@tabler/icons-react';

interface SmartUrlInputProps {
  onAnalyze: (url: string) => void;
  loading?: boolean;
}

export function SmartUrlInput({ onAnalyze, loading }: SmartUrlInputProps) {
  const [url, setUrl] = useState('');

  const handleAnalyze = () => {
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconLink className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-lg"
            placeholder="Paste any product URL (Amazon, Flipkart, etc.)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        </div>
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-lg"
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing...
            </div>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </div>
  );
}
