import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';

interface SidebarToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isVisible,
  onToggle,
  className = ""
}) => {
  return (
    <Button
      variant="light"
      className={`sidebar-toggle shadow ${className}`}
      onClick={onToggle}
      aria-label={isVisible ? "Ocultar menú" : "Mostrar menú"}
      aria-expanded={isVisible}
    >
      <Icon 
        variant={isVisible ? "close" : "menu"} 
        size="lg"
        className="sidebar-toggle-icon"
      />
    </Button>
  );
};
