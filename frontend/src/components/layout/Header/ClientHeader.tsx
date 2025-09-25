'use client';

import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { usePreferencesStore } from '../../../stores/preferences';
import './Header.css';
import Link from 'next/link';

export interface ClientHeaderProps {
  className?: string;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ className = '' }) => {
  const { preferences } = usePreferencesStore();


  return (
    <header className={`header ${className}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link href="/" className="logo-link">
            <span className="logo-icon"><FaEnvelope /></span>
            <span className="logo-text">EmailService</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="/email" className="nav-link">
                Inbox
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/email?folder=sent" className="nav-link">
                Sent
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/email?folder=drafts" className="nav-link">
                Drafts
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/email?folder=starred" className="nav-link">
                Starred
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/email?folder=trash" className="nav-link">
                Trash
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" aria-label="Toggle mobile menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </header>
  );
};
