'use client';

import React from 'react';
import { FaBook, FaVideo, FaUsers, FaCalendar, FaStar } from 'react-icons/fa';
import { Card, CardHeader, CardBody, CardFooter } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Course } from '../../../types/platform';
import './CourseCard.css';
import Image from 'next/image';

export interface CourseCardProps {
  course: Course;
  className?: string;
  onClick?: (course: Course) => void;
  showProgress?: boolean;
  progress?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  className = '',
  onClick,
  showProgress = false,
  progress = 0
}) => {
  const handleClick = () => {
    onClick?.(course);
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const getModuleCount = () => {
    return course.modules.length;
  };

  const getTotalChapters = () => {
    return course.modules.reduce((total, module) => {
      return total + module.chapters.length;
    }, 0);
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    const stars = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < stars ? 'star-filled' : 'star-empty'} />
    ));
  };

  return (
    <Card
      variant="course"
      clickable={!!onClick}
      className={`course-card ${className}`}
      onClick={handleClick}
    >
      {/* Course Banner */}
      {course.banner && (
        <div className="course-banner">
          <Image
            src={course.banner}
            alt={course.title}
            className="course-banner-image"
            width={400}
            height={200}
          />
          <div className="course-badge">
            <Badge variant="course" size="sm">
              Course
            </Badge>
          </div>
          {showProgress && (
            <div className="course-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      )}

      <CardHeader>
        <div className="course-meta">
          <div className="course-stats">
            <span className="course-stat">
              <span className="stat-icon"><FaBook /></span>
              <span className="stat-text">{getModuleCount()} modules</span>
            </span>
            <span className="course-stat">
              <span className="stat-icon"><FaVideo /></span>
              <span className="stat-text">{getTotalChapters()} chapters</span>
            </span>
          </div>
          {course.rating && (
            <div className="course-rating">
              <span className="rating-stars">{getRatingStars(course.rating)}</span>
              <span className="rating-value">({course.rating.toFixed(1)})</span>
            </div>
          )}
        </div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
      </CardHeader>

      <CardBody>
        {/* Course Stats */}
        <div className="course-details">
          {course.totalStudents && (
            <div className="course-detail">
              <span className="detail-icon"><FaUsers /></span>
              <span className="detail-text">
                {course.totalStudents.toLocaleString()} students
              </span>
            </div>
          )}
          {course.publishedAt && (
            <div className="course-detail">
              <span className="detail-icon"><FaCalendar /></span>
              <span className="detail-text">
                {new Date(course.publishedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardBody>

      <CardFooter>
        <div className="course-footer">
          <div className="course-price">
            <span className="price-amount">
              {formatPrice(course.price, course.currency)}
            </span>
            {course.price && (
              <span className="price-period">one-time</span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {course.price ? 'Enroll Now' : 'Start Free'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
