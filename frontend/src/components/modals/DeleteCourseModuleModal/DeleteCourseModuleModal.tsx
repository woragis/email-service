'use client';

import React from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { Modal } from '../../ui';
import { useDeleteCourseModule } from '@/hooks/course';
import { CourseModule } from '@/types/platform';
import './DeleteCourseModuleModal.css';

export interface DeleteCourseModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  module: CourseModule;
}

export const DeleteCourseModuleModal: React.FC<DeleteCourseModuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  module
}) => {
  const deleteCourseModule = useDeleteCourseModule();

  const handleDelete = async () => {
    try {
      await deleteCourseModule.mutateAsync(module.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete course module:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Module"
      size="md"
    >
      <div className="delete-course-module-modal">
        <div className="delete-warning">
          <div className="warning-icon">
            <FaExclamationTriangle />
          </div>
          <div className="warning-content">
            <h3>Are you sure you want to delete this module?</h3>
            <p>
              This action cannot be undone.               This will permanently delete the module
              <strong> &quot;{module.title}&quot;</strong> and all its associated chapters.
            </p>
          </div>
        </div>

        <div className="module-details">
          <h4>Module Details:</h4>
          <ul>
            <li><strong>Title:</strong> {module.title}</li>
            <li><strong>Order:</strong> {module.order}</li>
            <li><strong>Chapters:</strong> {module.chapters?.length || 0}</li>
          </ul>
        </div>

        <div className="delete-consequences">
          <h4>This will also delete:</h4>
          <ul>
            <li>All module chapters</li>
            <li>All chapter content and materials</li>
            <li>Student progress data for this module</li>
          </ul>
        </div>
      </div>
      
      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={deleteCourseModule.isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="btn btn-danger"
          disabled={deleteCourseModule.isPending}
        >
          <FaTrash className="btn-icon" />
          {deleteCourseModule.isPending ? 'Deleting...' : 'Delete Module'}
        </button>
      </div>
    </Modal>
  );
};
