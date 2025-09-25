'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaCalendar, FaUser, FaTag, FaEye, FaHeart, FaComment } from 'react-icons/fa';
import { Button, Skeleton } from '@/components/ui';
import { 
  EditBlogPostModal, 
  DeleteBlogPostModal
} from '@/components/modals';
import { useBlogPostBySlug } from '@/hooks/blog';
import { BlogPost } from '@/types/platform';
import Image from 'next/image';

export default function BlogPostDetailBySlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: blogPost, isLoading, error } = useBlogPostBySlug(slug);

  const handleEditPost = () => {
    setIsEditModalOpen(true);
  };

  const handleDeletePost = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    router.push('/blog');
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="blog-post-detail-page">
        <div className="container">
          <div className="blog-post-header-skeleton">
            <Skeleton height="200px" />
          </div>
          <div className="blog-post-content-skeleton">
            <Skeleton height="400px" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="blog-post-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Blog post not found</h2>
            <p>The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.push('/blog')}>
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-detail-page">
      <div className="container">
        {/* Blog Post Header */}
        <section className="blog-post-header">
          <div className="blog-post-meta">
            <div className="blog-post-category">
              <FaTag />
              <span>{blogPost.category?.name || 'Uncategorized'}</span>
            </div>
            <div className="blog-post-date">
              <FaCalendar />
              <span>{formatDate(blogPost.publishedAt || blogPost.createdAt)}</span>
            </div>
            <div className="blog-post-author">
              <FaUser />
              <span>Admin</span>
            </div>
          </div>

          <h1 className="blog-post-title">{blogPost.title}</h1>
          
          {blogPost.excerpt && (
            <p className="blog-post-excerpt">{blogPost.excerpt}</p>
          )}

          {blogPost.featuredImage && (
            <div className="blog-post-featured-image">
              <Image 
                src={blogPost.featuredImage} 
                alt={blogPost.title}
                width={800}
                height={400}
              />
            </div>
          )}

          <div className="blog-post-actions">
            <Button
              variant="secondary"
              onClick={handleEditPost}
              icon={<FaEdit />}
            >
              Edit Post
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletePost}
              icon={<FaTrash />}
            >
              Delete Post
            </Button>
          </div>
        </section>

        {/* Blog Post Content */}
        <section className="blog-post-content">
          <div className="blog-post-body">
            {blogPost.content ? (
              <div 
                className="prose"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            ) : (
              <p>No content available for this blog post.</p>
            )}
          </div>

          {/* Blog Post Footer */}
          <div className="blog-post-footer">
            <div className="blog-post-stats">
              <div className="stat">
                <FaEye />
                <span>1,234 views</span>
              </div>
              <div className="stat">
                <FaHeart />
                <span>56 likes</span>
              </div>
              <div className="stat">
                <FaComment />
                <span>12 comments</span>
              </div>
            </div>

            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="blog-post-tags">
                <h4>Tags:</h4>
                <div className="tags-list">
                  {blogPost.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {blogPost.substackUrl && (
              <div className="blog-post-substack">
                <p>
                  This post is also available on{' '}
                  <a 
                    href={blogPost.substackUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="substack-link"
                  >
                    Substack
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      <EditBlogPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        blogPost={blogPost}
      />

      <DeleteBlogPostModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        blogPost={blogPost}
      />
    </div>
  );
}