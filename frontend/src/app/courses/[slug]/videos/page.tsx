'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaPlay, FaClock, FaEye, FaStar, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Skeleton } from '@/components/ui';
import { 
  useCourseVideos,
  useDeleteCourseVideo
} from '@/hooks';
import { CourseVideo, CourseVideoFilters } from '@/types/platform';
import Image from 'next/image';

export default function CourseVideosPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;

  const [filters, setFilters] = useState<CourseVideoFilters>({
    courseId: undefined, // We'll need to get this from the course slug
    isPublished: true,
    sortBy: 'order',
    page: 1,
    limit: 20
  });

  const { data: videos = [], isLoading, error } = useCourseVideos(filters);
  const deleteVideoMutation = useDeleteCourseVideo();

  const handleVideoClick = (video: CourseVideo) => {
    router.push(`/courses/${courseSlug}/videos/${video.slug}`);
  };

  const handleDeleteVideo = async (video: CourseVideo) => {
    if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
      try {
        await deleteVideoMutation.mutateAsync(video.id);
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="course-videos-page">
        <div className="container">
          <div className="videos-header-skeleton">
            <Skeleton height="100px" />
          </div>
          <div className="videos-grid-skeleton">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} height="200px" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-videos-page">
        <div className="container">
          <div className="error-state">
            <h2>Error loading videos</h2>
            <p>There was an error loading the course videos. Please try again.</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-videos-page">
      <div className="container">
        {/* Page Header */}
        <section className="videos-header">
          <div className="videos-header-content">
            <h1 className="videos-title">Course Videos</h1>
            <p className="videos-description">
              Watch and learn from our comprehensive video collection
            </p>
          </div>
          
          <div className="videos-actions">
            <Button
              variant="primary"
              onClick={() => router.push(`/courses/${courseSlug}/videos/new`)}
              icon={<FaPlus />}
            >
              Add Video
            </Button>
          </div>
        </section>

        {/* Filters */}
        <section className="videos-filters">
          <div className="filters-content">
            <div className="filter-group">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={filters.sortBy || 'order'}
                onChange={handleSortChange}
                className="filter-select"
              >
                <option value="order">Order</option>
                <option value="title">Title</option>
                <option value="createdAt">Date Created</option>
                <option value="publishedAt">Date Published</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </section>

        {/* Videos Grid */}
        <section className="videos-grid-section">
          {videos.length > 0 ? (
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail" onClick={() => handleVideoClick(video)}>
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width={400}
                        height={225}
                        className="thumbnail-image"
                      />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <FaPlay className="play-icon" />
                      </div>
                    )}
                    
                    <div className="video-overlay">
                      <div className="play-button">
                        <FaPlay />
                      </div>
                      <div className="video-duration">
                        {formatDuration(video.durationSeconds)}
                      </div>
                    </div>
                  </div>

                  <div className="video-info">
                    <h3 className="video-title" onClick={() => handleVideoClick(video)}>
                      {video.title}
                    </h3>
                    
                    {video.description && (
                      <p className="video-description">
                        {video.description.length > 100 
                          ? `${video.description.substring(0, 100)}...` 
                          : video.description
                        }
                      </p>
                    )}

                    <div className="video-meta">
                      <div className="video-stats">
                        <span className="stat">
                          <FaEye />
                          {video.totalComments || 0} comments
                        </span>
                        {video.averageRating && (
                          <span className="stat">
                            <FaStar />
                            {video.averageRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      
                      <div className="video-status">
                        <span className={`status ${video.isPublished ? 'published' : 'draft'}`}>
                          {video.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <div className="video-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/courses/${courseSlug}/videos/${video.slug}/edit`)}
                        icon={<FaEdit />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVideo(video)}
                        icon={<FaTrash />}
                        className="delete-button"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-videos">
              <div className="no-videos-content">
                <FaPlay className="no-videos-icon" />
                <h3>No videos yet</h3>
                <p>Start building your course by adding your first video.</p>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/courses/${courseSlug}/videos/new`)}
                  icon={<FaPlus />}
                >
                  Add First Video
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
