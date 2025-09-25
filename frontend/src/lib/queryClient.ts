import { QueryClient } from '@tanstack/react-query';
import { env } from './env';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data remains fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Time in milliseconds that unused/inactive cache data remains in memory
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Number of retries for failed requests
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors (client errors)
        if ((error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Time in milliseconds between retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Number of retries for failed mutations
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors (client errors)
        if ((error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      
      // Time in milliseconds between retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Development-only: Enable query devtools
if (env.isDevelopment && typeof window !== 'undefined') {
  // This will be handled by the React Query Devtools component
  console.log('React Query Devtools enabled in development');
}
