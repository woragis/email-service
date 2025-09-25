'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { CourseChapterForm } from '../../forms';
import { useCreateCourseChapter } from '@/hooks/course';
import { CreateCourseChapterData, UpdateCourseChapterData } from '@/types/platform';

export interface CreateCourseChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  moduleId: string;
}

export const CreateCourseChapterModal: React.FC<CreateCourseChapterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  moduleId
}) => {
  const createCourseChapter = useCreateCourseChapter();

  const handleSubmit = async (data: CreateCourseChapterData | UpdateCourseChapterData) => {
    try {
      // For create modal, we only handle CreateCourseChapterData
      const createData = data as CreateCourseChapterData;
      await createCourseChapter.mutateAsync({
        ...createData,
        moduleId
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create course chapter:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Chapter"
      size="lg"
    >
      <CourseChapterForm
        onSubmit={handleSubmit}
        isEditing={false}
        moduleId={moduleId}
      />
      
      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="course-chapter-form"
          className="btn btn-primary"
          disabled={createCourseChapter.isPending}
        >
          <FaSave className="btn-icon" />
          {createCourseChapter.isPending ? 'Creating...' : 'Create Chapter'}
        </button>
      </div>
    </Modal>
  );
};
