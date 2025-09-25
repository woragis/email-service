'use client';

import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Modal } from '../../ui';
import { BlogForm } from '../../forms';
import { useCreateBlogPost } from '@/hooks/blog';
import { CreateBlogPostData, UpdateBlogPostData } from '@/types/platform';

export interface CreateBlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateBlogPostModal: React.FC<CreateBlogPostModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const createBlogPost = useCreateBlogPost();

  const handleSubmit = async (data: CreateBlogPostData | UpdateBlogPostData) => {
    try {
      // For create modal, we only handle CreateBlogPostData
      const createData = data as CreateBlogPostData;
      await createBlogPost.mutateAsync({
        ...createData,
        categoryId: createData.categoryId,
        videoId: createData.videoId || undefined
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create blog post:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Blog Post"
      size="xl"
    >
      <BlogForm
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
          form="blog-form"
          className="btn btn-primary"
          disabled={createBlogPost.isPending}
        >
          <FaSave className="btn-icon" />
          {createBlogPost.isPending ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </Modal>
  );
};
