'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { CourseChapterForm } from '../../forms';
import { useUpdateCourseChapter } from '@/hooks/course';
import { CreateCourseChapterData, UpdateCourseChapterData, CourseChapter } from '@/types/platform';

export interface EditCourseChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  chapter: CourseChapter;
}

export const EditCourseChapterModal: React.FC<EditCourseChapterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  chapter
}) => {
  const updateCourseChapter = useUpdateCourseChapter();

  const handleSubmit = async (data: CreateCourseChapterData | UpdateCourseChapterData) => {
    try {
      await updateCourseChapter.mutateAsync({
        id: chapter.id,
        data: data as UpdateCourseChapterData
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update course chapter:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Chapter"
      size="lg"
    >
      <CourseChapterForm
        initialData={chapter}
        onSubmit={handleSubmit}
        isEditing={true}
        moduleId={chapter.moduleId}
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
          disabled={updateCourseChapter.isPending}
        >
          <FaSave className="btn-icon" />
          {updateCourseChapter.isPending ? 'Updating...' : 'Update Chapter'}
        </button>
      </div>
    </Modal>
  );
};
