"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export function LiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [time, setTime] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 });
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Set initial window dimensions
    const updateWindowDimensions = () => {
      if (typeof window !== 'undefined') {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };

    // Track mouse movement for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== 'undefined') {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      }
    };

    // Real-time clock for continuous animation
    intervalRef.current = setInterval(() => {
      setTime(Date.now());
    }, 50); // Update every 50ms for smooth animation

    // Initialize dimensions and add event listeners
    updateWindowDimensions();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', updateWindowDimensions);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', updateWindowDimensions);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Generate dynamic colors based on time
  const dynamicColors = {
    primary: `hsl(${(time / 100) % 360}, 70%, 60%)`,
    secondary: `hsl(${(time / 150 + 120) % 360}, 65%, 55%)`,
    accent: `hsl(${(time / 200 + 240) % 360}, 80%, 65%)`
  };

  // Don't render complex animations on server
  if (!isClient) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Dynamic Gradient Background that shifts colors in real-time */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: theme === 'dark' ? `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(16, 185, 129, 0.15) 0%, 
              rgba(6, 182, 212, 0.1) 35%, 
              rgba(99, 102, 241, 0.05) 70%, 
              transparent 100%
            ),
            linear-gradient(
              ${(time / 100) % 360}deg, 
              rgba(15, 23, 42, 1) 0%, 
              rgba(30, 41, 59, 1) 50%, 
              rgba(15, 23, 42, 1) 100%
            )
          ` : `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(16, 185, 129, 0.08) 0%, 
              rgba(6, 182, 212, 0.05) 35%, 
              rgba(99, 102, 241, 0.03) 70%, 
              transparent 100%
            ),
            linear-gradient(
              ${(time / 100) % 360}deg, 
              rgba(248, 250, 252, 1) 0%, 
              rgba(241, 245, 249, 1) 50%, 
              rgba(248, 250, 252, 1) 100%
            )
          `,
        }}
        animate={{
          background: [
            `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 35%, rgba(99, 102, 241, 0.05) 70%, transparent 100%), linear-gradient(${(time / 100) % 360}deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 50%, rgba(15, 23, 42, 1) 100%)`,
          ]
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Live Floating Orbs that respond to mouse */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-xl"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            background: theme === 'dark' 
              ? `radial-gradient(circle, ${dynamicColors.primary}40 0%, transparent 70%)`
              : `radial-gradient(circle, ${dynamicColors.primary}20 0%, transparent 70%)`,
          }}
          animate={{
            x: [
              `${10 + i * 15}vw`,
              `${mousePosition.x / 5 + 15 + i * 10}vw`,
              `${20 + i * 12}vw`
            ],
            y: [
              `${10 + i * 10}vh`,
              `${mousePosition.y / 3 + 20 + i * 8}vh`,
              `${15 + i * 15}vh`
            ],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.2, 0.4]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Pulsing Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${10 + i * 12}%`}
            y1="0%"
            x2={`${mousePosition.x + i * 5}%`}
            y2={`${mousePosition.y}%`}
            stroke="url(#gradient)"
            strokeWidth="1"
            animate={{
              opacity: [0.1, 0.5, 0.1],
              strokeWidth: [0.5, 2, 0.5]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Real-time Particle System */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => {
          // Use deterministic values based on index to prevent hydration issues
          const leftPos = ((i * 37) % 100);
          const topPos = ((i * 23) % 100);
          const duration = 5 + (i % 10);
          const delay = (i * 0.2) % 5;
          
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500/60'
              }`}
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
              }}
              animate={{
                y: [0, -(windowDimensions.height + 100)],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: delay
              }}
            />
          );
        })}
      </div>

      {/* Interactive Ripple Effect */}
      <motion.div
        className="absolute w-96 h-96 border border-emerald-500/30 rounded-full"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [0, 2, 0],
          opacity: [1, 0.3, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      {/* Breathing Ambient Light */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 60%)`
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Data Stream Effect */}
      <div className="absolute right-0 top-0 w-1 h-full overflow-hidden opacity-20">
        {[...Array(50)].map((_, i) => {
          // Use deterministic values to prevent hydration mismatch
          const duration = 3 + (i % 4);
          const delay = (i * 0.1) % 3;
          
          return (
            <motion.div
              key={i}
              className={`absolute w-full bg-gradient-to-b from-transparent to-transparent ${
              theme === 'dark' ? 'via-cyan-400' : 'via-cyan-500/40'
            }`}
              style={{
                height: '20px',
                top: `${i * 4}%`
              }}
              animate={{
                y: [0, windowDimensions.height + 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: delay
              }}
            />
          );
        })}
      </div>
    </div>
  );
}