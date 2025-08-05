import React from 'react';
import { Icon } from '../../atoms/Icon/Icon';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({
  isOpen,
  onToggle
}) => {
  return (
    <button
      className="navbar-toggler d-lg-none"
      type="button"
      onClick={onToggle}
      aria-controls="navbarNav"
      aria-expanded={isOpen}
      aria-label="Toggle navigation"
    >
      <Icon 
        variant={isOpen ? "close" : "menu"} 
        size="lg" 
        className="text-dark"
      />
    </button>
  );
};
