import React from 'react';

type ImageVariant = 
  | 'avatar'      // Para imágenes de perfil
  | 'thumbnail'   // Miniaturas
  | 'card'        // Imágenes para cards
  | 'hero'        // Imágenes hero grandes
  | 'rounded'     // Imágenes redondeadas
  | 'circle';     // Imágenes circulares

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: ImageVariant;
  className?: string;
  fallbackSrc?: string;
}

export const Image: React.FC<ImageProps> = ({
  variant = 'thumbnail',
  className = '',
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = React.useState(false);

  // Mapeo de variants a clases de Bootstrap
  const variantClasses: Record<ImageVariant, string> = {
    'avatar': 'rounded-circle object-fit-cover',
    'thumbnail': 'img-thumbnail',
    'card': 'card-img-top',
    'hero': 'w-100 h-auto',
    'rounded': 'rounded',
    'circle': 'rounded-circle'
  };

  // Manejo de errores
  const handleError = () => {
    setError(true);
  };

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      className={`${variantClasses[variant]} ${className}`}
      onError={handleError}
      src={error && fallbackSrc ? fallbackSrc : props.src}
      {...props}
    />
  );
};