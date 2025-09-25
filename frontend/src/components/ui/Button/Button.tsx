import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const loadingClasses = loading ? 'btn-loading' : '';
  const disabledClasses = disabled || loading ? 'btn-disabled' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    loadingClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (loading) {
      return <span className="loading-spinner" />;
    }
    return icon;
  };

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};
