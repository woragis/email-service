import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { useAuthActions, authKeys, useAuth } from '@/lib/stores/auth';
import { User, AuthResponse } from '@/types/api';

// Remove duplicate authKeys since they're now imported from stores

/**
 * Hook to get current user profile
 */
export const useMe = () => {
  const { setUser } = useAuthActions();
  const { token, isInitialized } = useAuth();

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token && isInitialized, // Only run if we have a token and auth is initialized
  });

  // Update user data in store when query succeeds
  if (query.isSuccess && query.data) {
    setUser(query.data);
  }

  return query;
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const { setAuth } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (authData: AuthResponse) => {
      setAuth(authData);
      queryClient.setQueryData(authKeys.me(), authData.user);
      toast.success(`Welcome, ${authData.user.username}! Your account has been created successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
  const { setAuth } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (authData: AuthResponse) => {
      setAuth(authData);
      queryClient.setQueryData(authKeys.me(), authData.user);
      toast.success(`Welcome back, ${authData.user.username}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const { logout } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear auth state
      logout();
      // Clear all queries
      queryClient.clear();
    },
    onSuccess: () => {
      toast.success('You have been logged out successfully.');
    },
    onError: (error: Error) => {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    },
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const { setUser } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (user: User) => {
      setUser(user);
      queryClient.setQueryData(authKeys.me(), user);
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile. Please try again.');
    },
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password. Please try again.');
    },
  });
};

/**
 * Hook for requesting password reset
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: authApi.requestPasswordReset,
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    },
  });
};

/**
 * Hook for resetting password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully! You can now log in with your new password.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password. Please try again.');
    },
  });
};

/**
 * Hook for email verification
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify email. Please try again.');
    },
  });
};

/**
 * Hook for resending verification email
 */
export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success('Verification email sent! Check your inbox.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resend verification email. Please try again.');
    },
  });
};

/**
 * Hook for deleting account
 */
export const useDeleteAccount = () => {
  const { logout } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Account deleted successfully.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account. Please try again.');
    },
  });
};
