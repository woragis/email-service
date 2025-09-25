'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { CreateCourseModuleData, UpdateCourseModuleData, CourseModule } from '@/types/platform';
import './CourseModuleForm.css';

export interface CourseModuleFormProps {
  initialData?: Partial<CreateCourseModuleData> | CourseModule;
  onSubmit: (data: CreateCourseModuleData | UpdateCourseModuleData) => void;
  isEditing?: boolean;
  courseId?: string;
}

export const CourseModuleForm: React.FC<CourseModuleFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  courseId
}) => {
  const [formData, setFormData] = useState<CreateCourseModuleData>({
    title: '',
    description: '',
    orderIndex: 1,
    courseId: courseId || ''
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      if (isEditing && 'id' in initialData) {
        // Editing existing course module
        const courseModule = initialData as CourseModule;
        setFormData({
          title: courseModule.title,
          description: courseModule.description,
          orderIndex: courseModule.order,
          courseId: courseModule.courseId
        });
      } else {
        // Creating new course module with initial data
        setFormData(prev => ({
          ...prev,
          ...initialData,
          courseId: courseId || prev.courseId
        }));
      }
    }
  }, [initialData, isEditing, courseId]);

  const handleInputChange = (field: keyof CreateCourseModuleData, value: any) => {
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
    <div className="course-module-form-container">
      <form onSubmit={handleSubmit} className="course-module-form">
        <div className="form-section">
          <h3>Module Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Module Title *</label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter module title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what students will learn in this module..."
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
              The order in which this module appears in the course
            </small>
          </div>
        </div>
      </form>
    </div>
  );
};
