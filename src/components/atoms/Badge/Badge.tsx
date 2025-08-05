import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  pill = false,
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning text-dark',
    info: 'bg-info',
    light: 'bg-light text-dark',
    dark: 'bg-dark'
  };

  const sizeClasses = {
    sm: 'fs-7 px-2 py-1',
    md: 'fs-6 px-2 py-1',
    lg: 'fs-5 px-3 py-2'
  };

  const pillClass = pill ? 'rounded-pill' : '';

  return (
    <span
      className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${pillClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
