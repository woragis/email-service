'use client';

import React from 'react';
import { FaInstagram, FaTiktok, FaYoutube, FaPlay } from 'react-icons/fa';
import { Card, CardHeader, CardBody, CardFooter } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Video } from '../../../types/platform';
import './VideoCard.css';
import Image from 'next/image';

export interface VideoCardProps {
  video: Video;
  className?: string;
  onClick?: (video: Video) => void;
  showBlogLink?: boolean;
  showCourseLink?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  className = '',
  onClick,
  showBlogLink = true,
  showCourseLink = true
}) => {
  const handleClick = () => {
    onClick?.(video);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <FaInstagram />;
      case 'tiktok': return <FaTiktok />;
      case 'youtube': return <FaYoutube />;
      default: return <FaPlay />;
    }
  };

  return (
    <Card
      variant="video"
      clickable={!!onClick}
      className={`video-card ${className}`}
      onClick={handleClick}
    >
      {/* Video Thumbnail */}
      {video.thumbnail && (
        <div className="video-thumbnail">
          <Image
            src={video.thumbnail}
            alt={video.title}
            className="video-thumbnail-image"
            width={400}
            height={200}
          />
          {video.duration && (
            <div className="video-duration">
              {formatDuration(video.duration)}
            </div>
          )}
          <div className="video-play-overlay">
            <div className="play-button">
              <FaPlay />
            </div>
          </div>
        </div>
      )}

      <CardHeader>
        <h3 className="video-title">{video.title}</h3>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
      </CardHeader>

      <CardBody>
        {/* Categories */}
        {video.categories.length > 0 && (
          <div className="video-categories">
            {video.categories.map((category) => (
              <Badge
                key={category.id}
                variant="video"
                size="sm"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Platform Links */}
        <div className="video-platforms">
          {video.instagramUrl && (
            <a
              href={video.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="platform-icon">{getPlatformIcon('instagram')}</span>
              <span className="platform-name">Instagram</span>
            </a>
          )}
          {video.tiktokUrl && (
            <a
              href={video.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="platform-icon">{getPlatformIcon('tiktok')}</span>
              <span className="platform-name">TikTok</span>
            </a>
          )}
          {video.youtubeUrl && (
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="platform-icon">{getPlatformIcon('youtube')}</span>
              <span className="platform-name">YouTube</span>
            </a>
          )}
        </div>
      </CardBody>

      <CardFooter>
        <div className="video-meta">
          <span className="video-date">
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
          {video.blogPost && showBlogLink && (
            <a
              href={`/blog/${video.blogPost.slug}`}
              className="video-blog-link"
              onClick={(e) => e.stopPropagation()}
            >
              Read Blog Post
            </a>
          )}
          {video.courseChapter && showCourseLink && (
            <a
              href={`/courses/${video.courseChapter.module?.courseId}/chapter/${video.courseChapter.id}`}
              className="video-course-link"
              onClick={(e) => e.stopPropagation()}
            >
              View in Course
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
