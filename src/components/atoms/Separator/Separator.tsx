import React from 'react';

type SeparatorVariant = 
  | 'horizontal'    // Línea horizontal (por defecto)
  | 'vertical'      // Línea vertical
  | 'dashed'        // Línea discontinua
  | 'text'          // Separador con texto en el centro
  | 'icon';         // Separador con icono en el centro

interface SeparatorProps {
  variant?: SeparatorVariant;
  color?: string;   // Color personalizado (opcional)
  thickness?: number; // Grosor en px
  className?: string;
  children?: React.ReactNode; // Para variantes con texto/icono
}

export const Separator: React.FC<SeparatorProps> = ({
  variant = 'horizontal',
  color = '#dee2e6', // Color gris claro de Bootstrap
  thickness = 1,
  className = '',
  children,
}) => {
  // Estilos base
  const baseStyle = {
    backgroundColor: color,
    margin: variant === 'vertical' ? '0 1rem' : '1rem 0',
  };

  // Estilos por variante
  const variantStyles = {
    horizontal: {
      width: '100%',
      height: `${thickness}px`,
    },
    vertical: {
      width: `${thickness}px`,
      height: '100%',
      minHeight: '1rem',
    },
    dashed: {
      border: 'none',
      height: `${thickness}px`,
      backgroundImage: `linear-gradient(to right, ${color} 50%, transparent 50%)`,
      backgroundSize: `${thickness * 4}px ${thickness}px`,
      width: '100%',
    },
    text: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      '&::before, &::after': {
        content: '""',
        flex: 1,
        height: `${thickness}px`,
        backgroundColor: color,
      },
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      '&::before, &::after': {
        content: '""',
        flex: 1,
        height: `${thickness}px`,
        backgroundColor: color,
      },
    },
  };

  // Clases de Bootstrap para variantes comunes
  const bootstrapClasses = {
    horizontal: 'border-top',
    vertical: 'border-start',
    dashed: 'border-top border-top-dashed',
  };

  if (variant === 'text' || variant === 'icon') {
    return (
      <div 
        className={`d-flex align-items-center ${className}`}
        style={{ ...baseStyle, ...variantStyles.text }}
      >
        <div style={{ flex: 1, height: `${thickness}px`, backgroundColor: color }} />
        <div className="px-3">{children}</div>
        <div style={{ flex: 1, height: `${thickness}px`, backgroundColor: color }} />
      </div>
    );
  }

  return (
    <div
      className={`${bootstrapClasses[variant] || ''} ${className}`}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        // Sobreescribe estilos si es vertical
        ...(variant === 'vertical' ? { 
          borderLeft: `${thickness}px solid ${color}`,
          backgroundColor: 'transparent' 
        } : {})
      }}
    />
  );
};