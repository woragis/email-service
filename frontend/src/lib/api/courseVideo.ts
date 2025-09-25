import { 
  CourseVideo, 
  CreateCourseVideoData, 
  UpdateCourseVideoData, 
  CourseVideoFilters,
  VideoComment,
  CreateVideoCommentData,
  UpdateVideoCommentData,
  VideoCommentFilters,
  VideoRating,
  CreateVideoRatingData,
  VideoRatingStats
} from '@/types/platform';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class CourseVideoApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/course-videos`;
  }

  // Course Video CRUD operations
  async createCourseVideo(
    courseId: string,
    moduleId: string,
    chapterId: string,
    data: CreateCourseVideoData
  ): Promise<CourseVideo> {
    const response = await fetch(
      `${this.baseUrl}/courses/${courseId}/modules/${moduleId}/chapters/${chapterId}/videos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create course video: ${response.statusText}`);
    }

    return response.json();
  }

  async getCourseVideoById(id: string): Promise<CourseVideo> {
    const response = await fetch(`${this.baseUrl}/videos/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch course video: ${response.statusText}`);
    }

    return response.json();
  }

  async getCourseVideoBySlug(slug: string): Promise<CourseVideo> {
    const response = await fetch(`${this.baseUrl}/videos/slug/${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch course video: ${response.statusText}`);
    }

    return response.json();
  }

  async getCourseVideoWithStats(id: string): Promise<CourseVideo> {
    const response = await fetch(`${this.baseUrl}/videos/${id}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch course video stats: ${response.statusText}`);
    }

    return response.json();
  }

  async listCourseVideos(filters: CourseVideoFilters = {}): Promise<CourseVideo[]> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.courseId) params.append('courseId', filters.courseId);
    if (filters.moduleId) params.append('moduleId', filters.moduleId);
    if (filters.chapterId) params.append('chapterId', filters.chapterId);
    if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${this.baseUrl}/videos?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch course videos: ${response.statusText}`);
    }

    return response.json();
  }

  async updateCourseVideo(id: string, data: UpdateCourseVideoData): Promise<CourseVideo> {
    const response = await fetch(`${this.baseUrl}/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update course video: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteCourseVideo(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/videos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete course video: ${response.statusText}`);
    }
  }

  // Video Comment operations
  async createVideoComment(
    videoId: string,
    data: CreateVideoCommentData
  ): Promise<VideoComment> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create video comment: ${response.statusText}`);
    }

    return response.json();
  }

  async listVideoComments(filters: VideoCommentFilters): Promise<VideoComment[]> {
    const params = new URLSearchParams();
    
    if (filters.parentCommentId) params.append('parentCommentId', filters.parentCommentId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(
      `${this.baseUrl}/videos/${filters.videoId}/comments?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch video comments: ${response.statusText}`);
    }

    return response.json();
  }

  async updateVideoComment(id: string, data: UpdateVideoCommentData): Promise<VideoComment> {
    const response = await fetch(`${this.baseUrl}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update video comment: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteVideoComment(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/comments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete video comment: ${response.statusText}`);
    }
  }

  // Video Comment Like operations
  async likeVideoComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}/like`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to like video comment: ${response.statusText}`);
    }
  }

  async unlikeVideoComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}/like`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to unlike video comment: ${response.statusText}`);
    }
  }

  // Video Rating operations
  async createVideoRating(
    videoId: string,
    data: CreateVideoRatingData
  ): Promise<VideoRating> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create video rating: ${response.statusText}`);
    }

    return response.json();
  }

  async getVideoRating(videoId: string): Promise<VideoRating | null> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}/ratings`);

    if (!response.ok) {
      throw new Error(`Failed to fetch video rating: ${response.statusText}`);
    }

    return response.json();
  }

  async getVideoRatingStats(videoId: string): Promise<VideoRatingStats> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}/ratings/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch video rating stats: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteVideoRating(videoId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}/ratings`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete video rating: ${response.statusText}`);
    }
  }
}

export const courseVideoApi = new CourseVideoApi();
