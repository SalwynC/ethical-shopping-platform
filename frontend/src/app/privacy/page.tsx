'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconShield, IconLeaf, IconMenu2, IconX } from '@tabler/icons-react';

export default function PrivacyPolicy() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.12) 0%, transparent 50%)',
        }}
      />

      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-white/20 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                <IconLeaf size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">EthiShop</div>
                <div className="text-white/70 text-xs">Privacy Policy</div>
              </div>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="/"
                className="text-white/90 hover:text-white text-sm transition-colors"
              >
                Home
              </a>
              <a
                href="#data-collection"
                className="text-white/90 hover:text-white text-sm transition-colors"
              >
                Data Collection
              </a>
              <a
                href="#usage"
                className="text-white/90 hover:text-white text-sm transition-colors"
              >
                Usage
              </a>
              <a
                href="#security"
                className="text-white/90 hover:text-white text-sm transition-colors"
              >
                Security
              </a>
              <a
                href="#contact"
                className="text-white/90 hover:text-white text-sm transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <IconX size={20} className="text-white" />
              ) : (
                <IconMenu2 size={20} className="text-white" />
              )}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 p-4 bg-slate-900/95 rounded-2xl border border-white/20"
            >
              <div className="flex flex-col gap-3">
                <a
                  href="/"
                  className="text-white text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#data-collection"
                  className="text-white text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Data Collection
                </a>
                <a
                  href="#usage"
                  className="text-white text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Usage
                </a>
                <a
                  href="#security"
                  className="text-white text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Security
                </a>
                <a
                  href="#contact"
                  className="text-white text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
            <IconShield size={20} className="text-white" />
            <span className="text-white font-medium">Privacy Policy</span>
          </div>

          <h1 className="text-4xl font-black text-white mb-6 drop-shadow-lg">
            Your Privacy Matters
          </h1>

          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            We believe in transparency about how we collect, use, and protect
            your data.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {/* Data Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="data-collection"
            className="bg-white/95 rounded-2xl p-8 backdrop-blur-sm shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Collection
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We collect information to provide you with better ethical
                shopping insights:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Product URLs you analyze for ethical and sustainability
                  ratings
                </li>
                <li>
                  Browser information to optimize our extension performance
                </li>
                <li>Usage patterns to improve our AI analysis algorithms</li>
                <li>Optional account information if you create a profile</li>
              </ul>
            </div>
          </motion.div>

          {/* Data Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            id="usage"
            className="bg-white/95 rounded-2xl p-8 backdrop-blur-sm shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Your Data
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Your data helps us provide accurate ethical analysis:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generate sustainability and ethical scores for products</li>
                <li>Suggest better alternatives aligned with your values</li>
                <li>Improve our machine learning models for better accuracy</li>
                <li>
                  Send personalized ethical shopping insights (with your
                  consent)
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            id="security"
            className="bg-white/95 rounded-2xl p-8 backdrop-blur-sm shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Security
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We protect your information with industry-standard security:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure cloud storage with regular security audits</li>
                <li>No sharing of personal data with third parties</li>
                <li>Regular deletion of temporary analysis data</li>
              </ul>
            </div>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/95 rounded-2xl p-8 backdrop-blur-sm shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Rights
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You have full control over your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access all data we have about you</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of data collection at any time</li>
                <li>Export your analysis history in standard formats</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          id="contact"
          className="text-center mt-16 pt-8 border-t border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-white/90 mb-6">
            We're here to help. Contact us about any privacy concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@ethishop.com"
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Email Privacy Team
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
