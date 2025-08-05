import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Text } from '../../atoms/Text/Text';

export interface NavLink {
  to: string;
  label: string;
}

interface NavigationMenuProps {
  links: NavLink[];
  isVertical?: boolean;
  onLinkClick?: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  links,
  isVertical = false,
  onLinkClick
}) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <ul className={`navbar-nav ${
      isVertical 
        ? "flex-column" 
        : "flex-lg-row align-items-center"
    }`}>
      {links.map((link) => {
        const isActive = isActiveLink(link.to);
        
        return (
          <li key={link.to} className="nav-item">
            <Link
              className="nav-link header-nav-link px-3"
              to={link.to}
              onClick={() => {
                if (onLinkClick) {
                  onLinkClick();
                }
              }}
            >
              <Text 
                variant="body" 
                className={`header-nav-text ${isActive ? "active" : "text-secondary"}`}
              >
                {link.label}
              </Text>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
