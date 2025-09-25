import { Video, CreateVideoData, UpdateVideoData, VideoFilters } from '@/types/platform';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class VideoApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/videos`;
  }

  async createVideo(data: CreateVideoData): Promise<Video> {
    const response = await fetch(`${this.baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create video: ${response.statusText}`);
    }

    const result: ApiResponse<Video> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create video');
    }
    return result.data;
  }

  async getVideoById(id: string): Promise<Video> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const result: ApiResponse<Video> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch video');
    }
    return result.data;
  }

  async getVideoBySlug(slug: string): Promise<Video> {
    const response = await fetch(`${this.baseUrl}/slug/${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const result: ApiResponse<Video> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch video');
    }
    return result.data;
  }

  async listVideos(filters: VideoFilters = {}): Promise<Video[]> {
    const params = new URLSearchParams();
    
    if (filters.categories) {
      filters.categories.forEach(categoryId => {
        params.append('categories', categoryId);
      });
    }
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${this.baseUrl}/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.statusText}`);
    }

    const result: ApiResponse<Video[]> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch videos');
    }
    return result.data;
  }

  async updateVideo(id: string, data: UpdateVideoData): Promise<Video> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update video: ${response.statusText}`);
    }

    const result: ApiResponse<Video> = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to update video');
    }
    return result.data;
  }

  async deleteVideo(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete video: ${response.statusText}`);
    }
  }
}

export const videoApi = new VideoApi();
