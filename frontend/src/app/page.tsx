'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Button, Input, Select } from "../components/ui";
import { VideoCard, BlogCard, CourseCard } from "../components/common";
import { Video, BlogPost, Course, VideoFilters } from "../types/platform";

// Mock data for demonstration
const featuredVideos: Video[] = [
  {
    id: "1",
    title: "Jazz Piano Fundamentals: The Art of Voicing",
    slug: "jazz-piano-fundamentals-voicing",
    description: "Learn the essential techniques for creating beautiful jazz piano voicings that will elevate your playing.",
    thumbnail: "/api/placeholder/400/200",
    duration: 1247,
    categories: [
      { id: "1", name: "Piano", type: "instrument" },
      { id: "2", name: "Jazz", type: "genre" }
    ],
    instagramUrl: "https://instagram.com/example",
    youtubeUrl: "https://youtube.com/example",
    blogPostId: "1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Saxophone Improvisation: Building Your Vocabulary",
    slug: "saxophone-improvisation-vocabulary",
    description: "Discover how to develop your improvisational vocabulary and create compelling solos.",
    thumbnail: "/api/placeholder/400/200",
    duration: 892,
    categories: [
      { id: "3", name: "Saxophone", type: "instrument" },
      { id: "4", name: "Improvisation", type: "vibe" }
    ],
    tiktokUrl: "https://tiktok.com/example",
    youtubeUrl: "https://youtube.com/example",
    blogPostId: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "3",
    title: "Blues Guitar Techniques for Jazz Players",
    slug: "blues-guitar-techniques-jazz",
    description: "Master the blues techniques that every jazz guitarist needs to know.",
    thumbnail: "/api/placeholder/400/200",
    duration: 1156,
    categories: [
      { id: "5", name: "Guitar", type: "instrument" },
      { id: "6", name: "Blues", type: "genre" }
    ],
    youtubeUrl: "https://youtube.com/example",
    blogPostId: "3",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  },
  {
    id: "4",
    title: "Jazz Bass Walking Lines: Foundation of Rhythm",
    slug: "jazz-bass-walking-lines",
    description: "Learn to create solid walking bass lines that drive the jazz rhythm section.",
    thumbnail: "/api/placeholder/400/200",
    duration: 1342,
    categories: [
      { id: "7", name: "Bass", type: "instrument" },
      { id: "2", name: "Jazz", type: "genre" }
    ],
    instagramUrl: "https://instagram.com/example",
    youtubeUrl: "https://youtube.com/example",
    blogPostId: "4",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },
  {
    id: "5",
    title: "Drum Solos: Jazz Rhythms and Techniques",
    slug: "drum-solos-jazz-rhythms",
    description: "Explore advanced drumming techniques and solo concepts in jazz music.",
    thumbnail: "/api/placeholder/400/200",
    duration: 987,
    categories: [
      { id: "8", name: "Drums", type: "instrument" },
      { id: "2", name: "Jazz", type: "genre" }
    ],
    tiktokUrl: "https://tiktok.com/example",
    youtubeUrl: "https://youtube.com/example",
    blogPostId: "5",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  },
  {
    id: "6",
    title: "Advanced Piano Improvisation: Modal Concepts",
    slug: "advanced-piano-improvisation-modal",
    description: "Dive deep into modal improvisation techniques for advanced piano players.",
    thumbnail: "/api/placeholder/400/200",
    duration: 1456,
    categories: [
      { id: "1", name: "Piano", type: "instrument" },
      { id: "4", name: "Improvisation", type: "vibe" }
    ],
    youtubeUrl: "https://youtube.com/example",
    blogPostId: "6",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

const featuredBlogs: BlogPost[] = [
  {
    id: "1",
    title: "The Evolution of Jazz: From New Orleans to Modern Fusion",
    content: "Jazz music has undergone remarkable transformations...",
    excerpt: "Explore the rich history and evolution of jazz music from its roots in New Orleans to contemporary fusion styles.",
    slug: "evolution-of-jazz",
    publishedAt: new Date("2024-01-15"),
    isPublished: true,
    categoryId: "1",
    category: { id: "1", name: "History", description: "Historical perspectives on jazz" },
    featuredImage: "/api/placeholder/400/200",
    tags: ["jazz", "history", "evolution"],
    videoId: "1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  }
];

const featuredCourses: Course[] = [
  {
    id: "1",
    title: "Complete Jazz Piano Mastery",
    slug: "complete-jazz-piano-mastery",
    description: "Master jazz piano from fundamentals to advanced techniques with this comprehensive course.",
    banner: "/api/placeholder/400/200",
    isPublished: true,
    publishedAt: new Date("2024-01-01"),
    modules: [],
    totalStudents: 1250,
    rating: 4.8,
    price: 199,
    currency: "USD",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function - in real app this would call an API
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter videos based on search query
      const filteredVideos = featuredVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        video.categories.some(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(filteredVideos);
      setIsSearching(false);
    }, 500);
  };

  // Clear search results when search query is empty
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section with Giant Search */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="display-1 gradient-text">
                My Jazz Journey
              </h1>
              <p className="hero-description">
                Welcome to my personal collection of jazz videos, insights, and musical explorations. 
                Here you&apos;ll find my performances, tutorials, and thoughts on jazz music.
              </p>
            </div>
          </div>
        </div>
        
        {/* Giant Search Bar - Outside container for full width */}
        <div className="giant-search-section">
          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="giant-search-container">
              <div className="search-input-wrapper">
                <Input
                  type="search"
                  placeholder="Search my videos... (e.g., piano, jazz, improvisation)"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="giant-search-input"
                  icon={<FaSearch />}
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  disabled={isSearching || !searchQuery.trim()}
                  className="search-button"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {/* Search Filters */}
              <div className="search-filters-row">
                <Select
                  placeholder="All Categories"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={[
                    { value: '', label: 'All Categories' },
                    { value: 'piano', label: 'Piano' },
                    { value: 'saxophone', label: 'Saxophone' },
                    { value: 'guitar', label: 'Guitar' },
                    { value: 'bass', label: 'Bass' },
                    { value: 'drums', label: 'Drums' },
                    { value: 'jazz', label: 'Jazz' },
                    { value: 'blues', label: 'Blues' },
                    { value: 'improvisation', label: 'Improvisation' }
                  ]}
                />
                <Select
                  placeholder="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'popular', label: 'Most Popular' }
                  ]}
                />
              </div>
            </div>
          </form>
        </div>
        
        {/* Search Results - Outside container for full width */}
        {searchResults.length > 0 && (
          <div className="search-results-section">
            <div className="container">
              <div className="search-results-header">
                <h2 className="search-results-title">
                  Search Results for &quot;{searchQuery}&quot;
                </h2>
                <p className="search-results-count">
                  {searchResults.length} video{searchResults.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {/* Two rows of small video cards */}
              <div className="search-results-grid">
                {searchResults.map((video) => (
                  <div key={video.id} className="search-result-card">
                    <VideoCard
                      video={video}
                      onClick={(video) => console.log('Video clicked:', video.title)}
                      className="small-video-card"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* No results message */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="no-results-section">
            <div className="container">
              <div className="no-results-content">
                <h3 className="no-results-title">No videos found</h3>
                <p className="no-results-message">
                  Try searching for different keywords like &quot;piano&quot;, &quot;jazz&quot;, or &quot;improvisation&quot;
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Latest Videos Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Videos</h2>
            <p className="section-description">
              My most recent jazz performances, tutorials, and musical explorations
            </p>
            <Button variant="ghost" size="sm">
              View All Videos
            </Button>
          </div>
          <div className="video-card-grid">
            {featuredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={(video) => console.log('Video clicked:', video.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recent Thoughts</h2>
            <p className="section-description">
              My latest insights on jazz music, technique, and the creative process
            </p>
            <Button variant="ghost" size="sm">
              Read All Posts
            </Button>
          </div>
          <div className="blog-card-grid">
            {featuredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blogPost={blog}
                onClick={(blog) => console.log('Blog clicked:', blog.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section - Minimal */}
      <section className="courses-minimal-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Learning Resources</h2>
            <p className="section-description">
              For those interested in structured learning, I offer comprehensive courses
            </p>
          </div>
          <div className="course-card-grid-minimal">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={(course) => console.log('Course clicked:', course.title)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
