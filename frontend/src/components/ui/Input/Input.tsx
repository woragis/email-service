import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'search';
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'resize';
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const inputClasses = [
    'input',
    variant !== 'default' ? `input-${variant}` : '',
    hasError ? 'input-error' : '',
    icon ? 'input-with-icon' : '',
    iconPosition === 'right' ? 'input-icon-right' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && iconPosition === 'left' && (
          <div className="input-icon input-icon-left">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="input-icon input-icon-right">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <div className="input-error-message">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div className="input-helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const textareaClasses = [
    'textarea',
    variant !== 'default' ? `textarea-${variant}` : '',
    hasError ? 'textarea-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={textareaId} className="input-label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <div className="input-error-message">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div className="input-helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const selectClasses = [
    'select',
    hasError ? 'select-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={selectClasses}
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
      {error && (
        <div className="input-error-message">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div className="input-helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};
