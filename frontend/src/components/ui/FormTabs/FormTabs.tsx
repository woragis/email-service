'use client';

import React from 'react';
import { FaEye } from 'react-icons/fa';
import './FormTabs.css';

export interface FormTabsProps {
  activeTab: 'edit' | 'preview';
  onTabChange: (tab: 'edit' | 'preview') => void;
  showPreview?: boolean;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  onTabChange,
  showPreview = true
}) => {
  return (
    <div className="form-tabs">
      <button
        type="button"
        className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
        onClick={() => onTabChange('edit')}
      >
        Edit
      </button>
      {showPreview && (
        <button
          type="button"
          className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => onTabChange('preview')}
        >
          <FaEye />
          Preview
        </button>
      )}
    </div>
  );
};
