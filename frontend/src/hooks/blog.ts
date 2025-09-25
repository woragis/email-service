import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { blogApi } from '@/lib/api/blog';
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

// Query keys for blog data
export const blogKeys = {
  all: ['blog'] as const,
  posts: () => [...blogKeys.all, 'posts'] as const,
  post: (id: string) => [...blogKeys.posts(), id] as const,
  postBySlug: (slug: string) => [...blogKeys.posts(), 'slug', slug] as const,
  postsList: (filters?: BlogFilters) => [...blogKeys.posts(), 'list', filters] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  category: (id: string) => [...blogKeys.categories(), id] as const,
};

/**
 * Hook to get all blog posts with optional filters
 */
export const useBlogPosts = (filters?: BlogFilters) => {
  return useQuery({
    queryKey: blogKeys.postsList(filters),
    queryFn: () => blogApi.getBlogPosts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single blog post by ID
 */
export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: blogKeys.post(id),
    queryFn: () => blogApi.getBlogPost(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single blog post by slug
 */
export const useBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: blogKeys.postBySlug(slug),
    queryFn: () => blogApi.getBlogPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get all blog categories
 */
export const useBlogCategories = () => {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: blogApi.getBlogCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
  });
};

/**
 * Hook to get a single blog category by ID
 */
export const useBlogCategory = (id: string) => {
  return useQuery({
    queryKey: blogKeys.category(id),
    queryFn: () => blogApi.getBlogCategory(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for creating a blog post
 */
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.createBlogPost,
    onSuccess: (newPost: BlogPost) => {
      // Invalidate and refetch blog posts list
      queryClient.invalidateQueries({ queryKey: blogKeys.postsList() });
      // Add the new post to the cache
      queryClient.setQueryData(blogKeys.post(newPost.id), newPost);
      toast.success('Blog post created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create blog post. Please try again.');
    },
  });
};

/**
 * Hook for updating a blog post
 */
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPostData }) =>
      blogApi.updateBlogPost(id, data),
    onSuccess: (updatedPost: BlogPost) => {
      // Update the specific post in cache
      queryClient.setQueryData(blogKeys.post(updatedPost.id), updatedPost);
      // Invalidate posts list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: blogKeys.postsList() });
      toast.success('Blog post updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blog post. Please try again.');
    },
  });
};

/**
 * Hook for deleting a blog post
 */
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.deleteBlogPost,
    onSuccess: (_, deletedId) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: blogKeys.post(deletedId) });
      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: blogKeys.postsList() });
      toast.success('Blog post deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog post. Please try again.');
    },
  });
};

/**
 * Hook for creating a blog category
 */
export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.createBlogCategory,
    onSuccess: (newCategory: BlogCategory) => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      // Add the new category to the cache
      queryClient.setQueryData(blogKeys.category(newCategory.id), newCategory);
      toast.success('Blog category created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create blog category. Please try again.');
    },
  });
};

/**
 * Hook for updating a blog category
 */
export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogCategoryData }) =>
      blogApi.updateBlogCategory(id, data),
    onSuccess: (updatedCategory: BlogCategory) => {
      // Update the specific category in cache
      queryClient.setQueryData(blogKeys.category(updatedCategory.id), updatedCategory);
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      toast.success('Blog category updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blog category. Please try again.');
    },
  });
};

/**
 * Hook for deleting a blog category
 */
export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.deleteBlogCategory,
    onSuccess: (_, deletedId) => {
      // Remove the category from cache
      queryClient.removeQueries({ queryKey: blogKeys.category(deletedId) });
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      toast.success('Blog category deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog category. Please try again.');
    },
  });
};
