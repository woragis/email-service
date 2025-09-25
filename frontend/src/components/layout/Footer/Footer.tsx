import React from 'react';
import { FaEnvelope, FaShieldAlt, FaLock, FaGlobe, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
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
              <span className="logo-icon"><FaEnvelope /></span>
              <span className="logo-text">EmailService</span>
            </div>
            <p className="footer-description">
              Secure, reliable, and user-friendly email service. Choose your perfect interface style.
            </p>
            <div className="footer-features">
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <span>Secure</span>
              </div>
              <div className="feature-item">
                <FaLock className="feature-icon" />
                <span>Private</span>
              </div>
              <div className="feature-item">
                <FaGlobe className="feature-icon" />
                <span>Global</span>
              </div>
            </div>
            <div className="footer-social">
              <Link href="#" className="social-link" aria-label="GitHub">
                <FaGithub />
              </Link>
              <Link href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </Link>
              <Link href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            <div className="footer-section">
              <h3 className="footer-section-title">Email</h3>
              <ul className="footer-links-list">
                <li><Link href="/email" className="footer-link">Inbox</Link></li>
                <li><Link href="/email?folder=sent" className="footer-link">Sent</Link></li>
                <li><Link href="/email?folder=drafts" className="footer-link">Drafts</Link></li>
                <li><Link href="/email?folder=trash" className="footer-link">Trash</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">Features</h3>
              <ul className="footer-links-list">
                <li><Link href="/email?style=gmail-classic" className="footer-link">Gmail Classic</Link></li>
                <li><Link href="/email?style=outlook-advanced" className="footer-link">Outlook Advanced</Link></li>
                <li><Link href="/email?style=apple-minimal" className="footer-link">Apple Minimal</Link></li>
                <li><Link href="/email?style=proton-privacy" className="footer-link">Proton Privacy</Link></li>
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
                <li><Link href="/security" className="footer-link">Security</Link></li>
                <li><Link href="/compliance" className="footer-link">Compliance</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 EmailService. All rights reserved.</p>
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
