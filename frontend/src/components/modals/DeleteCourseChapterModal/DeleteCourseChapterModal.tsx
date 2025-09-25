'use client';

import React from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { Modal } from '../../ui';
import { useDeleteCourseChapter } from '@/hooks/course';
import { CourseChapter } from '@/types/platform';
import './DeleteCourseChapterModal.css';

export interface DeleteCourseChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  chapter: CourseChapter;
}

export const DeleteCourseChapterModal: React.FC<DeleteCourseChapterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  chapter
}) => {
  const deleteCourseChapter = useDeleteCourseChapter();

  const handleDelete = async () => {
    try {
      await deleteCourseChapter.mutateAsync(chapter.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete course chapter:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Chapter"
      size="md"
    >
      <div className="delete-course-chapter-modal">
        <div className="delete-warning">
          <div className="warning-icon">
            <FaExclamationTriangle />
          </div>
          <div className="warning-content">
            <h3>Are you sure you want to delete this chapter?</h3>
            <p>
              This action cannot be undone.               This will permanently delete the chapter
              <strong> &quot;{chapter.title}&quot;</strong> and all its associated content.
            </p>
          </div>
        </div>

        <div className="chapter-details">
          <h4>Chapter Details:</h4>
          <ul>
            <li><strong>Title:</strong> {chapter.title}</li>
            <li><strong>Order:</strong> {chapter.order}</li>
          </ul>
        </div>

        <div className="delete-consequences">
          <h4>This will also delete:</h4>
          <ul>
            <li>All chapter content and materials</li>
            <li>Student progress data for this chapter</li>
          </ul>
        </div>
      </div>
      
      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={deleteCourseChapter.isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="btn btn-danger"
          disabled={deleteCourseChapter.isPending}
        >
          <FaTrash className="btn-icon" />
          {deleteCourseChapter.isPending ? 'Deleting...' : 'Delete Chapter'}
        </button>
      </div>
    </Modal>
  );
};
