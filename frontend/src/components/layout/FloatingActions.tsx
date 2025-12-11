"use client";

import { useState, useEffect } from 'react';
import {
  IconArrowUp,
  IconBolt,
  IconSearch,
  IconSparkles,
  IconX
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionsProps {
  showActions?: boolean;
  hasActiveUrl?: boolean;
  isAnalyzing?: boolean;
}

export function FloatingActions({ showActions = false, hasActiveUrl = false, isAnalyzing = false }: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 200); // Show when scrolled down 200px
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to Top Arrow Button - Compact and Clean */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <div
              className="relative group"
              onMouseEnter={() => setShowTooltip('Top')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {/* Compact Tooltip */}
              {showTooltip === 'Top' && (
                <motion.div 
                  initial={{ opacity: 0, x: 5, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-md whitespace-nowrap shadow-lg z-10"
                >
                  Top
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-slate-800 dark:border-l-slate-700"></div>
                </motion.div>
              )}
              
              <motion.button
                className="relative w-10 h-10 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-full shadow-lg cursor-pointer border border-slate-600/30 dark:border-slate-500/30 backdrop-blur-sm flex items-center justify-center group transition-all duration-200"
                onClick={scrollToTop}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                
                {/* Compact Arrow with Animation */}
                <motion.div
                  animate={{ 
                    y: [0, -1, 0],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <IconArrowUp 
                    size={16} 
                    className="text-white/90 group-hover:text-white transition-colors duration-200" 
                    strokeWidth={2}
                  />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}