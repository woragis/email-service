'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { CreateCourseChapterData, UpdateCourseChapterData, CourseChapter } from '@/types/platform';
import './CourseChapterForm.css';

export interface CourseChapterFormProps {
  initialData?: Partial<CreateCourseChapterData> | CourseChapter;
  onSubmit: (data: CreateCourseChapterData | UpdateCourseChapterData) => void;
  isEditing?: boolean;
  moduleId?: string;
}

export const CourseChapterForm: React.FC<CourseChapterFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  moduleId
}) => {
  const [formData, setFormData] = useState<CreateCourseChapterData>({
    title: '',
    description: '',
    orderIndex: 1,
    moduleId: moduleId || ''
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      if (isEditing && 'id' in initialData) {
        // Editing existing course chapter
        const chapter = initialData as CourseChapter;
        setFormData({
          title: chapter.title,
          description: chapter.description,
          orderIndex: chapter.order,
          moduleId: chapter.moduleId
        });
      } else {
        // Creating new course chapter with initial data
        setFormData(prev => ({
          ...prev,
          ...initialData,
          moduleId: moduleId || prev.moduleId
        }));
      }
    }
  }, [initialData, isEditing, moduleId]);

  const handleInputChange = (field: keyof CreateCourseChapterData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="course-chapter-form-container">
      <form onSubmit={handleSubmit} className="course-chapter-form">
        <div className="form-section">
          <h3>Chapter Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Chapter Title *</label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter chapter title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what students will learn in this chapter..."
              rows={3}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="orderIndex">Order *</label>
            <Input
              id="orderIndex"
              type="number"
              value={formData.orderIndex}
              onChange={(e) => handleInputChange('orderIndex', parseInt(e.target.value) || 1)}
              placeholder="1"
              min="1"
              required
            />
            <small className="form-help">
              The order in which this chapter appears in the module
            </small>
          </div>
        </div>
      </form>
    </div>
  );
};
