import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: 'solid' | 'dashed' | 'dotted';
  orientation?: 'horizontal' | 'vertical';
  color?: 'primary' | 'secondary' | 'light' | 'dark' | 'muted';
  thickness?: number;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'solid',
  orientation = 'horizontal',
  color = 'light',
  thickness = 1,
  spacing = 'md',
  className = '',
  ...props
}) => {
  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    light: 'border-light',
    dark: 'border-dark',
    muted: 'border-muted'
  };

  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-3' : 'mx-3',
    lg: orientation === 'horizontal' ? 'my-4' : 'mx-4'
  };

  const variantStyles = {
    solid: { borderStyle: 'solid' },
    dashed: { borderStyle: 'dashed' },
    dotted: { borderStyle: 'dotted' }
  };

  const orientationStyles = orientation === 'vertical' 
    ? { 
        borderLeft: `${thickness}px ${variant} var(--bs-border-color)`,
        borderTop: 'none',
        height: 'auto',
        minHeight: '1rem',
        width: '1px'
      }
    : { 
        borderTop: `${thickness}px ${variant} var(--bs-border-color)`,
        borderLeft: 'none'
      };

  return (
    <hr
      className={`${colorClasses[color]} ${spacingClasses[spacing]} ${className}`}
      style={{
        ...variantStyles[variant],
        ...orientationStyles,
        margin: orientation === 'vertical' ? '0 auto' : undefined
      }}
      {...props}
    />
  );
};
