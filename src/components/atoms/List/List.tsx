import React from 'react';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  variant?: 'unordered' | 'ordered' | 'unstyled' | 'inline' | 'group';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const List: React.FC<ListProps> & {
  Item: React.FC<ListItemProps>;
} = ({
  variant = 'unordered',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    unordered: '',
    ordered: '',
    unstyled: 'list-unstyled',
    inline: 'list-inline',
    group: 'list-group'
  };

  const sizeClasses = {
    sm: 'fs-7',
    md: '',
    lg: 'fs-5'
  };

  const Component = variant === 'ordered' ? 'ol' : 'ul';

  return (
    <Component
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  variant?: 'default' | 'group-item' | 'inline-item';
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

List.Item = ({
  variant = 'default',
  active = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: '',
    'group-item': 'list-group-item',
    'inline-item': 'list-inline-item'
  };

  const stateClasses = [
    active ? 'active' : '',
    disabled ? 'disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <li
      className={`${variantClasses[variant]} ${stateClasses} ${className}`}
      {...props}
    >
      {children}
    </li>
  );
};
