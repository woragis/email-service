'use client';

import { useEffect, useState } from 'react';
import { usePreferencesStore } from '../../stores/preferences';
import { THEME_CSS_MAPPING, DARK_THEME_CSS_MAPPING } from '../../types/preferences';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { preferences } = usePreferencesStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemeCSS = async () => {
      try {
        // Remove existing email theme CSS
        const existingLinks = document.querySelectorAll('link[data-email-theme]');
        existingLinks.forEach(link => link.remove());

        // Determine which CSS file to load
        const cssFile = preferences.theme === 'dark' 
          ? DARK_THEME_CSS_MAPPING[preferences.emailUIStyle]
          : THEME_CSS_MAPPING[preferences.emailUIStyle];

        // Create new link element
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssFile;
        link.setAttribute('data-email-theme', preferences.emailUIStyle);
        link.setAttribute('data-theme-mode', preferences.theme);

        // Add to document head
        document.head.appendChild(link);

        // Wait for CSS to load
        await new Promise((resolve) => {
          link.onload = resolve;
          link.onerror = resolve; // Continue even if CSS fails to load
        });

        // Update document attributes for theme
        document.documentElement.setAttribute('data-theme', preferences.theme);
        document.documentElement.setAttribute('data-email-ui', preferences.emailUIStyle);
        
        // Add layout classes
        document.documentElement.classList.remove(
          'gmail-classic', 'outlook-advanced', 'apple-minimal', 'proton-privacy'
        );
        document.documentElement.classList.add(preferences.emailUIStyle);

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load theme CSS:', error);
        setIsLoading(false);
      }
    };

    loadThemeCSS();
  }, [preferences.theme, preferences.emailUIStyle]);

  // Show loading state while theme is being applied
  if (isLoading) {
    return (
      <div className="theme-loading">
        <div className="loading-spinner" />
        <p>Loading theme...</p>
      </div>
    );
  }

  return <>{children}</>;
}
