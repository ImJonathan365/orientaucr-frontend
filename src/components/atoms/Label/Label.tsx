import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: 'default' | 'semibold' | 'bold';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  variant = 'default',
  size = 'md',
  required = false,
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'form-label',
    semibold: 'form-label fw-semibold',
    bold: 'form-label fw-bold'
  };

  const sizeClasses = {
    sm: 'fs-7',
    md: '',
    lg: 'fs-5'
  };

  return (
    <label
      className={`${variantClasses[variant]} ${sizeClasses[size]} mb-1 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
  );
};
