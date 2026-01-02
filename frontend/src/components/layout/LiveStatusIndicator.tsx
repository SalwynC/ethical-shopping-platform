'use client';

import { useState, useEffect } from 'react';
import {
  IconActivity,
  IconDatabase,
  IconCloud,
  IconShield,
  IconBolt,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline';
  responseTime: number;
  lastPing: string;
  icon: React.ComponentType<any>;
}

interface RealAnalytics {
  timestamp: string;
  dailyAnalyses: number;
  activeBrowsers: number;
  systemHealth: number;
  uptime: {
    hours: number;
    minutes: number;
  };
  services: {
    [key: string]: {
      status: 'online' | 'offline';
      responseTime: number;
      lastPing: string;
    };
  };
}

export function LiveStatusIndicator() {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const [realAnalytics, setRealAnalytics] = useState<RealAnalytics | null>(
    null,
  );
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);

  // Generate unique session ID for this browser tab
  const sessionId = useState(
    () => `browser_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  )[0];

  // Fetch REAL analytics data
  const fetchRealAnalytics = async () => {
    const startTime = performance.now();
    setIsLoading(true);

    try {
      // Fetch REAL analytics from our new API
      const response = await fetch('/api/system-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId, // Track this specific browser
          'Cache-Control': 'no-cache',
        },
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const analyticsData: RealAnalytics = await response.json();
      const responseTime = Math.round(performance.now() - startTime);

      // Build service status from real analytics
      const realServiceStatus: ServiceStatus[] = [];

      if (analyticsData.services) {
        Object.entries(analyticsData.services).forEach(
          ([serviceName, serviceData]) => {
            const iconMap: { [key: string]: any } = {
              'Frontend Server': IconCloud,
              'Backend API': IconBolt,
              'Analytics Service': IconShield,
              Database: IconDatabase,
            };

            realServiceStatus.push({
              name: serviceName,
              status: serviceData.status,
              responseTime: serviceData.responseTime,
              lastPing: serviceData.lastPing,
              icon: iconMap[serviceName] || IconCloud,
            });
          },
        );
      }

      // Update with COMPLETELY REAL data
      setRealAnalytics(analyticsData);
      setServiceStatus(realServiceStatus);
      setIsOnline(true);
      setLastUpdated(new Date().toLocaleTimeString());

      console.log(`📊 REAL Analytics Received (${responseTime}ms):`, {
        dailyAnalyses: analyticsData.dailyAnalyses,
        activeBrowsers: analyticsData.activeBrowsers,
        systemHealth: analyticsData.systemHealth + '%',
        uptime: `${analyticsData.uptime.hours}h ${analyticsData.uptime.minutes}m`,
        onlineServices: realServiceStatus.filter((s) => s.status === 'online')
          .length,
        totalServices: realServiceStatus.length,
        sessionId: sessionId,
        dataType: 'COMPLETELY_AUTHENTIC',
      });
    } catch (error) {
      console.error('❌ Failed to fetch real analytics:', error);
      setIsOnline(false);

      // Show ZERO data when offline (NO FAKE FALLBACKS)
      setRealAnalytics({
        timestamp: new Date().toISOString(),
        dailyAnalyses: 0,
        activeBrowsers: 0,
        systemHealth: 0,
        uptime: { hours: 0, minutes: 0 },
        services: {},
      });

      setServiceStatus([
        {
          name: 'System Offline',
          status: 'offline',
          responseTime: 0,
          lastPing: new Date().toISOString(),
          icon: IconCloud,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial real data fetch
    fetchRealAnalytics();

    // Set up realistic updates every 3 seconds
    const interval = setInterval(fetchRealAnalytics, 3000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, []); // Only run once on mount

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed bottom-5 left-5 z-50 transition-all duration-300 ${
        expanded ? 'w-72' : 'w-56'
      }`}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-3">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <IconActivity
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              <div
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse ${
                  isOnline && realAnalytics && realAnalytics.systemHealth > 95
                    ? 'bg-green-500'
                    : isOnline &&
                        realAnalytics &&
                        realAnalytics.systemHealth > 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
              ></div>
            </div>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
              Real Analytics
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                isOnline && realAnalytics && realAnalytics.systemHealth > 95
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : isOnline && realAnalytics && realAnalytics.systemHealth > 50
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {realAnalytics ? realAnalytics.systemHealth.toFixed(0) : '0'}%
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {expanded ? (
                <IconChevronUp size={12} />
              ) : (
                <IconChevronDown size={12} />
              )}
            </button>
          </div>
        </div>

        {/* Real Analytics Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {realAnalytics
                ? realAnalytics.dailyAnalyses.toLocaleString()
                : '0'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Daily
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {realAnalytics
                ? realAnalytics.activeBrowsers.toLocaleString()
                : '0'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Browsers
            </div>
          </div>
          <div>
            <div
              className="text-sm font-bold text-purple-600 dark:text-purple-400"
              title="Quick analysis tests performed"
            >
              {/* This will be updated by our tracking API */}
              <span id="quick-analysis-counter">0</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Quick Tests
            </div>
          </div>
        </div>

        {/* Expanded Details - More Compact */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2"
            >
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Service Health
              </div>

              {serviceStatus.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.name}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-1">
                      <Icon
                        size={12}
                        className="text-gray-600 dark:text-gray-400"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                        {service.name}
                      </span>
                    </div>

                    <div
                      className={`px-1.5 py-0.5 text-xs rounded-full ${
                        service.status === 'online'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                      title={`${service.responseTime}ms response • Last: ${new Date(service.lastPing).toLocaleTimeString()}`}
                    >
                      {service.status === 'online' ? '✓' : '✗'}
                    </div>
                  </motion.div>
                );
              })}

              {/* System Health Bar */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>System Health</span>
                  <span>
                    {realAnalytics ? realAnalytics.systemHealth.toFixed(0) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      realAnalytics && realAnalytics.systemHealth > 95
                        ? 'bg-green-500'
                        : realAnalytics && realAnalytics.systemHealth > 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{
                      width: `${realAnalytics ? realAnalytics.systemHealth : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Real System Info */}
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-1">
                  <span>Server Uptime:</span>
                  <span
                    className={isOnline ? 'text-green-600' : 'text-red-600'}
                  >
                    {realAnalytics
                      ? `${realAnalytics.uptime.hours}h ${realAnalytics.uptime.minutes}m`
                      : '0h 0m'}
                  </span>
                </div>

                <div className="flex justify-between mb-1">
                  <span>Connection:</span>
                  <span
                    className={isOnline ? 'text-green-600' : 'text-red-600'}
                  >
                    {isOnline ? '🟢 Connected' : '🔴 Offline'}
                  </span>
                </div>

                {lastUpdated && (
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span className="text-blue-600">{lastUpdated}</span>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-center mt-1">
                    <span className="text-blue-500 animate-pulse">
                      🔄 Updating real analytics...
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
