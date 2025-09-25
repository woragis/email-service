'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormTabs } from '../../ui/FormTabs';
import { TagsInput } from '../../ui/TagsInput';
import { CreateCourseData, UpdateCourseData, Course } from '@/types/platform';
import './CourseForm.css';
import Image from 'next/image';

export interface CourseFormProps {
  initialData?: Partial<CreateCourseData> | Course;
  onSubmit: (data: CreateCourseData | UpdateCourseData) => void;
  isEditing?: boolean;
  showPreview?: boolean;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  showPreview = true
}) => {
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    slug: '',
    description: '',
    banner: '',
    price: 0,
    currency: 'USD',
    isPublished: false
  });
  
  const [isPreview, setIsPreview] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      if (isEditing && 'id' in initialData) {
        // Editing existing course
        const course = initialData as Course;
        setFormData({
          title: course.title,
          slug: course.slug,
          description: course.description,
          banner: course.banner || '',
          price: course.price || 0,
          currency: course.currency || 'USD',
          isPublished: course.isPublished
        });
      } else {
        // Creating new course with initial data
        setFormData(prev => ({
          ...prev,
          ...initialData
        }));
      }
    }
  }, [initialData, isEditing]);

  const handleInputChange = (field: keyof CreateCourseData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    handleInputChange('title', value);
    if (!isEditing && !formData.slug) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' },
  ];


  const renderFormContent = () => {
    if (isPreview) {
      return (
        <div className="course-preview">
          <div className="preview-header">
            <h3>Course Preview</h3>
          </div>
          <div className="preview-content">
            <div className="preview-banner">
              {formData.banner ? (
                <Image src={formData.banner} alt="Course banner" />
              ) : (
                <div className="preview-banner-placeholder">
                  <span>Course Banner</span>
                </div>
              )}
            </div>
            <div className="preview-details">
              <h2>{formData.title || 'Course Title'}</h2>
              <p className="preview-description">
                {formData.description || 'Course description will appear here...'}
              </p>
              <div className="preview-meta">
                <div className="preview-price">
                  {formData.price ? (
                    <span className="price">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: formData.currency
                      }).format(formData.price)}
                    </span>
                  ) : (
                    <span className="price-free">Free</span>
                  )}
                </div>
                <div className="preview-status">
                  <span className={`status ${formData.isPublished ? 'published' : 'draft'}`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">URL Slug *</label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="course-url-slug"
              required
            />
            <small className="form-help">
              This will be used in the course URL. Only lowercase letters, numbers, and hyphens are allowed.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what students will learn in this course..."
              rows={4}
              required
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="banner">Banner Image URL</label>
            <Input
              id="banner"
              type="url"
              value={formData.banner}
              onChange={(e) => handleInputChange('banner', e.target.value)}
              placeholder="https://example.com/banner.jpg"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Pricing & Settings</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <small className="form-help">
                Leave as 0 for free course
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <Select
                id="currency"
                value={formData.currency}
                onChange={(value) => handleInputChange('currency', value)}
                options={currencyOptions}
              />
            </div>
          </div>


          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
              />
              <span className="checkbox-text">Publish this course</span>
            </label>
            <small className="form-help">
              Published courses will be visible to students
            </small>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="course-form-container">
      {showPreview && (
        <FormTabs
          activeTab={isPreview ? 'preview' : 'edit'}
          onTabChange={(tabId) => setIsPreview(tabId === 'preview')}
          showPreview={true}
        />
      )}
      
      {renderFormContent()}
    </div>
  );
};
