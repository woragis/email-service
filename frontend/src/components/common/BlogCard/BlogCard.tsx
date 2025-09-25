'use client';

import React from 'react';
import { FaBookOpen, FaVideo, FaEdit } from 'react-icons/fa';
import { Card, CardHeader, CardBody, CardFooter } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { BlogPost } from '../../../types/platform';
import './BlogCard.css';
import Image from 'next/image';

export interface BlogCardProps {
  blogPost: BlogPost;
  className?: string;
  onClick?: (blogPost: BlogPost) => void;
  showVideoLink?: boolean;
  showSubstackLink?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blogPost,
  className = '',
  onClick,
  showVideoLink = true,
  showSubstackLink = true
}) => {
  const handleClick = () => {
    onClick?.(blogPost);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <Card
      variant="blog"
      clickable={!!onClick}
      className={`blog-card ${className}`}
      onClick={handleClick}
    >
      {/* Featured Image */}
      {blogPost.featuredImage && (
        <div className="blog-image">
          <Image
            src={blogPost.featuredImage}
            alt={blogPost.title}
            className="blog-image-content"
            width={400}
            height={200}
          />
        </div>
      )}

      <CardHeader>
        <div className="blog-meta">
          {blogPost.category && (
            <Badge variant="blog" size="sm">
              {blogPost.category.name}
            </Badge>
          )}
          <span className="blog-date">
            {blogPost.publishedAt ? formatDate(blogPost.publishedAt) : 'Draft'}
          </span>
        </div>
        <h3 className="blog-title">{blogPost.title}</h3>
        {blogPost.excerpt && (
          <p className="blog-excerpt">{blogPost.excerpt}</p>
        )}
      </CardHeader>

      <CardBody>
        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="blog-tags">
            {blogPost.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                size="sm"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Reading Time */}
        <div className="blog-reading-time">
          <span className="reading-time-icon"><FaBookOpen /></span>
          <span className="reading-time-text">
            {getReadingTime(blogPost.content)}
          </span>
        </div>
      </CardBody>

      <CardFooter>
        <div className="blog-actions">
          <div className="blog-links">
            {blogPost.video && showVideoLink && (
              <a
                href={`/videos/${blogPost.video.slug}`}
                className="blog-video-link"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="link-icon"><FaVideo /></span>
                <span className="link-text">Watch Video</span>
              </a>
            )}
            {blogPost.substackUrl && showSubstackLink && (
              <a
                href={blogPost.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-substack-link"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="link-icon"><FaEdit /></span>
                <span className="link-text">Read on Substack</span>
              </a>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Read More
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
