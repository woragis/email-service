'use client';

import { useState } from 'react';
import { usePreferencesStore } from '../../stores/preferences';
import { Button } from '../ui';

interface EmailSidebarProps {
  className?: string;
}

export function EmailSidebar({ className }: EmailSidebarProps) {
  const { preferences } = usePreferencesStore();
  const [activeFolder, setActiveFolder] = useState('inbox');

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: '📥', count: 12 },
    { id: 'sent', name: 'Sent', icon: '📤', count: 0 },
    { id: 'drafts', name: 'Drafts', icon: '📝', count: 3 },
    { id: 'starred', name: 'Starred', icon: '⭐', count: 5 },
    { id: 'important', name: 'Important', icon: '❗', count: 8 },
    { id: 'trash', name: 'Trash', icon: '🗑️', count: 0 },
  ];

  const labels = [
    { id: 'work', name: 'Work', color: '#4285f4', count: 15 },
    { id: 'personal', name: 'Personal', color: '#34a853', count: 8 },
    { id: 'newsletters', name: 'Newsletters', color: '#fbbc04', count: 23 },
    { id: 'social', name: 'Social', color: '#ea4335', count: 6 },
  ];

  return (
    <div className={`email-sidebar ${className || ''}`}>
      {/* Compose Button */}
      <div className="compose-section">
        <Button 
          variant="primary" 
          className="compose-button"
          onClick={() => {/* TODO: Open compose modal */}}
        >
          ✏️ Compose
        </Button>
      </div>

      {/* Folders */}
      <div className="folders-section">
        <h3 className="section-title">Folders</h3>
        <nav className="folder-list">
          {folders.map((folder) => (
            <button
              key={folder.id}
              className={`folder-item ${activeFolder === folder.id ? 'active' : ''}`}
              onClick={() => setActiveFolder(folder.id)}
            >
              <span className="folder-icon">{folder.icon}</span>
              <span className="folder-name">{folder.name}</span>
              {folder.count > 0 && (
                <span className="folder-count">{folder.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Labels (Gmail-style) */}
      {preferences.emailUIStyle === 'gmail-classic' && (
        <div className="labels-section">
          <h3 className="section-title">Labels</h3>
          <nav className="label-list">
            {labels.map((label) => (
              <button
                key={label.id}
                className="label-item"
              >
                <span 
                  className="label-color" 
                  style={{ backgroundColor: label.color }}
                />
                <span className="label-name">{label.name}</span>
                {label.count > 0 && (
                  <span className="label-count">{label.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Smart Categories (Gmail-style) */}
      {preferences.emailUIStyle === 'gmail-classic' && (
        <div className="categories-section">
          <h3 className="section-title">Categories</h3>
          <nav className="category-list">
            <button className="category-item primary">
              <span className="category-icon">📧</span>
              <span className="category-name">Primary</span>
              <span className="category-count">12</span>
            </button>
            <button className="category-item social">
              <span className="category-icon">👥</span>
              <span className="category-name">Social</span>
              <span className="category-count">6</span>
            </button>
            <button className="category-item promotions">
              <span className="category-icon">🎯</span>
              <span className="category-name">Promotions</span>
              <span className="category-count">23</span>
            </button>
          </nav>
        </div>
      )}

      {/* Settings */}
      <div className="settings-section">
        <button className="settings-button">
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}
