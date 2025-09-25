'use client';

import { useState } from 'react';
import { FaSearch, FaBook, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, SkeletonCourseCard } from '@/components/ui';
import { CourseCard } from '@/components/common';
import { CreateCourseModal } from '@/components/modals';
import { useCourses } from '@/hooks/course';
import { Course, CourseFilters } from '@/types/platform';

export default function CoursesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    sortBy: 'newest',
    page: 1,
    limit: 12
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: coursesData, isLoading, error } = useCourses(filters);
  const courses = coursesData?.data || [];
  const loading = isLoading;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
  };

  const handleCourseClick = (course: Course) => {
    router.push(`/courses/slug/${course.slug}`);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // The query will automatically refetch due to invalidation in the hook
  };

  return (
    <div className="courses-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <div className="page-header-text">
              <h1 className="page-title">Courses</h1>
              <p className="page-description">
                Master jazz with structured learning paths designed by professional musicians
              </p>
            </div>
            <div className="page-header-actions">
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                icon={<FaPlus />}
              >
                Create Course
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course Section */}
      {!loading && courses.length > 0 && (
        <section className="featured-course-section">
          <div className="container">
            <div className="featured-course">
              <div className="featured-course-content">
                <div className="featured-course-badge">
                  <span>Featured Course</span>
                </div>
                <h2 className="featured-course-title">
                  Complete Jazz Piano Mastery
                </h2>
                <p className="featured-course-description">
                  Master jazz piano from fundamentals to advanced techniques with this comprehensive course. 
                  Learn from industry professionals and join thousands of successful students.
                </p>
                <div className="featured-course-stats">
                  <div className="course-stat">
                    <span className="stat-number">1,250</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="course-stat">
                    <span className="stat-number">4.8</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="course-stat">
                    <span className="stat-number">24</span>
                    <span className="stat-label">Lessons</span>
                  </div>
                </div>
                <div className="featured-course-actions">
                  <Button variant="primary" size="lg">
                    Enroll Now - $199
                  </Button>
                  <Button variant="ghost" size="lg">
                    Preview Course
                  </Button>
                </div>
              </div>
              <div className="featured-course-image">
                <div className="placeholder-image">
                  <span>🎹</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            <div className="filters-row">
              <div className="filter-group">
                <Input
                  type="search"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  icon={<FaSearch />}
                />
              </div>
              
              <div className="filter-group">
                <Select
                  placeholder="All Levels"
                  options={[
                    { value: '', label: 'All Levels' },
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' }
                  ]}
                />
              </div>
              
              <div className="filter-group">
                <Select
                  placeholder="All Instruments"
                  options={[
                    { value: '', label: 'All Instruments' },
                    { value: 'piano', label: 'Piano' },
                    { value: 'guitar', label: 'Guitar' },
                    { value: 'saxophone', label: 'Saxophone' },
                    { value: 'bass', label: 'Bass' },
                    { value: 'drums', label: 'Drums' },
                    { value: 'trumpet', label: 'Trumpet' }
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
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'price', label: 'Price: Low to High' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="courses-section">
        <div className="container">
          {loading ? (
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCourseCard key={index} />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="course-card-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><FaBook /></div>
              <h3 className="empty-state-title">No courses found</h3>
              <p className="empty-state-description">
                {filters.search
                  ? 'Try adjusting your search criteria'
                  : 'Check back soon for new course content'
                }
              </p>
              <Button variant="primary">
                Explore All Content
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="courses-cta-section">
        <div className="container">
          <div className="courses-cta-content">
            <h3 className="cta-title">Ready to Start Learning?</h3>
            <p className="cta-description">
              Join our community of musicians and start your jazz journey today
            </p>
            <div className="cta-actions">
              <Button variant="primary" size="lg">
                Browse All Courses
              </Button>
              <Button variant="secondary" size="lg">
                View Free Content
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Load More Section */}
      {!loading && courses.length > 0 && (
        <section className="load-more-section">
          <div className="container">
            <div className="load-more-content">
              <Button variant="secondary" size="lg">
                Load More Courses
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
