'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { BlogForm } from '../../forms';
import { useUpdateBlogPost } from '@/hooks/blog';
import { UpdateBlogPostData, BlogPost, CreateBlogPostData } from '@/types/platform';

export interface EditBlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  blogPost: BlogPost | null;
}

export const EditBlogPostModal: React.FC<EditBlogPostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  blogPost
}) => {
  const updateBlogPost = useUpdateBlogPost();

  const handleSubmit = async (data: CreateBlogPostData | UpdateBlogPostData) => {
    if (!blogPost) return;
    
    try {
      // For edit modal, we only handle UpdateBlogPostData
      const updateData = data as UpdateBlogPostData;
      await updateBlogPost.mutateAsync({
        id: blogPost.id,
        data: {
          ...updateData,
          videoId: updateData.videoId || undefined
        }
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update blog post:', error);
    }
  };

  if (!isOpen || !blogPost) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Blog Post"
      size="xl"
    >
      <BlogForm
        initialData={blogPost}
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
          form="blog-form"
          className="btn btn-primary"
          disabled={updateBlogPost.isPending}
        >
          <FaSave className="btn-icon" />
          {updateBlogPost.isPending ? 'Updating...' : 'Update Post'}
        </button>
      </div>
    </Modal>
  );
};
