'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { CourseForm } from '../../forms';
import { useCreateCourse } from '@/hooks/course';
import { CreateCourseData, UpdateCourseData } from '@/types/platform';

export interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const createCourse = useCreateCourse();

  const handleSubmit = async (data: CreateCourseData | UpdateCourseData) => {
    try {
      // For create modal, we only handle CreateCourseData
      const createData = data as CreateCourseData;
      await createCourse.mutateAsync(createData);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Course"
      size="xl"
    >
      <CourseForm
        onSubmit={handleSubmit}
        isEditing={false}
        showPreview={true}
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
          form="course-form"
          className="btn btn-primary"
          disabled={createCourse.isPending}
        >
          <FaSave className="btn-icon" />
          {createCourse.isPending ? 'Creating...' : 'Create Course'}
        </button>
      </div>
    </Modal>
  );
};
