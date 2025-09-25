'use client';

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { BlogList, BlogFilters } from '@/components/common';
import { CreateBlogPostModal, EditBlogPostModal, DeleteBlogPostModal } from '@/components/modals';
import { BlogFilters as BlogFiltersType, BlogPost } from '@/types/platform';
import { useRouter } from 'next/navigation';
import './page.css';

export default function AdminBlogPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<BlogFiltersType>({
    search: undefined,
    categoryId: undefined,
    sortBy: 'newest',
    isPublished: undefined // Show all posts in admin
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  const handleFiltersChange = (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
  };

  const handleBlogClick = (blogPost: BlogPost) => {
    router.push(`/blog/${blogPost.slug}`);
  };

  const handleEditClick = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedBlogPost(null);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setSelectedBlogPost(null);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBlogPost(null);
  };

  return (
    <div className="admin-blog-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Blog Management</h1>
            <p className="page-description">
              Manage your blog posts, categories, and content
            </p>
          </div>
          <div className="page-header-actions">
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FaPlus />
              Create New Post
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <BlogFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            showCategoryFilter={true}
            showSortFilter={true}
            showSearchFilter={true}
          />
        </div>

        {/* Blog Posts List */}
        <div className="blog-section">
          <BlogList
            filters={filters}
            onBlogClick={handleBlogClick}
            showFeatured={false}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateBlogPostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onSuccess={handleCreateSuccess}
      />

      <EditBlogPostModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSuccess={handleEditSuccess}
        blogPost={selectedBlogPost}
      />

      <DeleteBlogPostModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onSuccess={handleDeleteSuccess}
        blogPost={selectedBlogPost}
      />
    </div>
  );
}
