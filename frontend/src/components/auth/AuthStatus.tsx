/**
 * Auth Status Component
 * Displays current authentication status and provides testing functionality
 */

'use client';

import React from 'react';
import { useAuth } from '@/lib/stores/auth';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { authCookies } from '@/lib/utils/cookies';

export const AuthStatus: React.FC = () => {
  const { user, token, isAuthenticated, isInitialized } = useAuth();
  const { isInitializing, initializationResult } = useAuthContext();

  const handleTestCookie = () => {
    const currentToken = authCookies.getToken();
    console.log('Current token from cookie:', currentToken);
    console.log('Current token from store:', token);
    console.log('Are they equal?', currentToken === token);
  };

  const handleClearAuth = () => {
    authCookies.removeToken();
    window.location.reload();
  };

  if (isInitializing) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
        <h3 className="font-semibold text-yellow-800">Auth Status: Initializing...</h3>
        <p className="text-yellow-700">Checking authentication state...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-2">Auth Status</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Initialized:</span>{' '}
          <span className={isInitialized ? 'text-green-600' : 'text-red-600'}>
            {isInitialized ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Authenticated:</span>{' '}
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Token:</span>{' '}
          <span className="text-gray-600">
            {token ? `${token.substring(0, 20)}...` : 'None'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">User:</span>{' '}
          <span className="text-gray-600">
            {user ? user.username : 'None'}
          </span>
        </div>

        {initializationResult?.error && (
          <div>
            <span className="font-medium text-red-600">Error:</span>{' '}
            <span className="text-red-600">{initializationResult.error}</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-x-2">
        <button
          onClick={handleTestCookie}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Cookie
        </button>
        
        <button
          onClick={handleClearAuth}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Auth
        </button>
      </div>
    </div>
  );
};
