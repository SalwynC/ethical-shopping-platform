'use client';

import Link from 'next/link';
import { Route } from 'next';
import {
  IconHeart,
  IconShield,
  IconBolt,
  IconWorld,
} from '@tabler/icons-react';
import { useTheme } from '@/contexts/ThemeContext';

export function AppFooter() {
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <IconBolt size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                EthiShop
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Making ethical shopping decisions easier with AI-powered analysis
              and recommendations.
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded">
                <IconShield
                  size={14}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Trusted Analysis
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">
              Features
            </h3>
            <div className="space-y-2">
              {[
                'Price Intelligence',
                'Ethical Scoring',
                'Product Alternatives',
                'Market Analysis',
                'Deal Alerts',
              ].map((feature) => (
                <div
                  key={feature}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">
              Company
            </h3>
            <div className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: '/contact' },
                { label: 'API', href: '/api' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href as Route}
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">
              Connect
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stay updated with ethical shopping insights
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded">
                  <IconHeart
                    size={14}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Community Driven
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded">
                  <IconWorld
                    size={14}
                    className="text-cyan-600 dark:text-cyan-400"
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Global Impact
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 py-6">
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 EthiShop. Built with Next.js and Tailwind CSS.
            </p>
            <div className="flex space-x-6">
              <Link
                href={'/privacy' as Route}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href={'/terms' as Route}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
