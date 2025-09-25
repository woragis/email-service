import { apiClient } from '../apiClient';
import { 
  Course, 
  CourseModule, 
  CourseChapter,
  CreateCourseData, 
  UpdateCourseData,
  CreateCourseModuleData,
  UpdateCourseModuleData,
  CreateCourseChapterData,
  UpdateCourseChapterData,
  CourseFilters,
  PaginatedResponse 
} from '@/types/platform';

export const courseApi = {
  /**
   * Get all courses with optional filters
   */
  getCourses: async (filters?: CourseFilters): Promise<PaginatedResponse<Course>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<PaginatedResponse<Course>>(
      `/courses?${params.toString()}`
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch courses');
    }
    
    return response.data;
  },

  /**
   * Get a single course by ID
   */
  getCourse: async (id: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch course');
    }
    
    return response.data;
  },

  /**
   * Get a course with all its modules and chapters
   */
  getCourseWithModules: async (id: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}/modules`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch course with modules');
    }
    
    return response.data;
  },

  /**
   * Get a single course by slug
   */
  getCourseBySlug: async (slug: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/slug/${slug}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch course');
    }
    
    return response.data;
  },

  /**
   * Get a course with all its modules and chapters by slug
   */
  getCourseWithModulesBySlug: async (slug: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/slug/${slug}/modules`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch course with modules');
    }
    
    return response.data;
  },

  /**
   * Create a new course
   */
  createCourse: async (data: CreateCourseData): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create course');
    }
    
    return response.data;
  },

  /**
   * Update a course
   */
  updateCourse: async (id: string, data: UpdateCourseData): Promise<Course> => {
    const response = await apiClient.put<Course>(`/courses/${id}`, data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update course');
    }
    
    return response.data;
  },

  /**
   * Delete a course
   */
  deleteCourse: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/courses/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete course');
    }
  },

  // Course Module API
  /**
   * Create a new course module
   */
  createCourseModule: async (data: CreateCourseModuleData): Promise<CourseModule> => {
    const response = await apiClient.post<CourseModule>('/courses/modules', data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create course module');
    }
    
    return response.data;
  },

  /**
   * Get a single course module by ID
   */
  getCourseModule: async (id: string): Promise<CourseModule> => {
    const response = await apiClient.get<CourseModule>(`/courses/modules/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch course module');
    }
    
    return response.data;
  },

  /**
   * Update a course module
   */
  updateCourseModule: async (id: string, data: UpdateCourseModuleData): Promise<CourseModule> => {
    const response = await apiClient.put<CourseModule>(`/courses/modules/${id}`, data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update course module');
    }
    
    return response.data;
  },

  /**
   * Delete a course module
   */
  deleteCourseModule: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/courses/modules/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete course module');
    }
  },

  // Course Chapter API
  /**
   * Create a new course chapter
   */
  createCourseChapter: async (data: CreateCourseChapterData): Promise<CourseChapter> => {
    const response = await apiClient.post<CourseChapter>('/courses/chapters', data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create course chapter');
    }
    
    return response.data;
  },

  /**
   * Get a single course chapter by ID
   */
  getCourseChapter: async (id: string): Promise<CourseChapter> => {
    const response = await apiClient.get<CourseChapter>(`/courses/chapters/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch course chapter');
    }
    
    return response.data;
  },

  /**
   * Update a course chapter
   */
  updateCourseChapter: async (id: string, data: UpdateCourseChapterData): Promise<CourseChapter> => {
    const response = await apiClient.put<CourseChapter>(`/courses/chapters/${id}`, data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update course chapter');
    }
    
    return response.data;
  },

  /**
   * Delete a course chapter
   */
  deleteCourseChapter: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/courses/chapters/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete course chapter');
    }
  },
};
