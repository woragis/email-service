import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { videoApi } from '@/lib/api';
import { Video, CreateVideoData, UpdateVideoData, VideoFilters } from '@/types/platform';

export const useVideos = (filters: VideoFilters = {}) => {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => videoApi.listVideos(filters),
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoApi.getVideoById(id),
    enabled: !!id,
  });
};

export const useVideoBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['video', 'slug', slug],
    queryFn: () => videoApi.getVideoBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVideoData) => videoApi.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoData }) =>
      videoApi.updateVideo(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => videoApi.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};
