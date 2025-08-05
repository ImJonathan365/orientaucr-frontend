import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  animated?: boolean;
  showLabel?: boolean;
  labelFormat?: 'percentage' | 'fraction' | 'custom';
  customLabel?: string;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  striped = false,
  animated = false,
  showLabel = false,
  labelFormat = 'percentage',
  customLabel,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  };

  const sizeClasses = {
    sm: 'progress-sm',
    md: '',
    lg: 'progress-lg'
  };

  const getLabel = () => {
    if (customLabel) return customLabel;
    if (labelFormat === 'percentage') return `${Math.round(percentage)}%`;
    if (labelFormat === 'fraction') return `${value}/${max}`;
    return '';
  };

  const progressBarClasses = [
    'progress-bar',
    variantClasses[variant],
    striped ? 'progress-bar-striped' : '',
    animated ? 'progress-bar-animated' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`progress ${sizeClasses[size]} ${className}`} 
      style={{ height: size === 'sm' ? '0.5rem' : size === 'lg' ? '1.5rem' : '1rem' }}
      {...props}
    >
      <div
        className={progressBarClasses}
        role="progressbar"
        style={{ width: `${percentage}%` }}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {showLabel && getLabel()}
      </div>
    </div>
  );
};
