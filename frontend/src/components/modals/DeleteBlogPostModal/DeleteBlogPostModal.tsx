'use client';

import React from 'react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { Modal } from '../../ui';
import { useDeleteBlogPost } from '@/hooks/blog';
import { BlogPost } from '@/types/platform';
import './DeleteBlogPostModal.css';

export interface DeleteBlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  blogPost: BlogPost | null;
}

export const DeleteBlogPostModal: React.FC<DeleteBlogPostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  blogPost
}) => {
  const deleteBlogPost = useDeleteBlogPost();

  const handleDelete = async () => {
    if (!blogPost) return;
    
    try {
      await deleteBlogPost.mutateAsync(blogPost.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    }
  };

  if (!isOpen || !blogPost) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Blog Post"
      size="md"
    >
      <div className="modal-body">
        <div className="warning-icon">
          <FaExclamationTriangle />
        </div>
        
        <div className="warning-content">
          <h3 className="warning-title">Are you sure you want to delete this blog post?</h3>
          <p className="warning-description">
            This action cannot be undone. The blog post &quot;{blogPost.title}&quot; will be permanently deleted.
          </p>
          
          <div className="blog-post-info">
            <div className="info-item">
              <strong>Title:</strong> {blogPost.title}
            </div>
            <div className="info-item">
              <strong>Category:</strong> {blogPost.category?.name}
            </div>
            <div className="info-item">
              <strong>Status:</strong> {blogPost.isPublished ? 'Published' : 'Draft'}
            </div>
            <div className="info-item">
              <strong>Created:</strong> {new Date(blogPost.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={deleteBlogPost.isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="btn btn-danger"
          disabled={deleteBlogPost.isPending}
        >
          <FaTrash className="btn-icon" />
          {deleteBlogPost.isPending ? 'Deleting...' : 'Delete Post'}
        </button>
      </div>
    </Modal>
  );
};
