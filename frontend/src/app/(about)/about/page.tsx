import { FaGraduationCap, FaHandshake, FaStar, FaMusic, FaUser, FaUserTie, FaLaptopCode } from 'react-icons/fa';
import { Button } from '@/components/ui';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-hero-title">
              Where Technique Meets Artistry
            </h1>
            <p className="about-hero-description">
              Jazz Melodic is more than just a learning platform – it&apos;s a community where musicians 
              come together to explore, learn, and create. We believe that jazz is not just music, 
              but a language that connects souls across cultures and generations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-description">
                To democratize jazz education by providing accessible, high-quality content that 
                empowers musicians of all levels to develop their skills, express their creativity, 
                and connect with a global community of jazz enthusiasts.
              </p>
              <div className="mission-values">
                <div className="value-item">
                  <div className="value-icon"><FaGraduationCap /></div>
                  <h3 className="value-title">Quality Education</h3>
                  <p className="value-description">
                    Professional-grade content created by experienced musicians and educators
                  </p>
                </div>
                <div className="value-item">
                  <div className="value-icon"><FaHandshake /></div>
                  <h3 className="value-title">Community First</h3>
                  <p className="value-description">
                    Building connections between musicians worldwide through shared learning
                  </p>
                </div>
                <div className="value-item">
                  <div className="value-icon"><FaStar /></div>
                  <h3 className="value-title">Accessibility</h3>
                  <p className="value-description">
                    Making jazz education available to everyone, regardless of background or location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2 className="section-title">Our Story</h2>
              <p className="story-description">
                Jazz Melodic was born from a simple observation: while jazz has influenced countless 
                genres and continues to inspire musicians worldwide, quality jazz education remains 
                scattered and often inaccessible to many aspiring musicians.
              </p>
              <p className="story-description">
                Founded by a group of passionate jazz musicians and educators, we set out to create 
                a platform that would bridge this gap. Our vision was to combine the best of traditional 
                jazz education with modern technology, creating an immersive learning experience that 
                honors the rich history of jazz while embracing its future.
              </p>
              <p className="story-description">
                Today, Jazz Melodic serves thousands of musicians worldwide, from beginners taking 
                their first steps into jazz to professionals looking to refine their craft. Our 
                community continues to grow, united by a shared love for this incredible art form.
              </p>
            </div>
            <div className="story-visual">
              <div className="story-image">
                <div className="placeholder-image">
                  <span><FaMusic /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="team-content">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="team-description">
              Our team consists of passionate musicians, educators, and technologists who share 
              a common vision: making jazz education accessible to everyone.
            </p>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">
                  <span><FaUserTie /></span>
                </div>
                <h3 className="member-name">Marcus Johnson</h3>
                <p className="member-role">Founder & Lead Educator</p>
                <p className="member-bio">
                  Jazz pianist with 20+ years of experience. Former Berklee College of Music faculty.
                </p>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <span><FaUser /></span>
                </div>
                <h3 className="member-name">Sarah Chen</h3>
                <p className="member-role">Head of Content</p>
                <p className="member-bio">
                  Saxophonist and music educator. Specializes in jazz theory and improvisation.
                </p>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <span><FaLaptopCode /></span>
                </div>
                <h3 className="member-name">David Rodriguez</h3>
                <p className="member-role">Technical Director</p>
                <p className="member-bio">
                  Bassist and software engineer. Ensures our platform runs smoothly for all users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-content">
            <h2 className="section-title">Our Impact</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Active Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Video Lessons</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Expert Instructors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-content">
            <h2 className="cta-title">Join Our Community</h2>
            <p className="cta-description">
              Whether you&apos;re a beginner or a seasoned musician, there&apos;s a place for you in our community. 
              Start your jazz journey today and discover the endless possibilities of this incredible art form.
            </p>
            <div className="cta-actions">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
