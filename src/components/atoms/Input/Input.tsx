import React from 'react';

type InputSize = 'sm' | 'md' | 'lg';
type InputWidth = 'full' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
type InputVariant = | 'default' | 'search' | 'password' | 'email' | 'textarea' | 'select';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  width?: InputWidth;
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'md',
  width = 'full',
  label,
  error,
  className = '',
  options,
  rows = 3,
  ...props
}) => {
  const variantClasses = {
    'default': 'form-control',
    'search': 'form-control search-input',
    'password': 'form-control',
    'email': 'form-control',
    'textarea': 'form-control',
    'select': 'form-select'
  };

  const sizeClasses = {
    sm: 'form-control-sm',
    md: '',
    lg: 'form-control-lg'
  };

  // Clases para controlar el ancho
  const widthClasses = {
    full: 'w-100', // Ancho completo (100%)
    xl: 'w-75',    // 75% del contenedor
    lg: 'w-50',    // 50% (medio)
    md: 'w-25',    // 25%
    sm: 'w-150px', // Ancho fijo (necesita CSS adicional)
    xs: 'w-100px'  // Muy angosto
  };

  return (
    <div className={`mb-3 ${width !== 'full' ? 'd-inline-block' : ''} ${className}`}>
      {label && <label className="form-label">{label}</label>}
      
      {variant === 'textarea' ? (
        <textarea
          className={`${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses[width]} ${error ? 'is-invalid' : ''}`}
          rows={rows}
          {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
        />
      ) : variant === 'select' ? (
        <select
          className={`${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses[width]} ${error ? 'is-invalid' : ''}`}
          {...props as React.SelectHTMLAttributes<HTMLSelectElement>}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={`${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses[width]} ${error ? 'is-invalid' : ''}`}
          type={getInputType(variant)}
          {...props}
        />
      )}
      
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

function getInputType(variant: InputVariant): string {
  switch(variant) {
    case 'password': return 'password';
    case 'email': return 'email';
    case 'search': return 'search';
    default: return 'text';
  }
}