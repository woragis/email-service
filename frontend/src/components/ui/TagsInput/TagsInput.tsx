'use client';

import React, { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import './TagsInput.css';

export interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onTagsChange,
  placeholder = 'Add a tag',
  maxTags
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      if (!maxTags || tags.length < maxTags) {
        onTagsChange([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  return (
    <div className="tags-input">
      <div className="tags-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button
              type="button"
              onClick={() => handleTagRemove(tag)}
              className="tag-remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="tag-input-row">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
          disabled={maxTags ? tags.length >= maxTags : false}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleTagAdd}
          disabled={!tagInput.trim() || tags.includes(tagInput.trim()) || (maxTags ? tags.length >= maxTags : false)}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
