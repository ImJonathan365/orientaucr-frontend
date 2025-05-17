import React from 'react';

type TextVariant =
  | 'body'        // Texto normal
  | 'caption'     // Texto pequeño
  | 'overline'    // Texto en mayúsculas
  | 'subtitle'    // Subtítulo
  | 'title'       // Título pequeño
  | 'display';    // Texto grande (para encabezados)

type TextWeight = 
  | 'light'       // 300
  | 'normal'      // 400
  | 'medium'      // 500 
  | 'semibold'    // 600
  | 'bold';       // 700

type TextColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light'
  | 'muted';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  className?: string;
  as?: React.ElementType; // Permite cambiar el elemento HTML
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'normal',
  color = 'dark',
  className = '',
  as: Component = 'p', // Por defecto es un párrafo
  children,
  ...props
}) => {
  // Mapeo de variants a clases de Bootstrap
  const variantClasses = {
    'body': '',
    'caption': 'small',
    'overline': 'text-uppercase fs-6',
    'subtitle': 'lead',
    'title': 'h5',
    'display': 'display-6'
  };

  // Mapeo de weights a clases
  const weightClasses = {
    'light': 'fw-light',
    'normal': 'fw-normal',
    'medium': 'fw-medium',
    'semibold': 'fw-semibold',
    'bold': 'fw-bold'
  };

  // Mapeo de colores
  const colorClasses = {
    'primary': 'text-primary',
    'secondary': 'text-secondary',
    'success': 'text-success',
    'danger': 'text-danger',
    'warning': 'text-warning',
    'info': 'text-info',
    'dark': 'text-dark',
    'light': 'text-light',
    'muted': 'text-muted'
  };

  return (
    <Component
      className={`${variantClasses[variant]} ${weightClasses[weight]} ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};