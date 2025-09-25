import React from 'react';
import { FaMusic, FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';
import './Footer.css';
import Link from 'next/link';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon"><FaMusic /></span>
              <span className="logo-text">Jazz Melodic</span>
            </div>
            <p className="footer-description">
              Where technique meets artistry. Learn from the masters, create with the community.
            </p>
            <div className="footer-social">
              <Link href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </Link>
              <Link href="#" className="social-link" aria-label="TikTok">
                <FaTiktok />
              </Link>
              <Link href="#" className="social-link" aria-label="YouTube">
                <FaYoutube />
              </Link>
              <Link href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            <div className="footer-section">
              <h3 className="footer-section-title">Content</h3>
              <ul className="footer-links-list">
                <li><Link href="/videos" className="footer-link">Videos</Link></li>
                <li><Link href="/blog" className="footer-link">Blog</Link></li>
                <li><Link href="/courses" className="footer-link">Courses</Link></li>
                <li><Link href="/tutorials" className="footer-link">Tutorials</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">Community</h3>
              <ul className="footer-links-list">
                <li><Link href="/discord" className="footer-link">Discord</Link></li>
                <li><Link href="/forum" className="footer-link">Forum</Link></li>
                <li><Link href="/events" className="footer-link">Events</Link></li>
                <li><Link href="/contribute" className="footer-link">Contribute</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">Support</h3>
              <ul className="footer-links-list">
                <li><Link href="/help" className="footer-link">Help Center</Link></li>
                <li><Link href="/contact" className="footer-link">Contact</Link></li>
                <li><Link href="/faq" className="footer-link">FAQ</Link></li>
                <li><Link href="/feedback" className="footer-link">Feedback</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">Legal</h3>
              <ul className="footer-links-list">
                <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
                <li><Link href="/cookies" className="footer-link">Cookie Policy</Link></li>
                <li><Link href="/dmca" className="footer-link">DMCA</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 Jazz Melodic. All rights reserved.</p>
          </div>
          <div className="footer-bottom-links">
            <Link href="/sitemap" className="footer-bottom-link">Sitemap</Link>
            <Link href="/accessibility" className="footer-bottom-link">Accessibility</Link>
            <Link href="/status" className="footer-bottom-link">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
