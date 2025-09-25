'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { CourseModuleForm } from '../../forms';
import { useUpdateCourseModule } from '@/hooks/course';
import { CreateCourseModuleData, UpdateCourseModuleData, CourseModule } from '@/types/platform';

export interface EditCourseModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  module: CourseModule;
}

export const EditCourseModuleModal: React.FC<EditCourseModuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  module
}) => {
  const updateCourseModule = useUpdateCourseModule();

  const handleSubmit = async (data: CreateCourseModuleData | UpdateCourseModuleData) => {
    try {
      await updateCourseModule.mutateAsync({
        id: module.id,
        data: data as UpdateCourseModuleData
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update course module:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Module"
      size="lg"
    >
      <CourseModuleForm
        initialData={module}
        onSubmit={handleSubmit}
        isEditing={true}
        courseId={module.courseId}
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
          disabled={updateCourseModule.isPending}
        >
          <FaSave className="btn-icon" />
          {updateCourseModule.isPending ? 'Updating...' : 'Update Module'}
        </button>
      </div>
    </Modal>
  );
};
