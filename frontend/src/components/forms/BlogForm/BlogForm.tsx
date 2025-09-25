'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormTabs } from '../../ui/FormTabs';
import { TagsInput } from '../../ui/TagsInput';
import { useBlogCategories } from '@/hooks/blog';
import { CreateBlogPostData, UpdateBlogPostData, BlogPost } from '@/types/platform';
import './BlogForm.css';

export interface BlogFormProps {
  initialData?: Partial<CreateBlogPostData> | BlogPost;
  onSubmit: (data: CreateBlogPostData | UpdateBlogPostData) => void;
  isEditing?: boolean;
  showPreview?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  showPreview = true
}) => {
  const { data: categories = [] } = useBlogCategories();
  
  const [formData, setFormData] = useState<CreateBlogPostData>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    categoryId: '',
    substackUrl: '',
    featuredImage: '',
    tags: [],
    videoId: '',
    isPublished: false
  });
  
  const [isPreview, setIsPreview] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      if (isEditing && 'id' in initialData) {
        // Editing existing blog post
        const blogPost = initialData as BlogPost;
        setFormData({
          title: blogPost.title,
          content: blogPost.content,
          excerpt: blogPost.excerpt || '',
          slug: blogPost.slug,
          categoryId: blogPost.categoryId,
          substackUrl: blogPost.substackUrl || '',
          featuredImage: blogPost.featuredImage || '',
          tags: blogPost.tags || [],
          videoId: blogPost.videoId || '',
          isPublished: blogPost.isPublished
        });
      } else {
        // Creating new blog post with initial data
        setFormData(prev => ({
          ...prev,
          ...initialData
        }));
      }
    }
  }, [initialData, isEditing]);

  const handleInputChange = (field: keyof CreateBlogPostData, value: any) => {
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
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      {showPreview && (
        <FormTabs
          activeTab={isPreview ? 'preview' : 'edit'}
          onTabChange={(tab) => setIsPreview(tab === 'preview')}
        />
      )}

      <div className="form-content">
        {!isPreview ? (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="slug">Slug</label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-friendly-slug"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <Select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  options={[
                    { value: '', label: 'Select a category' },
                    ...categories.map(category => ({
                      value: category.id,
                      label: category.name
                    }))
                  ]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <Select
                  id="status"
                  value={formData.isPublished ? 'published' : 'draft'}
                  onChange={(e) => handleInputChange('isPublished', e.target.value === 'published')}
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'published', label: 'Published' }
                  ]}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description of the blog post"
                rows={3}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your blog post content here (Markdown supported)"
                rows={10}
                className="form-textarea"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="featuredImage">Featured Image URL</label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="substackUrl">Substack URL</label>
                <Input
                  id="substackUrl"
                  value={formData.substackUrl}
                  onChange={(e) => handleInputChange('substackUrl', e.target.value)}
                  placeholder="https://substack.com/post/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <TagsInput
                tags={formData.tags || []}
                onTagsChange={(tags) => handleInputChange('tags', tags)}
                placeholder="Add a tag"
              />
            </div>
          </>
        ) : (
          <div className="preview-content">
            <h1>{formData.title || 'Untitled'}</h1>
            {formData.excerpt && <p className="preview-excerpt">{formData.excerpt}</p>}
            <div 
              className="preview-body"
              dangerouslySetInnerHTML={{ 
                __html: formData.content.replace(/\n/g, '<br>') 
              }}
            />
          </div>
        )}
      </div>
    </form>
  );
};
