'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { CourseModuleForm } from '../../forms';
import { useCreateCourseModule } from '@/hooks/course';
import { CreateCourseModuleData, UpdateCourseModuleData } from '@/types/platform';

export interface CreateCourseModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  courseId: string;
}

export const CreateCourseModuleModal: React.FC<CreateCourseModuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  courseId
}) => {
  const createCourseModule = useCreateCourseModule();

  const handleSubmit = async (data: CreateCourseModuleData | UpdateCourseModuleData) => {
    try {
      // For create modal, we only handle CreateCourseModuleData
      const createData = data as CreateCourseModuleData;
      await createCourseModule.mutateAsync({
        ...createData,
        courseId
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create course module:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Module"
      size="lg"
    >
      <CourseModuleForm
        onSubmit={handleSubmit}
        isEditing={false}
        courseId={courseId}
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
          form="course-module-form"
          className="btn btn-primary"
          disabled={createCourseModule.isPending}
        >
          <FaSave className="btn-icon" />
          {createCourseModule.isPending ? 'Creating...' : 'Create Module'}
        </button>
      </div>
    </Modal>
  );
};
