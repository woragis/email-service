import React from 'react';
import './Skeleton.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'video' | 'blog' | 'course';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}) => {
  const baseClasses = 'skeleton';
  const variantClasses = `skeleton-${variant}`;
  const animationClasses = `skeleton-${animation}`;

  const classes = [
    baseClasses,
    variantClasses,
    animationClasses,
    className
  ].filter(Boolean).join(' ');

  const skeletonStyle = {
    width: width || undefined,
    height: height || undefined,
    ...style
  };

  return (
    <div
      className={classes}
      style={skeletonStyle}
      {...props}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = ''
}) => {
  return (
    <div className={`skeleton-text-container ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height="1em"
          width={index === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`skeleton-card ${className}`}>
      <Skeleton variant="rectangular" height="200px" />
      <div className="skeleton-card-content">
        <Skeleton variant="text" height="1.5em" width="80%" />
        <Skeleton variant="text" height="1em" width="100%" />
        <Skeleton variant="text" height="1em" width="60%" />
        <div className="skeleton-card-footer">
          <Skeleton variant="text" height="1em" width="40%" />
          <Skeleton variant="rectangular" height="32px" width="100px" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonVideoCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`skeleton-video-card ${className}`}>
      <Skeleton variant="rectangular" height="200px" />
      <div className="skeleton-card-content">
        <Skeleton variant="text" height="1.5em" width="90%" />
        <Skeleton variant="text" height="1em" width="100%" />
        <Skeleton variant="text" height="1em" width="80%" />
        <div className="skeleton-badges">
          <Skeleton variant="rectangular" height="24px" width="60px" />
          <Skeleton variant="rectangular" height="24px" width="80px" />
        </div>
        <div className="skeleton-platforms">
          <Skeleton variant="rectangular" height="32px" width="100px" />
          <Skeleton variant="rectangular" height="32px" width="100px" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonBlogCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`skeleton-blog-card ${className}`}>
      <Skeleton variant="rectangular" height="200px" />
      <div className="skeleton-card-content">
        <div className="skeleton-meta">
          <Skeleton variant="rectangular" height="24px" width="80px" />
          <Skeleton variant="text" height="1em" width="120px" />
        </div>
        <Skeleton variant="text" height="1.5em" width="85%" />
        <Skeleton variant="text" height="1em" width="100%" />
        <Skeleton variant="text" height="1em" width="70%" />
        <div className="skeleton-tags">
          <Skeleton variant="rectangular" height="20px" width="50px" />
          <Skeleton variant="rectangular" height="20px" width="60px" />
          <Skeleton variant="rectangular" height="20px" width="40px" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonCourseCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`skeleton-course-card ${className}`}>
      <Skeleton variant="rectangular" height="200px" />
      <div className="skeleton-card-content">
        <div className="skeleton-meta">
          <Skeleton variant="text" height="1em" width="100px" />
          <Skeleton variant="text" height="1em" width="80px" />
        </div>
        <Skeleton variant="text" height="1.5em" width="90%" />
        <Skeleton variant="text" height="1em" width="100%" />
        <Skeleton variant="text" height="1em" width="75%" />
        <div className="skeleton-stats">
          <Skeleton variant="text" height="1em" width="120px" />
          <Skeleton variant="text" height="1em" width="100px" />
        </div>
        <div className="skeleton-footer">
          <Skeleton variant="text" height="1.5em" width="80px" />
          <Skeleton variant="rectangular" height="36px" width="120px" />
        </div>
      </div>
    </div>
  );
};
