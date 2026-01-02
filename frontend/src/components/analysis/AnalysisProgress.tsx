'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface AnalysisStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

interface AnalysisProgressProps {
  steps: AnalysisStep[];
  currentStep?: string;
  overallProgress?: number;
  isAnalyzing?: boolean;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  steps = [],
  currentStep,
  overallProgress = 0,
  isAnalyzing = false,
}) => {
  const getStepColor = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed':
        return {
          text: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-100 dark:bg-green-900/30',
          border: 'border-green-200 dark:border-green-800',
        };
      case 'in-progress':
        return {
          text: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-800',
        };
      case 'error':
        return {
          text: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-200 dark:border-red-800',
        };
      default:
        return {
          text: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          border: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  const getStepIcon = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '◐';
      case 'error':
        return '✗';
      default:
        return '○';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Analysis Progress
          </h3>
          {isAnalyzing && (
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          )}
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 bg-blue-500 rounded-full transition-all duration-300 ${isAnalyzing ? 'animate-pulse' : ''}`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Step Details */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const colors = getStepColor(step.status);
            const isActive =
              currentStep != null
                ? step.id === currentStep
                : step.status === 'in-progress';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    step.status === 'in-progress'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'
                  } ${isActive ? 'shadow-md' : 'shadow-sm'}`}
                  style={{
                    boxShadow: isActive
                      ? '0 0 0 1px rgba(59,130,246,0.25), 0 10px 30px rgba(15,23,42,0.25)'
                      : undefined,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <span className={`text-lg ${colors.text} leading-none`}>
                        {getStepIcon(step.status)}
                      </span>

                      <div className="space-y-2 flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {step.label}
                        </div>

                        {step.message && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {step.message}
                          </div>
                        )}

                        {step.status === 'in-progress' &&
                          step.progress !== undefined && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                              <div
                                className="h-1 bg-blue-500 rounded-full transition-all duration-300 animate-pulse"
                                style={{ width: `${step.progress}%` }}
                              />
                            </div>
                          )}
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      {step.status === 'in-progress'
                        ? `${step.progress || 0}%`
                        : step.status.charAt(0).toUpperCase() +
                          step.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Status Summary */}
        {steps.length > 0 && (
          <div className="flex justify-center gap-6">
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ {steps.filter((s) => s.status === 'completed').length} Completed
            </span>

            {steps.filter((s) => s.status === 'in-progress').length > 0 && (
              <span className="text-sm text-blue-600 dark:text-blue-400">
                ◐ {steps.filter((s) => s.status === 'in-progress').length} In
                Progress
              </span>
            )}

            {steps.filter((s) => s.status === 'error').length > 0 && (
              <span className="text-sm text-red-600 dark:text-red-400">
                ✗ {steps.filter((s) => s.status === 'error').length} Errors
              </span>
            )}
          </div>
        )}

        {/* Subtle animated status text */}
        {isAnalyzing && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Analyzing product data...
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalysisProgress;
