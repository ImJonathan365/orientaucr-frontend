import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export type IconVariant = 
  // Iconos generales
  | 'trash' | 'check' | 'edit' | 'add' | 'close' | 'search' | 'play'
  | 'arrow-left' | 'arrow-right' | 'settings' | 'info' | 'warning' | 'error'
  // Iconos para el header
  | 'home' | 'book' | 'building' | 'clipboard' | 'user' | 'menu'| 'bell' | 'help' | 'logout'
  // Iconos para sidebar
  | 'journal' | 'calendar-event' | 'people' | 'shield' | 'tags'
  // Redes sociales
  | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok'
  // Iconos adicionales útiles
  | 'calendar' | 'envelope' | 'phone' | 'map' | 'download' | 'upload'
  | 'heart' | 'star' | 'share' | 'filter' | 'grid' | 'list'
  | 'chevron-down' | 'chevron-right';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
type IconWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: IconVariant;
  size?: IconSize;
  width?: IconWidth;
  color?: string;
  className?: string;
  fixedSize?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  variant = 'check',
  size = 'md',
  width,
  color = 'currentColor',
  className = '',
  fixedSize = false,
  ...props
}) => {
  const iconMap: Record<IconVariant, string> = {
    // Iconos generales
    'trash': 'trash',
    'check': 'check',
    'edit': 'pencil',
    'add': 'plus',
    'close': 'x',
    'search': 'search',
    'arrow-left': 'arrow-left',
    'arrow-right': 'arrow-right',
    'settings': 'gear',
    'info': 'info-circle',
    'warning': 'exclamation-triangle',
    'error': 'x-circle',
    'play': 'play-fill',
    
    // Iconos para el header
    'home': 'house',
    'book': 'book',
    'building': 'building',
    'clipboard': 'clipboard',
    'user': 'person',
    'menu': 'list',
    
    // Iconos para sidebar
    'journal': 'journal-text',
    'calendar-event': 'calendar-event',
    'people': 'people-fill',
    'shield': 'shield-check',
    'tags': 'tags-fill',
    
    // Redes sociales
    'facebook': 'facebook',
    'instagram': 'instagram',
    'twitter': 'twitter',
    'linkedin': 'linkedin',
    'youtube': 'youtube',
    'tiktok': 'tiktok',
    
    // Iconos adicionales
    'calendar': 'calendar',
    'envelope': 'envelope',
    'phone': 'telephone',
    'map': 'map',
    'download': 'download',
    'upload': 'upload',
    'heart': 'heart',
    'star': 'star',
    'share': 'share',
    'filter': 'filter',
    'grid': 'grid',
    'list': 'list',
    'chevron-down': 'chevron-down',
    'chevron-right': 'chevron-right',
    
    // Iconos para ProfileDropdown
    'bell': 'bell',
    'help': 'question-circle',
    'logout': 'box-arrow-right'
  };

  const sizeMap: Record<string, string> = {
    'xs': '0.75rem',  // 12px
    'sm': '1rem',     // 16px
    'md': '1.25rem',  // 20px
    'lg': '1.5rem',   // 24px
    'xl': '2rem'      // 32px
  };

  const resolvedSize = typeof size === 'string' && sizeMap[size] 
    ? sizeMap[size] 
    : typeof size === 'number' 
      ? `${size}px` 
      : size;

  const resolvedWidth = typeof width === 'string' && sizeMap[width]
    ? sizeMap[width]
    : typeof width === 'number'
      ? `${width}px`
      : width || resolvedSize;

  return (
    <i
      className={`bi bi-${iconMap[variant]} ${className}`}
      style={{
        fontSize: !fixedSize ? resolvedSize : undefined,
        color: color,
        width: resolvedWidth,
        height: resolvedSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'baseline',
        lineHeight: '1',
        ...props.style
      }}
      aria-hidden="true"
      {...props}
    />
  );
};