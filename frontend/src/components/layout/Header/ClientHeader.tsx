'use client';

import React from 'react';
import { FaMusic } from 'react-icons/fa';
import { Button } from '../../ui';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { useAuth } from '@/lib/stores';
import { useLogout } from '@/hooks';
import './Header.css';
import Link from 'next/link';

export interface ClientHeaderProps {
  className?: string;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ className = '' }) => {
  const { isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className={`header ${className}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link href="/" className="logo-link">
            <span className="logo-icon"><FaMusic /></span>
            <span className="logo-text">Jazz Melodic</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="/videos" className="nav-link">
                Videos
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/blog" className="nav-link">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/courses" className="nav-link">
                Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">
                About
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link href="/profile" className="nav-link">
                  Profile
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <ThemeSwitcher />
          {isAuthenticated ? (
            <>
              <div className="user-menu">
                <span className="user-greeting">
                  Welcome, {user?.username}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
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
