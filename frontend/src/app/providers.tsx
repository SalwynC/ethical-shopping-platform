'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { DevServiceWorkerCleanup } from '@/components/common/DevServiceWorkerCleanup';
import '@/lib/dev-utils'; // Initialize development utilities

type ProvidersProps = {
  children: ReactNode;
};

const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on network/connection errors
        if (
          error instanceof Error &&
          (error.message.includes('Unable to connect') ||
            error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError'))
        ) {
          return false;
        }
        // Retry once for other errors
        return failureCount < 1;
      },
      onError: (error) => {
        // Suppress console errors for connection refused errors
        // The browser already logs ERR_CONNECTION_REFUSED, so we don't need to duplicate it
        if (
          !(error instanceof Error) ||
          (!error.message.includes('Unable to connect') &&
            !error.message.includes('Failed to fetch') &&
            !error.message.includes('NetworkError'))
        ) {
          // Only log non-network errors
          console.error('Query error:', error);
        }
      },
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        // Suppress console errors for connection refused errors
        if (
          !(error instanceof Error) ||
          (!error.message.includes('Unable to connect') &&
            !error.message.includes('Failed to fetch') &&
            !error.message.includes('NetworkError'))
        ) {
          console.error('Mutation error:', error);
        }
      },
    },
  },
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <DevServiceWorkerCleanup />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
