'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconSearch,
  IconShieldCheck,
  IconHistory,
  IconMenu2,
  IconX,
  IconSparkles,
} from '@tabler/icons-react';
import { ThemeToggle } from './ThemeToggle';

const navigation = [
  { name: 'Home', href: '/' as const, icon: IconHome },
  { name: 'Analysis', href: '/analysis' as const, icon: IconSearch },
  { name: 'Reports', href: '/reports' as const, icon: IconShieldCheck },
  { name: 'Track', href: '/track-analysis' as const, icon: IconHistory },
];

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / windowHeight) * 100;

      setScrollProgress(Math.min(progress, 100));

      // Always show header at the very top
      if (currentScrollY <= 10) {
        setIsVisible(true);
      }
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      // Hide when scrolling down (but only after scrolling a bit)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 z-[60] origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 1 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? '0%' : '-100%',
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm will-change-transform"
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Enhanced Animation */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 rounded-xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-600 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <IconShieldCheck
                  size={20}
                  className="text-white relative z-10"
                />
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              <div className="flex flex-col">
                <motion.h1
                  className="text-xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% auto',
                    backgroundPosition: '0% center',
                  }}
                  animate={{
                    backgroundPosition: [
                      '0% center',
                      '100% center',
                      '0% center',
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  EthiShop
                </motion.h1>
                <div className="flex items-center space-x-2">
                  <motion.span
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gradient-to-r from-green-100 to-blue-100 text-green-800 dark:from-green-900/30 dark:to-blue-900/30 dark:text-green-300 border border-green-200 dark:border-green-700"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(34, 197, 94, 0.5)',
                        '0 0 10px rgba(34, 197, 94, 0.5)',
                        '0 0 0px rgba(34, 197, 94, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <IconSparkles size={10} className="mr-1" />
                    Live
                  </motion.span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Shop smart. Choose better.
                  </span>
                </div>
              </div>
            </Link>

            {/* Right side: Nav + Theme toggle aligned right */}
            <div className="ml-auto flex items-center">
              {/* Nav Links with Enhanced Hover Effects */}
              <div className="flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        className={`relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg"
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                        <Icon
                          size={18}
                          className={`mr-2 ${isActive ? 'relative z-10' : ''}`}
                        />
                        <span className={isActive ? 'relative z-10' : ''}>
                          {item.name}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              <div className="ml-6 pl-6 border-l border-gray-200 dark:border-gray-700">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? '0%' : '-100%',
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 will-change-transform"
          style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        >
          <div className="flex justify-between items-center px-4 h-14">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 rounded-lg shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                <IconShieldCheck className="w-4 h-4 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EthiShop
                </span>
                <motion.span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  animate={{
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <IconSparkles size={8} className="mr-0.5" />
                  Live
                </motion.span>
              </div>
            </Link>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconX
                        size={24}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconMenu2
                        size={24}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay with Enhanced Animations */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-14 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl z-40 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={item.href} onClick={closeMobileMenu}>
                          <motion.div
                            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon size={20} className="mr-3" />
                            {item.name}
                            {isActive && (
                              <motion.div
                                className="ml-auto w-2 h-2 bg-white rounded-full"
                                animate={{
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
