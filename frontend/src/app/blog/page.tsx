'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendar, FaBookOpen, FaEdit } from 'react-icons/fa';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BlogList, BlogFilters } from '../../components/common';
import { BlogFilters as BlogFiltersType, BlogPost } from '../../types/platform';

export default function BlogPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<BlogFiltersType>({
    search: undefined,
    categoryId: undefined,
    sortBy: 'newest',
    isPublished: true
  });

  const handleFiltersChange = (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
  };

  const handleBlogClick = (blogPost: BlogPost) => {
    router.push(`/blog/${blogPost.slug}`);
  };

  return (
    <div className="blog-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Blog</h1>
            <p className="page-description">
              Deep dives into jazz theory, history, and the stories behind the music
            </p>
          </div>
        </div>
      </section>

      {/* Substack Section */}
      <section className="substack-section">
        <div className="container">
          <div className="substack-content">
            <div className="substack-icon">📰</div>
            <div className="substack-text">
              <h2 className="substack-title">Follow My Substack</h2>
              <p className="substack-description">
                I post every Thursday at 19:00 with in-depth articles about jazz music, 
                technique, and the stories behind the songs.
              </p>
              <div className="substack-schedule">
                <span className="schedule-icon"><FaCalendar /></span>
                <span className="schedule-text">Every Thursday • 19:00</span>
              </div>
            </div>
            <div className="substack-action">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.open('https://your-substack-url.substack.com', '_blank')}
                className="substack-button"
              >
                <span className="button-icon"><FaBookOpen /></span>
                Read on Substack
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      <section className="featured-post-section">
        <div className="container">
          <div className="featured-post">
            <div className="featured-post-content">
              <div className="featured-post-badge">
                <span>Featured Article</span>
              </div>
              <h2 className="featured-post-title">
                The Evolution of Jazz: From New Orleans to Modern Fusion
              </h2>
              <p className="featured-post-excerpt">
                Explore the rich history and evolution of jazz music from its roots in New Orleans 
                to contemporary fusion styles that continue to shape the genre today.
              </p>
              <div className="featured-post-meta">
                <span className="post-date">January 15, 2024</span>
                <span className="post-reading-time">8 min read</span>
              </div>
              <Button variant="primary">
                Read Full Article
              </Button>
            </div>
            <div className="featured-post-image">
              <div className="placeholder-image">
                <span><FaBookOpen /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <BlogFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="blog-section">
        <div className="container">
          <BlogList
            filters={filters}
            onBlogClick={handleBlogClick}
            showFeatured={true}
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-description">
                Get the latest articles and insights delivered to your inbox
              </p>
            </div>
            <div className="newsletter-form">
              <Input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <Button variant="primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Load More Section */}
      <section className="load-more-section">
        <div className="container">
          <div className="load-more-content">
            <Button variant="secondary" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
