'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus, FaBook, FaVideo, FaUsers, FaStar, FaPlay } from 'react-icons/fa';
import { Button, Skeleton } from '@/components/ui';
import { 
  CreateCourseModuleModal, 
  EditCourseModal, 
  DeleteCourseModal,
  CreateCourseChapterModal,
  EditCourseModuleModal,
  DeleteCourseModuleModal,
  EditCourseChapterModal,
  DeleteCourseChapterModal
} from '@/components/modals';
import { useCourseWithModulesBySlug } from '@/hooks/course';
import { Course, CourseModule, CourseChapter } from '@/types/platform';
import Image from 'next/image';

export default function CourseDetailBySlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModuleModalOpen, setIsCreateModuleModalOpen] = useState(false);
  const [isCreateChapterModalOpen, setIsCreateChapterModalOpen] = useState(false);
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [isDeleteModuleModalOpen, setIsDeleteModuleModalOpen] = useState(false);
  const [isEditChapterModalOpen, setIsEditChapterModalOpen] = useState(false);
  const [isDeleteChapterModalOpen, setIsDeleteChapterModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<CourseChapter | null>(null);

  const { data: course, isLoading, error } = useCourseWithModulesBySlug(slug);

  const handleEditCourse = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteCourse = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCreateModule = () => {
    setIsCreateModuleModalOpen(true);
  };

  const handleEditModule = (module: CourseModule) => {
    setSelectedModule(module);
    setIsEditModuleModalOpen(true);
  };

  const handleDeleteModule = (module: CourseModule) => {
    setSelectedModule(module);
    setIsDeleteModuleModalOpen(true);
  };

  const handleCreateChapter = (moduleId: string) => {
    setSelectedModule({ id: moduleId } as CourseModule);
    setIsCreateChapterModalOpen(true);
  };

  const handleEditChapter = (chapter: CourseChapter) => {
    setSelectedChapter(chapter);
    setIsEditChapterModalOpen(true);
  };

  const handleDeleteChapter = (chapter: CourseChapter) => {
    setSelectedChapter(chapter);
    setIsDeleteChapterModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    router.push('/courses');
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const getTotalChapters = () => {
    if (!course?.modules) return 0;
    return course.modules.reduce((total, module) => {
      return total + (module.chapters?.length || 0);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="course-detail-page">
        <div className="container">
          <div className="course-header-skeleton">
            <Skeleton height="200px" />
          </div>
          <div className="course-content-skeleton">
            <Skeleton height="400px" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Course not found</h2>
            <p>The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.push('/courses')}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="container">
        {/* Course Header */}
        <section className="course-header">
          <div className="course-header-content">
            <div className="course-banner">
              {course.banner ? (
                <Image src={course.banner} alt={course.title} width={800} height={400} />
              ) : (
                <div className="course-banner-placeholder">
                  <span>🎹</span>
                </div>
              )}
            </div>
            
            <div className="course-info">
              <div className="course-meta">
                <div className="course-stats">
                  <div className="course-stat">
                    <FaBook />
                    <span>{course.modules?.length || 0} modules</span>
                  </div>
                  <div className="course-stat">
                    <FaVideo />
                    <span>{getTotalChapters()} chapters</span>
                  </div>
                  {course.totalStudents && (
                    <div className="course-stat">
                      <FaUsers />
                      <span>{course.totalStudents.toLocaleString()} students</span>
                    </div>
                  )}
                  {course.rating && (
                    <div className="course-stat">
                      <FaStar />
                      <span>{course.rating.toFixed(1)} rating</span>
                    </div>
                  )}
                </div>
                
                <div className="course-actions">
                  <Button
                    variant="secondary"
                    onClick={handleEditCourse}
                    icon={<FaEdit />}
                  >
                    Edit Course
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteCourse}
                    icon={<FaTrash />}
                  >
                    Delete Course
                  </Button>
                </div>
              </div>
              
              <h1 className="course-title">{course.title}</h1>
              <p className="course-description">{course.description}</p>
              
              <div className="course-footer">
                <div className="course-price">
                  <span className="price-amount">
                    {formatPrice(course.price, course.currency)}
                  </span>
                  {course.price && (
                    <span className="price-period">one-time</span>
                  )}
                </div>
                <div className="course-status">
                  <span className={`status ${course.isPublished ? 'published' : 'draft'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Modules */}
        <section className="course-modules">
          <div className="course-modules-header">
            <h2>Course Modules</h2>
            <Button
              variant="primary"
              onClick={handleCreateModule}
              icon={<FaPlus />}
            >
              Add Module
            </Button>
          </div>

          {course.modules && course.modules.length > 0 ? (
            <div className="modules-list">
              {course.modules.map((module) => (
                <div key={module.id} className="module-card">
                  <div className="module-header">
                    <div className="module-info">
                      <h3 className="module-title">{module.title}</h3>
                      <p className="module-description">{module.description}</p>
                      <div className="module-meta">
                        <span className="module-order">Module {module.order}</span>
                        <span className="module-chapters">
                          {module.chapters?.length || 0} chapters
                        </span>
                      </div>
                    </div>
                    <div className="module-actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditModule(module)}
                        icon={<FaEdit />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteModule(module)}
                        icon={<FaTrash />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Module Chapters */}
                  {module.chapters && module.chapters.length > 0 && (
                    <div className="chapters-list">
                      <div className="chapters-header">
                        <h4>Chapters</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateChapter(module.id)}
                          icon={<FaPlus />}
                        >
                          Add Chapter
                        </Button>
                      </div>
                      {module.chapters.map((chapter) => (
                        <div key={chapter.id} className="chapter-item">
                          <div className="chapter-info">
                            <div className="chapter-title">
                              <FaPlay className="chapter-icon" />
                              <span>{chapter.title}</span>
                            </div>
                            {chapter.description && (
                              <p className="chapter-description">{chapter.description}</p>
                            )}
                            <div className="chapter-meta">
                              <span className="chapter-order">Chapter {chapter.order}</span>
                            </div>
                          </div>
                          <div className="chapter-actions">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditChapter(chapter)}
                              icon={<FaEdit />}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteChapter(chapter)}
                              icon={<FaTrash />}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!module.chapters || module.chapters.length === 0) && (
                    <div className="no-chapters">
                      <p>No chapters yet</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreateChapter(module.id)}
                        icon={<FaPlus />}
                      >
                        Add First Chapter
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-modules">
              <p>No modules yet. Create your first module to get started.</p>
              <Button
                variant="primary"
                onClick={handleCreateModule}
                icon={<FaPlus />}
              >
                Create First Module
              </Button>
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        course={course}
      />

      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        course={course}
      />

      <CreateCourseModuleModal
        isOpen={isCreateModuleModalOpen}
        onClose={() => setIsCreateModuleModalOpen(false)}
        courseId={course.id}
      />

      {selectedModule && (
        <>
          <EditCourseModuleModal
            isOpen={isEditModuleModalOpen}
            onClose={() => {
              setIsEditModuleModalOpen(false);
              setSelectedModule(null);
            }}
            module={selectedModule}
          />

          <DeleteCourseModuleModal
            isOpen={isDeleteModuleModalOpen}
            onClose={() => {
              setIsDeleteModuleModalOpen(false);
              setSelectedModule(null);
            }}
            module={selectedModule}
          />

          <CreateCourseChapterModal
            isOpen={isCreateChapterModalOpen}
            onClose={() => {
              setIsCreateChapterModalOpen(false);
              setSelectedModule(null);
            }}
            moduleId={selectedModule.id}
          />
        </>
      )}

      {selectedChapter && (
        <>
          <EditCourseChapterModal
            isOpen={isEditChapterModalOpen}
            onClose={() => {
              setIsEditChapterModalOpen(false);
              setSelectedChapter(null);
            }}
            chapter={selectedChapter}
          />

          <DeleteCourseChapterModal
            isOpen={isDeleteChapterModalOpen}
            onClose={() => {
              setIsDeleteChapterModalOpen(false);
              setSelectedChapter(null);
            }}
            chapter={selectedChapter}
          />
        </>
      )}
    </div>
  );
}
