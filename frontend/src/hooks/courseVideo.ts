import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseVideoApi } from '@/lib/api';
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

// Course Video hooks
export const useCourseVideos = (filters: CourseVideoFilters = {}) => {
  return useQuery({
    queryKey: ['courseVideos', filters],
    queryFn: () => courseVideoApi.listCourseVideos(filters),
  });
};

export const useCourseVideo = (id: string) => {
  return useQuery({
    queryKey: ['courseVideo', id],
    queryFn: () => courseVideoApi.getCourseVideoById(id),
    enabled: !!id,
  });
};

export const useCourseVideoBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['courseVideo', 'slug', slug],
    queryFn: () => courseVideoApi.getCourseVideoBySlug(slug),
    enabled: !!slug,
  });
};

export const useCourseVideoWithStats = (id: string) => {
  return useQuery({
    queryKey: ['courseVideo', 'stats', id],
    queryFn: () => courseVideoApi.getCourseVideoWithStats(id),
    enabled: !!id,
  });
};

export const useCreateCourseVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, chapterId, data }: {
      courseId: string;
      moduleId: string;
      chapterId: string;
      data: CreateCourseVideoData;
    }) => courseVideoApi.createCourseVideo(courseId, moduleId, chapterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseVideos'] });
    },
  });
};

export const useUpdateCourseVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseVideoData }) =>
      courseVideoApi.updateCourseVideo(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['courseVideo', id] });
      queryClient.invalidateQueries({ queryKey: ['courseVideos'] });
    },
  });
};

export const useDeleteCourseVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseVideoApi.deleteCourseVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseVideos'] });
    },
  });
};

// Video Comment hooks
export const useVideoComments = (filters: VideoCommentFilters) => {
  return useQuery({
    queryKey: ['videoComments', filters],
    queryFn: () => courseVideoApi.listVideoComments(filters),
    enabled: !!filters.videoId,
  });
};

export const useCreateVideoComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: CreateVideoCommentData }) =>
      courseVideoApi.createVideoComment(videoId, data),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['videoComments', { videoId }] });
    },
  });
};

export const useUpdateVideoComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoCommentData }) =>
      courseVideoApi.updateVideoComment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['videoComments'] });
    },
  });
};

export const useDeleteVideoComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseVideoApi.deleteVideoComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoComments'] });
    },
  });
};

// Video Comment Like hooks
export const useLikeVideoComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => courseVideoApi.likeVideoComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoComments'] });
    },
  });
};

export const useUnlikeVideoComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => courseVideoApi.unlikeVideoComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoComments'] });
    },
  });
};

// Video Rating hooks
export const useVideoRating = (videoId: string) => {
  return useQuery({
    queryKey: ['videoRating', videoId],
    queryFn: () => courseVideoApi.getVideoRating(videoId),
    enabled: !!videoId,
  });
};

export const useVideoRatingStats = (videoId: string) => {
  return useQuery({
    queryKey: ['videoRatingStats', videoId],
    queryFn: () => courseVideoApi.getVideoRatingStats(videoId),
    enabled: !!videoId,
  });
};

export const useCreateVideoRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: CreateVideoRatingData }) =>
      courseVideoApi.createVideoRating(videoId, data),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['videoRating', videoId] });
      queryClient.invalidateQueries({ queryKey: ['videoRatingStats', videoId] });
    },
  });
};

export const useDeleteVideoRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => courseVideoApi.deleteVideoRating(videoId),
    onSuccess: (videoId) => {
      queryClient.invalidateQueries({ queryKey: ['videoRating', videoId] });
      queryClient.invalidateQueries({ queryKey: ['videoRatingStats', videoId] });
    },
  });
};
