import { v4 as uuidv4 } from 'uuid';

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Blog related types
export interface BlogCategory {
  id: string;
  name: string;
  description?: string;
  color?: string; // For UI styling
}

export interface BlogPost extends BaseEntity {
  title: string;
  content: string; // Markdown content
  excerpt?: string;
  slug: string;
  publishedAt?: Date;
  isPublished: boolean;
  categoryId: string;
  category?: BlogCategory;
  substackUrl?: string; // Link to external Substack post
  featuredImage?: string;
  tags?: string[];
  // Video relationship (optional - not every blog post has a video)
  videoId?: string;
  video?: Video;
}

// Video related types
export interface VideoCategory {
  id: string;
  name: string;
  description?: string;
  type: 'band' | 'instrument' | 'genre' | 'vibe';
  color?: string; // For UI styling
}

export interface Video extends BaseEntity {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  duration?: number; // in seconds
  categories: VideoCategory[];
  // External platform links
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  // Blog relationship (required - every video has a blog post)
  blogPostId: string;
  blogPost?: BlogPost;
  // Course relationship (optional - videos can be part of courses)
  courseChapterId?: string;
  courseChapter?: CourseChapter;
}

// Course Video related types
export interface CourseVideo extends BaseEntity {
  title: string;
  slug: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  orderIndex: number;
  isPublished: boolean;
  publishedAt?: Date;
  courseId: string;
  moduleId: string;
  chapterId: string;
  course?: Course;
  module?: CourseModule;
  chapter?: CourseChapter;
  // Stats
  totalComments?: number;
  totalRatings?: number;
  averageRating?: number;
  totalLikes?: number;
}

export interface VideoComment extends BaseEntity {
  content: string;
  videoId: string;
  userId: string;
  parentCommentId?: string;
  isEdited: boolean;
  // Stats
  totalLikes?: number;
  totalReplies?: number;
  isLikedByUser?: boolean;
  replies?: VideoComment[];
}

export interface VideoCommentLike extends BaseEntity {
  commentId: string;
  userId: string;
}

export interface VideoRating extends BaseEntity {
  videoId: string;
  userId: string;
  rating: number; // 1-5 stars
}

export interface VideoRatingStats {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: RatingCount[];
}

export interface RatingCount {
  rating: number;
  count: number;
}

// Course related types
export interface Course extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  banner?: string;
  isPublished: boolean;
  publishedAt?: Date;
  modules: CourseModule[];
  totalStudents?: number;
  rating?: number;
  price?: number;
  currency?: string;
}

export interface CourseModule extends BaseEntity {
  title: string;
  description: string;
  banner?: string;
  order: number;
  courseId: string;
  course?: Course;
  chapters: CourseChapter[];
}

export interface CourseChapter extends BaseEntity {
  title: string;
  description: string;
  order: number;
  moduleId: string;
  module?: CourseModule;
}

// Comment and rating system
export interface Comment extends BaseEntity {
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likes: number;
  isLiked?: boolean; // For current user
  // Nested comments (replies)
  parentCommentId?: string;
  parentComment?: Comment;
  replies: Comment[];
  // Video relationship
  videoId: string;
  video?: Video;
}

export interface VideoRating extends BaseEntity {
  userId: string;
  userName: string;
  userAvatar?: string;
  videoId: string;
  video?: Video;
  stars: number; // 1-5 stars
  review?: string;
}

// Utility types for API responses
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and search types
export interface VideoFilters {
  categories?: string[];
  type?: 'band' | 'instrument' | 'genre' | 'vibe';
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

export interface BlogFilters {
  categoryId?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular';
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface CourseFilters {
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'rating' | 'price';
  isPublished?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CourseVideoFilters {
  search?: string;
  courseId?: string;
  moduleId?: string;
  chapterId?: string;
  isPublished?: boolean;
  sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'duration' | 'order';
  page?: number;
  limit?: number;
}

export interface VideoCommentFilters {
  videoId: string;
  parentCommentId?: string;
  page?: number;
  limit?: number;
}

// Form types for creating/editing entities
export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  categoryId: string;
  substackUrl?: string;
  featuredImage?: string;
  tags?: string[];
  videoId?: string;
  isPublished?: boolean;
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

export interface CreateBlogCategoryData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBlogCategoryData extends Partial<CreateBlogCategoryData> {
  id: string;
}

export interface CreateVideoData {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  categoryIds: string[];
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  blogPostId: string;
}

export interface UpdateVideoData extends Partial<CreateVideoData> {
  id: string;
}

export interface CreateCourseData {
  title: string;
  slug: string;
  description: string;
  banner?: string;
  isPublished?: boolean;
  price?: number;
  currency?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  id: string;
}

export interface CreateCourseModuleData {
  title: string;
  description: string;
  banner?: string;
  orderIndex: number;
  courseId: string;
}

export interface UpdateCourseModuleData extends Partial<CreateCourseModuleData> {
  id: string;
}

export interface CreateCourseChapterData {
  title: string;
  description: string;
  orderIndex: number;
  moduleId: string;
}

export interface UpdateCourseChapterData extends Partial<CreateCourseChapterData> {
  id: string;
}

export interface CreateCourseVideoData {
  title: string;
  slug: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  orderIndex?: number;
  isPublished?: boolean;
}

export interface UpdateCourseVideoData extends Partial<CreateCourseVideoData> {
  id: string;
}

export interface CreateVideoCommentData {
  content: string;
  parentCommentId?: string;
}

export interface UpdateVideoCommentData {
  content?: string;
}

export interface CreateVideoRatingData {
  rating: number; // 1-5 stars
}

export interface UpdateVideoRatingData {
  rating: number; // 1-5 stars
}

export interface CreateCommentData {
  content: string;
  videoId: string;
  parentCommentId?: string;
}

export interface CreateRatingData {
  videoId: string;
  stars: number;
  review?: string;
}

// Type guards
export function isVideoCategory(obj: any): obj is VideoCategory {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && 
         ['band', 'instrument', 'genre', 'vibe'].includes(obj.type);
}

export function isBlogCategory(obj: any): obj is BlogCategory {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

export function isVideo(obj: any): obj is Video {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string' && 
         Array.isArray(obj.categories) && typeof obj.blogPostId === 'string';
}

export function isBlogPost(obj: any): obj is BlogPost {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string' && 
         typeof obj.content === 'string' && typeof obj.categoryId === 'string';
}

export function isCourse(obj: any): obj is Course {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string' && 
         typeof obj.description === 'string' && Array.isArray(obj.modules);
}
