'use client';

import { useState } from 'react';
import { usePreferencesStore } from '../../stores/preferences';
import { UI_STYLE_CONFIGS, UserPreferences } from '../../types/preferences';
import { Modal, Button, Card } from '../ui';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { preferences, updatePreferences, setTheme, setEmailUIStyle } = usePreferencesStore();
  const [tempPreferences, setTempPreferences] = useState<UserPreferences>(preferences);

  const handleSave = () => {
    updatePreferences(tempPreferences);
    onClose();
  };

  const handleCancel = () => {
    setTempPreferences(preferences);
    onClose();
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTempPreferences(prev => ({ ...prev, theme }));
  };

  const handleUIStyleChange = (emailUIStyle: UserPreferences['emailUIStyle']) => {
    setTempPreferences(prev => ({ ...prev, emailUIStyle }));
  };

  const currentConfig = UI_STYLE_CONFIGS[tempPreferences.emailUIStyle];

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="large">
      <div className="preferences-modal">
        <div className="modal-header">
          <h2 className="modal-title">Email Interface Preferences</h2>
          <p className="modal-subtitle">Customize your email experience</p>
        </div>

        <div className="preferences-content">
          {/* Theme Selection */}
          <section className="preference-section">
            <h3 className="section-title">Theme</h3>
            <div className="theme-options">
              <div 
                className={`theme-option ${tempPreferences.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="theme-preview light">
                  <div className="preview-header" />
                  <div className="preview-content" />
                  <div className="preview-sidebar" />
                </div>
                <span>Light Mode</span>
              </div>
              <div 
                className={`theme-option ${tempPreferences.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="theme-preview dark">
                  <div className="preview-header" />
                  <div className="preview-content" />
                  <div className="preview-sidebar" />
                </div>
                <span>Dark Mode</span>
              </div>
            </div>
          </section>

          {/* UI Style Selection */}
          <section className="preference-section">
            <h3 className="section-title">Interface Style</h3>
            <div className="ui-style-grid">
              {Object.entries(UI_STYLE_CONFIGS).map(([key, config]) => (
                <Card
                  key={key}
                  className={`ui-style-card ${tempPreferences.emailUIStyle === key ? 'active' : ''}`}
                  onClick={() => handleUIStyleChange(key as UserPreferences['emailUIStyle'])}
                >
                  <div className="ui-style-preview">
                    <div className="preview-layout" data-layout={config.layout}>
                      <div className="preview-sidebar" />
                      <div className="preview-list" />
                      <div className="preview-content" />
                    </div>
                  </div>
                  <div className="ui-style-info">
                    <h4 className="ui-style-name">{config.name}</h4>
                    <p className="ui-style-description">{config.description}</p>
                    <div className="ui-style-features">
                      {config.features.map((feature, index) => (
                        <span key={index} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Layout Preferences */}
          <section className="preference-section">
            <h3 className="section-title">Layout Settings</h3>
            <div className="layout-controls">
              <div className="control-group">
                <label className="control-label">Email Density</label>
                <select
                  value={tempPreferences.emailDisplay.density}
                  onChange={(e) => setTempPreferences(prev => ({
                    ...prev,
                    emailDisplay: {
                      ...prev.emailDisplay,
                      density: e.target.value as 'comfortable' | 'cozy' | 'compact'
                    }
                  }))}
                  className="control-select"
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="cozy">Cozy</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              <div className="control-group">
                <label className="control-label">Sidebar Width</label>
                <input
                  type="range"
                  min="200"
                  max="350"
                  value={tempPreferences.layout.sidebarWidth}
                  onChange={(e) => setTempPreferences(prev => ({
                    ...prev,
                    layout: {
                      ...prev.layout,
                      sidebarWidth: parseInt(e.target.value)
                    }
                  }))}
                  className="control-slider"
                />
                <span className="control-value">{tempPreferences.layout.sidebarWidth}px</span>
              </div>

              <div className="control-group">
                <label className="control-label">
                  <input
                    type="checkbox"
                    checked={tempPreferences.emailDisplay.conversationView}
                    onChange={(e) => setTempPreferences(prev => ({
                      ...prev,
                      emailDisplay: {
                        ...prev.emailDisplay,
                        conversationView: e.target.checked
                      }
                    }))}
                  />
                  Conversation View
                </label>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="preference-section">
            <h3 className="section-title">Features</h3>
            <div className="feature-toggles">
              <div className="toggle-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={tempPreferences.features.keyboardShortcuts}
                    onChange={(e) => setTempPreferences(prev => ({
                      ...prev,
                      features: {
                        ...prev.features,
                        keyboardShortcuts: e.target.checked
                      }
                    }))}
                  />
                  Keyboard Shortcuts
                </label>
              </div>

              <div className="toggle-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={tempPreferences.features.autoSave}
                    onChange={(e) => setTempPreferences(prev => ({
                      ...prev,
                      features: {
                        ...prev.features,
                        autoSave: e.target.checked
                      }
                    }))}
                  />
                  Auto-save Drafts
                </label>
              </div>

              <div className="toggle-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={tempPreferences.features.templates}
                    onChange={(e) => setTempPreferences(prev => ({
                      ...prev,
                      features: {
                        ...prev.features,
                        templates: e.target.checked
                      }
                    }))}
                  />
                  Email Templates
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </Modal>
  );
}
