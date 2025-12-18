/* eslint-disable react/forbid-dom-props */
'use client';

import { motion } from 'framer-motion';

interface InteractiveExampleCardProps {
  product: {
    id: string;
    name: string;
    priceScore: number;
    reviewTrust: number;
    ethicsScore: number;
    priceLabel: string;
    reviewStatus: string;
    ethicsRating: string;
    color: string;
    url: string;
    insight?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  isAnalyzing: boolean;
}

export function InteractiveExampleCard({ product, isSelected, onSelect, isAnalyzing }: InteractiveExampleCardProps) {
  return (
    <motion.div
      className={`relative p-8 rounded-3xl border-2 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm h-full group ${
        isSelected 
          ? 'bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-slate-800/95 dark:via-slate-800/95 dark:to-slate-900/80 shadow-2xl scale-105' 
          : 'bg-gradient-to-br from-white/95 via-white/95 to-gray-50/70 dark:from-slate-800/90 dark:via-slate-800/90 dark:to-slate-900/80 border-gray-300/60 dark:border-slate-600 shadow-xl hover:shadow-2xl'
      }`}
      style={{
        borderColor: isSelected ? product.color : undefined,
        boxShadow: isSelected 
          ? `0 25px 50px ${product.color}20, 0 12px 30px ${product.color}30, inset 0 1px 0 rgba(255,255,255,0.1)` 
          : undefined
      }}
      onClick={onSelect}
      whileHover={{
        boxShadow: `0 30px 60px ${product.color}15, 0 15px 35px ${product.color}25`,
        borderColor: product.color + '80'
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            rotate: 0,
            boxShadow: [
              `0 4px 15px ${product.color}40`,
              `0 6px 20px ${product.color}60`,
              `0 4px 15px ${product.color}40`
            ]
          }}
          transition={{
            duration: 0.4,
            boxShadow: { duration: 1.5, repeat: Infinity }
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-20 border-2 border-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${product.color}, ${product.color}dd)`
          }}
        >
          <motion.span 
            className="text-white text-sm font-bold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ✓
          </motion.span>
        </motion.div>
      )}
      
      {/* Animated Top Border */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-t-3xl"
        animate={{
          background: isSelected 
            ? ['linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)', 'linear-gradient(90deg, #8b5cf6, #10b981, #3b82f6)', 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)']
            : 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)'
        }}
        transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
      />
      
      {/* Hover Glow Effect */}
      <motion.div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${product.color}15, transparent, ${product.color}15)`,
          filter: 'blur(1px)'
        }}
      />

      {/* Loading Overlay */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-4 border-transparent shadow-lg mb-3"
            style={{
              borderTopColor: product.color,
              borderRightColor: `${product.color}80`,
              background: `conic-gradient(${product.color}20, transparent)`
            }}
          />
          <motion.p 
            className="text-sm font-semibold text-gray-800 dark:text-white px-3 py-1 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Analyzing...
          </motion.p>
        </motion.div>
      )}

      <div className="space-y-6 relative z-10">
        {/* Product Header */}
        <div className="space-y-3">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ 
              x: 0,
              opacity: 1,
              scale: isSelected ? 1.02 : 1
            }}
            whileHover={{
              x: 5,
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <h3 
              className={`font-bold text-xl leading-tight transition-all duration-300 ${
                isSelected 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-900 dark:text-white'
              }`}
              style={{
                color: isSelected ? product.color : undefined
              }}
            >
              {product.name}
            </h3>
          </motion.div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <span 
              className="px-3 py-1 text-xs font-semibold rounded-full border-2"
              style={{
                backgroundColor: isSelected ? `${product.color}15` : `${product.color}10`,
                borderColor: isSelected ? `${product.color}60` : `${product.color}40`,
                color: product.color
              }}
            >
              📦 Demo Product
            </span>
            <motion.div 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isSelected ? 'animate-pulse shadow-lg' : ''
              }`}
              style={{
                backgroundColor: product.color,
                boxShadow: isSelected ? `0 0 10px ${product.color}60` : undefined
              }}
            />
          </div>
        </div>
        
        {/* Metrics Section */}
        <div className="space-y-4">
          {/* Price Score */}
          <motion.div 
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200/60 dark:border-emerald-700/60 group/score cursor-pointer"
            whileHover={{
              scale: 1.02,
              y: -2,
              boxShadow: "0 8px 25px rgba(16, 185, 129, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-emerald-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: ['0 0 0 rgba(16, 185, 129, 0)', '0 0 10px rgba(16, 185, 129, 0.5)', '0 0 0 rgba(16, 185, 129, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 group-hover/score:translate-x-1 transition-transform duration-200">Price Score</span>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.1,
                  y: -3,
                  rotate: [0, -2, 2, 0]
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.2,
                  rotate: { duration: 0.6, ease: "easeInOut" }
                }}
              >
                {/* eslint-disable-next-line react/forbid-dom-props */}
                <span 
                  className="px-4 py-2 text-sm rounded-xl font-bold shadow-md border-2 transition-all duration-300 text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 hover:shadow-lg"
                  style={{ borderColor: `${product.color}60` }}
                >
                  {product.priceScore}/100
                </span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Review Trust */}
          <motion.div 
            className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/60 dark:border-blue-700/60 group/review cursor-pointer"
            whileHover={{
              scale: 1.02,
              y: -2,
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-blue-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: ['0 0 0 rgba(59, 130, 246, 0)', '0 0 10px rgba(59, 130, 246, 0.5)', '0 0 0 rgba(59, 130, 246, 0)']
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <span className="text-sm font-semibold text-blue-800 dark:text-blue-200 group-hover/review:translate-x-1 transition-transform duration-200">Review Trust</span>
              </div>
              <motion.span 
                className={`text-sm font-bold px-3 py-1 rounded-lg transition-all duration-300 ${
                  isSelected 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/50'
                }`}
                animate={{ scale: isSelected ? 1.05 : 1 }}
                whileHover={{ 
                  scale: 1.1,
                  y: -2,
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {product.reviewStatus}
              </motion.span>
            </div>
          </motion.div>
          
          {/* Ethics Rating */}
          <motion.div 
            className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/60 dark:border-purple-700/60 group/ethics cursor-pointer"
            whileHover={{
              scale: 1.02,
              y: -2,
              boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-purple-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: ['0 0 0 rgba(139, 92, 246, 0)', '0 0 10px rgba(139, 92, 246, 0.5)', '0 0 0 rgba(139, 92, 246, 0)']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="text-sm font-semibold text-purple-800 dark:text-purple-200 group-hover/ethics:translate-x-1 transition-transform duration-200">Ethics Rating</span>
              </div>
              <motion.span 
                className={`text-sm font-bold px-3 py-1 rounded-lg transition-all duration-300 ${
                  isSelected 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-800/50'
                }`}
                animate={{ scale: isSelected ? 1.05 : 1 }}
                whileHover={{ 
                  scale: 1.1,
                  y: -2,
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
                }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                {product.ethicsRating}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Insight Section */}
        {isSelected && product.insight && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div 
              className="p-4 rounded-2xl border-2 shadow-lg backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${product.color}08, ${product.color}15)`,
                borderColor: `${product.color}40`
              }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${product.color}, ${product.color}dd)`
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💡
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                    {product.insight}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
