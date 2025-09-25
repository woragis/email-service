/**
 * Auth Provider Component
 * Handles authentication initialization and provides auth context
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initializeAuth, AuthInitializationResult } from '@/lib/auth/initializer';
import { useAuthStore, useAuth } from '@/lib/stores/auth';

interface AuthContextType {
  isInitialized: boolean;
  initializationResult: AuthInitializationResult | null;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationResult, setInitializationResult] = useState<AuthInitializationResult | null>(null);
  const queryClient = useQueryClient();
  const { isInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsInitializing(true);
        const result = await initializeAuth(queryClient);
        setInitializationResult(result);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setInitializationResult({
          isAuthenticated: false,
          user: null,
          error: error instanceof Error ? error.message : 'Auth initialization failed',
        });
      } finally {
        setIsInitializing(false);
      }
    };

    // Only initialize if not already initialized
    if (!isInitialized) {
      initAuth();
    } else {
      setIsInitializing(false);
    }
  }, [queryClient, isInitialized]);

  const contextValue: AuthContextType = {
    isInitialized: isInitialized && !isInitializing,
    initializationResult,
    isInitializing,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

/**
 * Higher-order component for protecting routes
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    requireAuth?: boolean;
  } = {}
) => {
  const { redirectTo = '/login', requireAuth = true } = options;

  return function AuthenticatedComponent(props: P) {
    const { isInitialized, isInitializing } = useAuthContext();
    const { isAuthenticated } = useAuth();

    // Show loading while initializing
    if (isInitializing || !isInitialized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Redirect if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
      return null;
    }

    return <Component {...props} />;
  };
};
