'use client';

import React from 'react';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'video' | 'blog' | 'course';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  size = 'md',
  children,
  icon,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  const variantClasses = `badge-${variant}`;
  const sizeClasses = `badge-${size}`;
  const removableClasses = removable ? 'badge-removable' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    removableClasses,
    className
  ].filter(Boolean).join(' ');

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span className={classes} {...props}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-content">{children}</span>
      {removable && (
        <button
          type="button"
          className="badge-remove"
          onClick={handleRemove}
          aria-label="Remove badge"
        >
          ×
        </button>
      )}
    </span>
  );
};
