import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';

export interface SidebarMenuItem {
  path: string;
  icon: string;
  label: string;
  permission: string;
}

interface SidebarNavigationProps {
  menuItems: SidebarMenuItem[];
  className?: string;
  onNavigate?: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  menuItems,
  className = "",
  onNavigate
}) => {
  const location = useLocation();

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className={`sidebar-navigation ${className}`}>
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path} className="nav-item mb-1">
              <Link
                to={item.path}
                className={`nav-link sidebar-nav-link ${
                  isActive ? 'active' : 'link-dark'
                }`}
                onClick={handleNavClick}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="d-flex align-items-center">
                  <Icon 
                    variant={item.icon.replace('bi-', '') as any} 
                    size="sm" 
                    className="me-3 sidebar-nav-icon"
                  />
                  <Text 
                    variant="body" 
                    className="sidebar-nav-text"
                  >
                    {item.label}
                  </Text>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
