import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from './env';
import { useAuthStore } from '@/stores/auth';
import { ApiResponse, RequestConfig, ResponseError } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    
    this.client = axios.create({
      baseURL: env.getApiUrl(),
      timeout: env.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;
        
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: ResponseError) => {
        const { response } = error;
        
        // Handle 401 Unauthorized
        if (response?.status === 401) {
          // Clear token and redirect to login
          useAuthStore.getState().logout();
          
          // Redirect to login if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        // Handle 403 Forbidden
        if (response?.status === 403) {
          console.error('Access denied');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request<T = unknown>(
    config: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const { skipAuth, ...axiosConfig } = config;
      
      if (skipAuth) {
        delete axiosConfig.headers?.Authorization;
      }

      const response = await this.client.request<ApiResponse<T>>(axiosConfig);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error as ResponseError);
    }
  }

  // HTTP methods
  async get<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = unknown>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = unknown>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = unknown>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // File upload method
  async upload<T = unknown>(
    url: string,
    file: File,
    config?: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  // Error handling
  private handleError(error: ResponseError): Error {
    if (error.response?.data) {
      const apiError = error.response.data;
      return new Error(apiError.error || apiError.message || 'An error occurred');
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('Network error occurred');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { skipAuth: true });
      return true;
    } catch {
      return false;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export the class for testing
export { ApiClient };
