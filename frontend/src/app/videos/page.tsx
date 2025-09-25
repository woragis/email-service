'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaPlay } from 'react-icons/fa';
import { Button, Input, Select, SkeletonVideoCard } from '../../components/ui';
import { VideoCard } from '../../components/common';
import { useVideos } from '@/hooks/video';
import { Video, VideoFilters } from '../../types/platform';

export default function VideosPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<VideoFilters>({
    search: '',
    categories: [],
    type: undefined,
    sortBy: 'newest',
    page: 1,
    limit: 20
  });

  const { data: videos = [], isLoading, error } = useVideos(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      categories: value ? [value] : []
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
  };

  const handleVideoClick = (video: Video) => {
    router.push(`/videos/${video.slug}`);
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
  };

  return (
    <div className="videos-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Videos</h1>
            <p className="page-description">
              Discover jazz tutorials, performances, and educational content from our community
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            <div className="filters-row">
              <div className="filter-group">
                <Input
                  type="search"
                  placeholder="Search videos..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  icon={<FaSearch />}
                />
              </div>
              
              <div className="filter-group">
                <Select
                  placeholder="All Categories"
                  value={filters.categories?.[0] || ''}
                  onChange={handleCategoryChange}
                  options={[
                    { value: '', label: 'All Categories' },
                    { value: 'piano', label: 'Piano' },
                    { value: 'saxophone', label: 'Saxophone' },
                    { value: 'guitar', label: 'Guitar' },
                    { value: 'bass', label: 'Bass' },
                    { value: 'drums', label: 'Drums' },
                    { value: 'trumpet', label: 'Trumpet' },
                    { value: 'jazz', label: 'Jazz' },
                    { value: 'blues', label: 'Blues' },
                    { value: 'improvisation', label: 'Improvisation' }
                  ]}
                />
              </div>
              
              <div className="filter-group">
                <Select
                  placeholder="Sort by"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'popular', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="videos-section">
        <div className="container">
          {isLoading ? (
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonVideoCard key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon"><FaPlay /></div>
              <h3 className="error-title">Error loading videos</h3>
              <p className="error-description">
                There was an error loading the videos. Please try again.
              </p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : videos.length > 0 ? (
            <div className="video-card-grid">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={handleVideoClick}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><FaPlay /></div>
              <h3 className="empty-state-title">No videos found</h3>
              <p className="empty-state-description">
                {filters.search || filters.categories && filters.categories.length > 0
                  ? 'Try adjusting your search criteria or filters'
                  : 'Check back soon for new video content'
                }
              </p>
              <Button variant="primary">
                Explore All Content
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Load More Section */}
      {!isLoading && videos.length > 0 && (
        <section className="load-more-section">
          <div className="container">
            <div className="load-more-content">
              <Button variant="secondary" size="lg" onClick={handleLoadMore}>
                Load More Videos
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
