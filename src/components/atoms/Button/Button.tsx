import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'info' | 'danger' | 'warning' | 'light' | 'dark' | 'link';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded font-medium transition-colors';
  const variantClasses = {
   primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    info: 'btn btn-info',
    danger: 'btn btn-danger',
    warning: 'btn btn-warning',
    light: 'btn btn-light',
    dark: 'btn btn-dark',
    link: 'btn btn-link',
    outline: 'btn btn-outline-primary'
  };
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};