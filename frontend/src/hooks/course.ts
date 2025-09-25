import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/lib/api/course';
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
  CourseFilters 
} from '@/types/platform';
import { toast } from 'react-hot-toast';

// Query keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: CourseFilters) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  withModules: (id: string) => [...courseKeys.detail(id), 'modules'] as const,
  modules: {
    all: ['course-modules'] as const,
    detail: (id: string) => [...courseKeys.modules.all, id] as const,
  },
  chapters: {
    all: ['course-chapters'] as const,
    detail: (id: string) => [...courseKeys.chapters.all, id] as const,
  },
};

// Course hooks
export const useCourses = (filters: CourseFilters = {}) => {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => courseApi.getCourses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseApi.getCourse(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseWithModules = (id: string) => {
  return useQuery({
    queryKey: courseKeys.withModules(id),
    queryFn: () => courseApi.getCourseWithModules(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...courseKeys.details(), 'slug', slug],
    queryFn: () => courseApi.getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseWithModulesBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...courseKeys.details(), 'slug', slug, 'modules'],
    queryFn: () => courseApi.getCourseWithModulesBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseData) => courseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success('Course created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create course');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) =>
      courseApi.updateCourse(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.withModules(id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success('Course updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update course');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success('Course deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete course');
    },
  });
};

// Course Module hooks
export const useCourseModule = (id: string) => {
  return useQuery({
    queryKey: courseKeys.modules.detail(id),
    queryFn: () => courseApi.getCourseModule(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCourseModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseModuleData) => courseApi.createCourseModule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.withModules(variables.courseId) });
      toast.success('Course module created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create course module');
    },
  });
};

export const useUpdateCourseModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseModuleData }) =>
      courseApi.updateCourseModule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.modules.detail(id) });
      // Invalidate course with modules to refresh the module list
      queryClient.invalidateQueries({ queryKey: courseKeys.withModules(id) });
      toast.success('Course module updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update course module');
    },
  });
};

export const useDeleteCourseModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourseModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.modules.all });
      // Invalidate all course with modules queries to refresh module lists
      queryClient.invalidateQueries({ queryKey: courseKeys.withModules('') });
      toast.success('Course module deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete course module');
    },
  });
};

// Course Chapter hooks
export const useCourseChapter = (id: string) => {
  return useQuery({
    queryKey: courseKeys.chapters.detail(id),
    queryFn: () => courseApi.getCourseChapter(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCourseChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseChapterData) => courseApi.createCourseChapter(data),
    onSuccess: (_, variables) => {
      // We need to invalidate the course with modules to refresh the chapter list
      // Since we don't have the courseId directly, we'll invalidate all course with modules queries
      queryClient.invalidateQueries({ queryKey: courseKeys.withModules('') });
      toast.success('Course chapter created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create course chapter');
    },
  });
};

export const useUpdateCourseChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseChapterData }) =>
      courseApi.updateCourseChapter(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.chapters.detail(id) });
      // Invalidate all course with modules queries to refresh chapter lists
      queryClient.invalidateQueries({ queryKey: courseKeys.withModules('') });
      toast.success('Course chapter updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update course chapter');
    },
  });
};

export const useDeleteCourseChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourseChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.chapters.all });
      // Invalidate all course with modules queries to refresh chapter lists
      queryClient.invalidateQueries({ queryKey: courseKeys.withModules('') });
      toast.success('Course chapter deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete course chapter');
    },
  });
};
