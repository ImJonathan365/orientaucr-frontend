import React from 'react';
import { Icon } from '../../atoms/Icon/Icon';

export interface CardProps {
  variant?: 'default' | 'academic' | 'feature' | 'stat';
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
  className?: string;
  children: React.ReactNode;
}

export interface CardHeaderProps {
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ variant = 'default', color, className = '', children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'academic':
        return 'h-100 border-0 shadow-sm';
      case 'feature':
        return 'text-center h-100 shadow-sm';
      case 'stat':
        return 'border-0 shadow-sm bg-gradient';
      default:
        return 'shadow-sm';
    }
  };

  const colorClass = color ? `border-${color}` : '';

  return (
    <div className={`card ${getVariantClasses()} ${colorClass} ${className}`}>
      {children}
    </div>
  );
};

Card.Header = ({ icon, children, className = '' }) => (
  <div className={`card-header d-flex align-items-center ${className}`}>
    {icon && <Icon variant={icon as any} size="lg" className="me-2" />}
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);
