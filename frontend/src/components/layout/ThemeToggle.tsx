'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <div className="relative group">
      <motion.button
        onClick={toggleTheme}
        className="relative w-14 h-7 rounded-full overflow-hidden shadow-lg transition-all duration-500 ease-in-out border-2 border-white/20 dark:border-slate-600/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          background:
            theme === 'light'
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
              : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background:
              theme === 'light'
                ? [
                    'radial-gradient(circle at 30% 50%, rgba(251, 191, 36, 0.8), transparent 50%)',
                    'radial-gradient(circle at 70% 50%, rgba(251, 191, 36, 0.6), transparent 50%)',
                    'radial-gradient(circle at 30% 50%, rgba(251, 191, 36, 0.8), transparent 50%)',
                  ]
                : [
                    'radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.5), transparent 50%)',
                    'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.3), transparent 50%)',
                    'radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.5), transparent 50%)',
                  ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Dial indicator with enhanced animation */}
        <motion.div
          className="absolute top-0.5 w-6 h-6 rounded-full shadow-xl border-2 border-white/30 backdrop-blur-sm"
          style={{
            background:
              theme === 'light'
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(135deg, #4338ca, #5b21b6)',
          }}
          animate={{
            x: theme === 'light' ? 2 : 30,
            rotate: theme === 'light' ? 0 : 180,
            boxShadow:
              theme === 'light'
                ? '0 4px 15px rgba(251, 191, 36, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3)'
                : '0 4px 15px rgba(99, 102, 241, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.2)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            duration: 0.6,
          }}
        >
          {/* Dial center with icon */}
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-full">
            {/* Inner glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background:
                  theme === 'light'
                    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 60%)'
                    : 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 60%)',
              }}
            />

            {/* Icon with smooth transition */}
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -180, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 180, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'backOut' }}
                  className="relative z-10"
                >
                  <IconSun size={14} className="text-white drop-shadow-sm" />
                  {/* Sun rays animation */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <div className="w-5 h-5 relative">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-0.5 h-1 bg-yellow-200/60 rounded-full"
                          style={{
                            transform: `rotate(${i * 45}deg)`,
                            transformOrigin: 'center 10px',
                          }}
                          animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 180, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -180, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'backOut' }}
                  className="relative z-10"
                >
                  <IconMoon size={14} className="text-white drop-shadow-sm" />
                  {/* Moon glow animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(147, 197, 253, 0.3)',
                        '0 0 20px rgba(147, 197, 253, 0.5)',
                        '0 0 10px rgba(147, 197, 253, 0.3)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced track icons with better positioning */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <motion.div
            className="flex items-center justify-center w-4 h-4"
            animate={{
              opacity: theme === 'light' ? 0.3 : 0.8,
              scale: theme === 'light' ? 0.8 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <IconSun size={12} className="text-yellow-200/80" />
          </motion.div>
          <motion.div
            className="flex items-center justify-center w-4 h-4"
            animate={{
              opacity: theme === 'dark' ? 0.3 : 0.8,
              scale: theme === 'dark' ? 0.8 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <IconMoon size={12} className="text-purple-200/80" />
          </motion.div>
        </div>

        {/* Subtle shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            background: [
              'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
              'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, transparent 40%)',
              'linear-gradient(45deg, transparent 60%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.button>

      {/* Enhanced tooltip */}
      <motion.div
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20"
        initial={{ y: 5, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} mode
        {/* Tooltip arrow */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 border-l border-t border-slate-700 rotate-45"></div>
      </motion.div>
    </div>
  );
}
