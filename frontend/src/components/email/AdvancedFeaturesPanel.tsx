'use client';

import { useState } from 'react';
import { Button } from '../ui';

export function AdvancedFeaturesPanel() {
  const [activeTab, setActiveTab] = useState<'rules' | 'categories' | 'templates'>('rules');

  return (
    <div className="advanced-features-panel">
      <div className="features-tabs">
        <button
          className={`feature-tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Rules
        </button>
        <button
          className={`feature-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`feature-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
      </div>

      <div className="features-content">
        {activeTab === 'rules' && (
          <div className="rules-section">
            <h4>Email Rules</h4>
            <p>Automatically organize emails based on conditions</p>
            <Button variant="primary" size="sm">
              Create Rule
            </Button>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-section">
            <h4>Categories</h4>
            <p>Organize emails with color-coded categories</p>
            <Button variant="primary" size="sm">
              Manage Categories
            </Button>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-section">
            <h4>Email Templates</h4>
            <p>Save time with reusable email templates</p>
            <Button variant="primary" size="sm">
              Create Template
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
