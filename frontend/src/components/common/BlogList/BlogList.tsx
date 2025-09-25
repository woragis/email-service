'use client';

import React from 'react';
import { BlogCard } from '../BlogCard';
import { BlogPost, BlogFilters } from '@/types/platform';
import { useBlogPosts } from '@/hooks/blog';
import { Skeleton } from '../../ui/Skeleton';
import './BlogList.css';

export interface BlogListProps {
  filters?: BlogFilters;
  className?: string;
  onBlogClick?: (blogPost: BlogPost) => void;
  showFeatured?: boolean;
  limit?: number;
}

export const BlogList: React.FC<BlogListProps> = ({
  filters,
  className = '',
  onBlogClick,
  showFeatured = false,
  limit
}) => {
  const { data, isLoading, error } = useBlogPosts(filters);

  if (isLoading) {
    return (
      <div className={`blog-list ${className}`}>
        <div className="blog-list-skeleton">
          {Array.from({ length: limit || 6 }).map((_, index) => (
            <Skeleton key={index} className="blog-card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`blog-list ${className}`}>
        <div className="blog-list-error">
          <p>Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className={`blog-list ${className}`}>
        <div className="blog-list-empty">
          <h3>No blog posts found</h3>
          <p>
            {filters?.search || filters?.categoryId
              ? 'Try adjusting your search criteria or filters'
              : 'Check back soon for new blog content'
            }
          </p>
        </div>
      </div>
    );
  }

  const posts = limit ? data.data.slice(0, limit) : data.data;
  const featuredPost = showFeatured ? posts[0] : null;
  const remainingPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <div className={`blog-list ${className}`}>
      {featuredPost && (
        <div className="blog-featured">
          <BlogCard
            blogPost={featuredPost}
            onClick={onBlogClick}
            className="blog-card-featured"
          />
        </div>
      )}
      
      <div className="blog-grid">
        {remainingPosts.map((blogPost) => (
          <BlogCard
            key={blogPost.id}
            blogPost={blogPost}
            onClick={onBlogClick}
          />
        ))}
      </div>
    </div>
  );
};
