import React from 'react';

type TitleVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TitleColor = 'primary' | 'secondary' | 'dark' | 'light' | 'success' | 'danger' | 'warning' | 'info';
type TitleWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: TitleVariant;
  color?: TitleColor;
  weight?: TitleWeight;
  className?: string;
  underline?: boolean;
  centered?: boolean;
}

export const Title: React.FC<TitleProps> = ({
  variant = 'h1',
  color = 'dark',
  weight = 'bold',
  className = '',
  underline = false,
  centered = false,
  children,
  ...props
}) => {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    dark: 'text-dark',
    light: 'text-light',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-info'
  };

  const weightClasses = {
    light: 'fw-light',
    normal: 'fw-normal',
    medium: 'fw-medium',
    semibold: 'fw-semibold',
    bold: 'fw-bold'
  };

  const Tag = variant;

  return (
    <Tag
      className={`
        ${colorClasses[color]}
        ${weightClasses[weight]}
        ${underline ? 'border-bottom pb-2' : ''}
        ${centered ? 'text-center' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
};