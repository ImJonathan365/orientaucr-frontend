import React from 'react';

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'online' | 'offline' | 'busy' | 'away' | 'loading' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  showLabel?: boolean;
  position?: 'standalone' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  children?: React.ReactNode;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  pulse = false,
  showLabel = false,
  position = 'standalone',
  children,
  className = '',
  ...props
}) => {
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-secondary',
    busy: 'bg-danger',
    away: 'bg-warning',
    loading: 'bg-primary',
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning'
  };

  const statusLabels = {
    online: 'En línea',
    offline: 'Desconectado',
    busy: 'Ocupado',
    away: 'Ausente',
    loading: 'Cargando',
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia'
  };

  const sizeClasses = {
    sm: 'status-indicator-sm',
    md: 'status-indicator-md',
    lg: 'status-indicator-lg'
  };

  const sizeStyles = {
    sm: { width: '8px', height: '8px' },
    md: { width: '12px', height: '12px' },
    lg: { width: '16px', height: '16px' }
  };

  const positionClasses = {
    standalone: '',
    'top-right': 'position-absolute top-0 start-100 translate-middle',
    'bottom-right': 'position-absolute bottom-0 start-100 translate-middle',
    'top-left': 'position-absolute top-0 start-0 translate-middle',
    'bottom-left': 'position-absolute bottom-0 start-0 translate-middle'
  };

  const indicatorClasses = [
    'status-indicator',
    'rounded-circle',
    'border border-2 border-white',
    statusColors[status],
    sizeClasses[size],
    positionClasses[position],
    pulse ? 'status-pulse' : '',
    className
  ].filter(Boolean).join(' ');

  const indicator = (
    <span
      className={indicatorClasses}
      style={sizeStyles[size]}
      title={statusLabels[status]}
      {...props}
    />
  );

  if (position === 'standalone') {
    return (
      <span className="d-inline-flex align-items-center gap-2">
        {indicator}
        {showLabel && <span className="status-label">{statusLabels[status]}</span>}
      </span>
    );
  }

  return (
    <span className="position-relative d-inline-block">
      {children}
      {indicator}
    </span>
  );
};
