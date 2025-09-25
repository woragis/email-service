/**
 * Auth initializer for handling authentication state on app startup
 * Checks for existing auth tokens and initializes the auth store
 */

import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api/auth';
import { authKeys } from '@/stores/auth';
import { QueryClient } from '@tanstack/react-query';

export interface AuthInitializationResult {
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
}

/**
 * Initialize authentication state
 * This should be called once when the app starts
 */
export const initializeAuth = async (
  queryClient: QueryClient
): Promise<AuthInitializationResult> => {
  try {
    // Initialize the auth store (loads token from cookies)
    useAuthStore.getState().initialize();
    
    const { token } = useAuthStore.getState();
    
    // If no token, user is not authenticated
    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
        error: null,
      };
    }

    // Try to fetch user data with the existing token
    try {
      const user = await queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: authApi.getMe,
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Update the auth store with user data
      useAuthStore.getState().setUser(user);

      return {
        isAuthenticated: true,
        user,
        error: null,
      };
    } catch (error) {
      // Token is invalid or expired, clear it
      console.warn('Invalid or expired token, clearing auth state:', error);
      useAuthStore.getState().logout();
      queryClient.removeQueries({ queryKey: authKeys.all });

      return {
        isAuthenticated: false,
        user: null,
        error: 'Token expired or invalid',
      };
    }
  } catch (error) {
    console.error('Auth initialization failed:', error);
    
    // Clear any potentially corrupted auth state
    useAuthStore.getState().logout();
    queryClient.removeQueries({ queryKey: authKeys.all });

    return {
      isAuthenticated: false,
      user: null,
      error: error instanceof Error ? error.message : 'Auth initialization failed',
    };
  }
};

/**
 * Hook for auth initialization in React components
 */
export const useAuthInitialization = () => {
  const { isInitialized } = useAuthStore();

  return {
    isInitialized,
    initialize: () => useAuthStore.getState().initialize(),
  };
};

/**
 * Auth guard for protecting routes
 * Returns true if user is authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const { token, user } = useAuthStore.getState();
  return !!(token && user);
};

/**
 * Get current auth state synchronously
 */
export const getAuthState = () => {
  const { token, user, isInitialized } = useAuthStore.getState();
  return {
    token,
    user,
    isAuthenticated: !!(token && user),
    isInitialized,
  };
};
