'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { CourseForm } from '../../forms';
import { useUpdateCourse } from '@/hooks/course';
import { CreateCourseData, UpdateCourseData, Course } from '@/types/platform';

export interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  course: Course;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  course
}) => {
  const updateCourse = useUpdateCourse();

  const handleSubmit = async (data: CreateCourseData | UpdateCourseData) => {
    try {
      await updateCourse.mutateAsync({
        id: course.id,
        data: data as UpdateCourseData
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Course"
      size="xl"
    >
      <CourseForm
        initialData={course}
        onSubmit={handleSubmit}
        isEditing={true}
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
          disabled={updateCourse.isPending}
        >
          <FaSave className="btn-icon" />
          {updateCourse.isPending ? 'Updating...' : 'Update Course'}
        </button>
      </div>
    </Modal>
  );
};
