// Development utilities for console management
export const devUtils = {
  // Clear extension console noise in development
  clearExtensionLogs: () => {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'development'
    ) {
      // Override console methods to filter extension logs
      const originalLog = console.log;
      const originalWarn = console.warn;

      console.log = (...args) => {
        const message = args.join(' ');
        if (
          message.includes('CONTENT SCRIPT') ||
          message.includes('YouTube Customizer') ||
          message.includes('FloatingTimer') ||
          message.includes('content_script.bundle.js')
        ) {
          return; // Skip extension logs
        }
        originalLog.apply(console, args);
      };

      console.warn = (...args) => {
        const message = args.join(' ');
        if (message.includes('motion() is deprecated')) {
          return; // Skip motion deprecation after we fixed it
        }
        originalWarn.apply(console, args);
      };
    }
  },

  // Performance monitoring
  trackPageLoad: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType(
            'navigation',
          )[0] as PerformanceNavigationTiming;
          if (
            perfData &&
            perfData.loadEventEnd &&
            perfData.domContentLoadedEventEnd
          ) {
            console.log('📊 Page Load Performance:', {
              'Total Load Time': `${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`,
              'DOM Content Loaded': `${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`,
              'Response Time': `${Math.round(perfData.responseEnd - perfData.responseStart)}ms`,
            });
          }
        }, 0);
      });
    }
  },
};

// Initialize in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  devUtils.clearExtensionLogs();
  devUtils.trackPageLoad();
}
