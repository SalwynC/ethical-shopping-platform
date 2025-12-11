"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <div className="h-12 w-96 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto"></div>
            <div className="h-6 w-128 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="h-16 w-80 bg-gray-300 dark:bg-gray-700 rounded-xl mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}