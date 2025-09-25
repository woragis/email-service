'use client';

import React, { useState, useEffect } from 'react';
import './ThemeSwitcher.css';

export interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'toggle' | 'button' | 'preview';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  showLabel = false,
  variant = 'toggle'
}) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="theme-switcher-skeleton" />;
  }

  if (variant === 'button') {
    return (
      <button
        className={`theme-switcher-btn ${className}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <span className="icon">
          {theme === 'dark' ? '☀️' : '🌙'}
        </span>
        {showLabel && (
          <span className="label">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'preview') {
    return (
      <div className={`theme-preview ${className}`}>
        <button
          className={`theme-preview-card ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => {
            setTheme('dark');
            applyTheme('dark');
          }}
        >
          <div className="theme-preview-dark">
            <div className="theme-preview-title">Dark Theme</div>
            <div className="theme-preview-description">Modern, sleek interface</div>
            <div className="theme-preview-colors">
              <div className="theme-preview-color" style={{ background: '#0a0a0a' }}></div>
              <div className="theme-preview-color" style={{ background: '#00d4ff' }}></div>
              <div className="theme-preview-color" style={{ background: '#00ff88' }}></div>
            </div>
          </div>
        </button>
        
        <button
          className={`theme-preview-card ${theme === 'light' ? 'active' : ''}`}
          onClick={() => {
            setTheme('light');
            applyTheme('light');
          }}
        >
          <div className="theme-preview-light">
            <div className="theme-preview-title">Light Theme</div>
            <div className="theme-preview-description">Clean, bright interface</div>
            <div className="theme-preview-colors">
              <div className="theme-preview-color" style={{ background: '#ffffff' }}></div>
              <div className="theme-preview-color" style={{ background: '#00d4ff' }}></div>
              <div className="theme-preview-color" style={{ background: '#00ff88' }}></div>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`theme-switcher ${className}`}>
      {showLabel && (
        <div className="theme-indicator">
          <span className="theme-label">
            {theme === 'dark' ? 'Dark' : 'Light'} Mode
          </span>
        </div>
      )}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <span className="theme-toggle-handle"></span>
      </button>
    </div>
  );
};
