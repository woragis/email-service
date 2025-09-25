import { apiClient } from '../apiClient';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/api';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data, {
      skipAuth: true,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }
    
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data, {
      skipAuth: true,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }
    
    return response.data;
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get user profile');
    }
    
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/me', data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update profile');
    }
    
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    const response = await apiClient.post('/auth/change-password', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    const response = await apiClient.post('/auth/forgot-password', { email }, {
      skipAuth: true,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to send reset email');
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: {
    token: string;
    newPassword: string;
  }): Promise<void> => {
    const response = await apiClient.post('/auth/reset-password', data, {
      skipAuth: true,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset password');
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    const response = await apiClient.post('/auth/verify-email', { token }, {
      skipAuth: true,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify email');
    }
  },

  /**
   * Resend verification email
   */
  resendVerification: async (): Promise<void> => {
    const response = await apiClient.post('/auth/resend-verification');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to resend verification email');
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async (password: string): Promise<void> => {
    const response = await apiClient.delete('/auth/account', {
      data: { password },
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete account');
    }
  },
};
