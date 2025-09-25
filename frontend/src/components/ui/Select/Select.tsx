'use client';

import React from 'react';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  error = false,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={`select-wrapper ${className}`}>
      <select
        className={`select ${error ? 'select--error' : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <span className={`select-helper-text ${error ? 'select-helper-text--error' : ''}`}>
          {helperText}
        </span>
      )}
    </div>
  );
};
