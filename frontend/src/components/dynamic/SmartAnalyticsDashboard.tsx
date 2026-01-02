'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IconBrain,
  IconClock,
  IconTrendingUp,
  IconTarget,
} from '@tabler/icons-react';
import {
  getDailyAnalytics,
  getSessionInsights,
  getQuickTestCount,
  recordQuickTest,
} from '../../lib/real-analytics';

export function SmartAnalyticsDashboard() {
  const [dailyStats, setDailyStats] = useState({
    date: new Date().toDateString(),
    totalAnalyses: 0,
    uniqueProducts: 0,
    averageTimePerAnalysis: 0,
    successRate: 0,
    topCategories: [] as string[],
    isLearning: false,
  });

  const [sessionStats, setSessionStats] = useState({
    sessionDuration: 0,
    totalAnalyses: 0,
    averageTimeSpent: 0,
    successRate: 0,
    favoriteCategory: 'None',
    isLearningActive: false,
  });

  const [quickTests, setQuickTests] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    // Update analytics every few seconds (only on client)
    const updateStats = () => {
      try {
        const daily = getDailyAnalytics();
        const session = getSessionInsights();
        const quickCount = getQuickTestCount();

        setDailyStats(daily);
        setSessionStats(session);
        setQuickTests(quickCount);
      } catch (error) {
        console.warn('Failed to update analytics:', error);
      }
    };

    // Initial load
    updateStats();

    // Update every 10 seconds
    const interval = setInterval(updateStats, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickTest = () => {
    if (!isClient) return; // Only allow on client
    const newCount = recordQuickTest('price');
    setQuickTests(newCount);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Real Daily Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <IconBrain
                size={16}
                className="text-emerald-600 dark:text-emerald-400"
              />
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                Smart Analyses
              </h3>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {dailyStats.isLearning
                ? '🧠 Learning from your usage'
                : 'Ready to learn'}
            </p>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {dailyStats.totalAnalyses}
          </div>
        </div>
        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
          {dailyStats.uniqueProducts} unique products
        </div>
      </motion.div>

      {/* Session Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <IconClock
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Session Time
              </h3>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {sessionStats.isLearningActive
                ? '⚡ Active learning'
                : 'Monitoring usage'}
            </p>
          </div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatDuration(sessionStats.sessionDuration)}
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
          Avg: {formatDuration(sessionStats.averageTimeSpent)} per analysis
        </div>
      </motion.div>

      {/* Quick Tests (Interactive) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow-sm cursor-pointer"
        onClick={handleQuickTest}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <IconTarget
                size={16}
                className="text-purple-600 dark:text-purple-400"
              />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                Quick Tests
              </h3>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Click to test analysis
            </p>
          </div>
          <div
            className="text-2xl font-bold text-purple-600 dark:text-purple-400"
            id="quick-analysis-counter"
          >
            {quickTests}
          </div>
        </div>
        <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
          Today's test count
        </div>
      </motion.div>

      {/* Success Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <IconTrendingUp
                size={16}
                className="text-amber-600 dark:text-amber-400"
              />
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Success Rate
              </h3>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Analysis quality
            </p>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {dailyStats.successRate}%
          </div>
        </div>
        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          {sessionStats.favoriteCategory !== 'None'
            ? `Fav: ${sessionStats.favoriteCategory}`
            : 'No preference yet'}
        </div>
      </motion.div>
    </div>
  );
}
