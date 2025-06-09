import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 2 times
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Cache data for 1 minute
      staleTime: 60 * 1000,
      gcTime: 2 * 60 * 1000,
      
      // Refetch on window focus for real-time updates
      refetchOnWindowFocus: true,
      
      // Show stale data while revalidating
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't retry if the error is a validation error
      onError: (error: any) => {
        if (error?.response?.status === 422) {
          return false;
        }
        return true;
      },
    },
  },
}); 