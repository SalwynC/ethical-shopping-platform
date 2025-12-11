"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconAnalyze, IconBolt } from '@tabler/icons-react';

interface FloatingAnalysisButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export function FloatingAnalysisButton({ onClick, isVisible }: FloatingAnalysisButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        y: [0, -5, 0]
      }}
      exit={{ opacity: 0, scale: 0, rotate: 180 }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        duration: 0.5,
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
      className="fixed bottom-5 left-5 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <IconAnalyze size={24} />
        </motion.div>
        
        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-300"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? -10 : 0
          }}
          className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
        >
          <span className="font-medium">Quick Analysis Test</span>
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-y-4 border-y-transparent"></div>
        </motion.div>
      </div>
    </motion.button>
  );
}