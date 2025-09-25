'use client';

import React from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { Modal } from '../../ui';
import { useDeleteCourse } from '@/hooks/course';
import { Course } from '@/types/platform';
import './DeleteCourseModal.css';

export interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  course: Course;
}

export const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  course
}) => {
  const deleteCourse = useDeleteCourse();

  const handleDelete = async () => {
    try {
      await deleteCourse.mutateAsync(course.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Course"
      size="md"
    >
      <div className="delete-course-modal">
        <div className="delete-warning">
          <div className="warning-icon">
            <FaExclamationTriangle />
          </div>
          <div className="warning-content">
            <h3>Are you sure you want to delete this course?</h3>
            <p>
              This action cannot be undone.               This will permanently delete the course
              <strong> &quot;{course.title}&quot;</strong> and all its associated modules and chapters.
            </p>
          </div>
        </div>

        <div className="course-details">
          <h4>Course Details:</h4>
          <ul>
            <li><strong>Title:</strong> {course.title}</li>
            <li><strong>Modules:</strong> {course.modules?.length || 0}</li>
            <li><strong>Status:</strong> {course.isPublished ? 'Published' : 'Draft'}</li>
          </ul>
        </div>

        <div className="delete-consequences">
          <h4>This will also delete:</h4>
          <ul>
            <li>All course modules</li>
            <li>All course chapters</li>
            <li>All course content and materials</li>
            <li>Student enrollment data</li>
          </ul>
        </div>
      </div>
      
      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={deleteCourse.isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="btn btn-danger"
          disabled={deleteCourse.isPending}
        >
          <FaTrash className="btn-icon" />
          {deleteCourse.isPending ? 'Deleting...' : 'Delete Course'}
        </button>
      </div>
    </Modal>
  );
};
