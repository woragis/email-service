'use client';

import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { Input, Select, Button } from '../../ui';
import { BlogFilters as BlogFiltersType, BlogCategory } from '@/types/platform';
import { useBlogCategories } from '@/hooks/blog';
import './BlogFilters.css';

export interface BlogFiltersProps {
  filters: BlogFiltersType;
  onFiltersChange: (filters: BlogFiltersType) => void;
  className?: string;
  showCategoryFilter?: boolean;
  showSortFilter?: boolean;
  showSearchFilter?: boolean;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  filters,
  onFiltersChange,
  className = '',
  showCategoryFilter = true,
  showSortFilter = true,
  showSearchFilter = true
}) => {
  const { data: categories = [] } = useBlogCategories();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value || undefined
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      categoryId: e.target.value || undefined
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      sortBy: e.target.value as any
    });
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      isPublished: e.target.value === 'all' ? undefined : e.target.value === 'published'
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: undefined,
      categoryId: undefined,
      sortBy: 'newest',
      isPublished: true
    });
  };

  const hasActiveFilters = filters.search || filters.categoryId || filters.sortBy !== 'newest' || filters.isPublished !== true;

  return (
    <div className={`blog-filters ${className}`}>
      <div className="filters-container">
        <div className="filters-row">
          {showSearchFilter && (
            <div className="filter-group">
              <Input
                type="search"
                placeholder="Search articles..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                icon={<FaSearch />}
                className="search-input"
              />
            </div>
          )}
          
          {showCategoryFilter && (
            <div className="filter-group">
              <Select
                placeholder="All Categories"
                value={filters.categoryId || ''}
                onChange={handleCategoryChange}
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map((category: BlogCategory) => ({
                    value: category.id,
                    label: category.name
                  }))
                ]}
                className="category-select"
              />
            </div>
          )}
          
          {showSortFilter && (
            <div className="filter-group">
              <Select
                placeholder="Sort by"
                value={filters.sortBy || 'newest'}
                onChange={handleSortChange}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'popular', label: 'Most Popular' }
                ]}
                className="sort-select"
              />
            </div>
          )}

          <div className="filter-group">
            <Select
              placeholder="Status"
              value={filters.isPublished === undefined ? 'all' : filters.isPublished ? 'published' : 'draft'}
              onChange={handlePublishedChange}
              options={[
                { value: 'all', label: 'All Posts' },
                { value: 'published', label: 'Published Only' },
                { value: 'draft', label: 'Drafts Only' }
              ]}
              className="status-select"
            />
          </div>

          {hasActiveFilters && (
            <div className="filter-group">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                <FaFilter />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
