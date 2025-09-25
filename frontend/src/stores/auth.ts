import { useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { User, AuthResponse } from '@/types/api';
import { authCookies } from '@/utils/cookies';

// Auth state interface
interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setAuth: (authData: AuthResponse) => void;
  logout: () => void;
  initialize: () => void;
}

// Auth store using cookies for persistence
export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isInitialized: false,

  setToken: (token: string | null) => {
    if (token) {
      authCookies.setToken(token);
    } else {
      authCookies.removeToken();
    }
    set({ token });
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  setAuth: (authData: AuthResponse) => {
    authCookies.setToken(authData.token);
    set({ 
      token: authData.token, 
      user: authData.user 
    });
  },

  logout: () => {
    authCookies.removeToken();
    set({ 
      token: null, 
      user: null 
    });
  },

  initialize: () => {
    const token = authCookies.getToken();
    set({ 
      token, 
      isInitialized: true 
    });
  },
}));

// Legacy compatibility - keeping the old name for now
export const useTokenStore = useAuthStore;

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Auth context using TanStack Query
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { token, user, isInitialized } = useAuthStore();
  
  // Get user data from store or query cache
  const storeUser = user;
  const cacheUser = queryClient.getQueryData<User>(authKeys.me());
  const currentUser = storeUser || cacheUser || null;
  
  const isLoading = queryClient.isFetching({ queryKey: authKeys.me() }) > 0;
  const isAuthenticated = !!token && !!currentUser;

  return {
    user: currentUser,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    error: null, // Errors will be handled by individual queries
  };
};

// Auth actions
export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const { setToken, setUser: setUserStore, setAuth: setAuthStore, logout: logoutStore } = useAuthStore();

  const setAuth = (authData: AuthResponse) => {
    setAuthStore(authData);
    queryClient.setQueryData(authKeys.me(), authData.user);
  };

  const setUser = (user: User) => {
    setUserStore(user);
    queryClient.setQueryData(authKeys.me(), user);
  };

  const logout = () => {
    logoutStore();
    queryClient.clear();
  };

  const setError = (error: string | null) => {
    // For errors, we can use queryClient.setQueryData to store error state
    // or handle it in the component level
    console.error('Auth error:', error);
  };

  return {
    setAuth,
    setUser,
    setToken,
    logout,
    setError,
  };
};