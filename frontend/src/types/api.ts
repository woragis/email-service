// API Response types that match the backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Request/Response interceptors types
export interface RequestConfig {
  skipAuth?: boolean;
  timeout?: number;
}

export interface ResponseError {
  response?: {
    data?: ApiResponse;
    status?: number;
  };
  message?: string;
}
