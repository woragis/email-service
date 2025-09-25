import { apiClient } from '../apiClient';
import { 
  BlogPost, 
  BlogCategory, 
  CreateBlogPostData, 
  UpdateBlogPostData,
  CreateBlogCategoryData,
  UpdateBlogCategoryData,
  BlogFilters,
  PaginatedResponse 
} from '@/types/platform';

export const blogApi = {
  /**
   * Get all blog posts with optional filters
   */
  getBlogPosts: async (filters?: BlogFilters): Promise<PaginatedResponse<BlogPost>> => {
    const params = new URLSearchParams();
    
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<PaginatedResponse<BlogPost>>(
      `/blog?${params.toString()}`
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch blog posts');
    }
    
    return response.data;
  },

  /**
   * Get a single blog post by ID
   */
  getBlogPost: async (id: string): Promise<BlogPost> => {
    const response = await apiClient.get<BlogPost>(`/blog/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch blog post');
    }
    
    return response.data;
  },

  /**
   * Get a single blog post by slug
   */
  getBlogPostBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await apiClient.get<BlogPost>(`/blog/slug/${slug}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch blog post');
    }
    
    return response.data;
  },

  /**
   * Create a new blog post
   */
  createBlogPost: async (data: CreateBlogPostData): Promise<BlogPost> => {
    const response = await apiClient.post<BlogPost>('/blog', data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create blog post');
    }
    
    return response.data;
  },

  /**
   * Update a blog post
   */
  updateBlogPost: async (id: string, data: UpdateBlogPostData): Promise<BlogPost> => {
    const response = await apiClient.put<BlogPost>(`/blog/${id}`, data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update blog post');
    }
    
    return response.data;
  },

  /**
   * Delete a blog post
   */
  deleteBlogPost: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/blog/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete blog post');
    }
  },

  /**
   * Get all blog categories
   */
  getBlogCategories: async (): Promise<BlogCategory[]> => {
    const response = await apiClient.get<BlogCategory[]>('/blog/categories');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch blog categories');
    }
    
    return response.data;
  },

  /**
   * Get a single blog category by ID
   */
  getBlogCategory: async (id: string): Promise<BlogCategory> => {
    const response = await apiClient.get<BlogCategory>(`/blog/categories/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch blog category');
    }
    
    return response.data;
  },

  /**
   * Create a new blog category
   */
  createBlogCategory: async (data: CreateBlogCategoryData): Promise<BlogCategory> => {
    const response = await apiClient.post<BlogCategory>('/blog/categories', data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create blog category');
    }
    
    return response.data;
  },

  /**
   * Update a blog category
   */
  updateBlogCategory: async (id: string, data: UpdateBlogCategoryData): Promise<BlogCategory> => {
    const response = await apiClient.put<BlogCategory>(`/blog/categories/${id}`, data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update blog category');
    }
    
    return response.data;
  },

  /**
   * Delete a blog category
   */
  deleteBlogCategory: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/blog/categories/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete blog category');
    }
  },
};
