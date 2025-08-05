import React from 'react';
import { Text } from '../../atoms/Text/Text';
import { Image } from '../../atoms/Image/Image';
import { Link } from 'react-router-dom';
import { NavigationMenu } from '../NavigationMenu/NavigationMenu';
import { AuthenticatedNav } from '../AuthenticatedNav/AuthenticatedNav';
import { PublicNav } from '../PublicNav/PublicNav';
import { MobileMenuToggle } from '../MobileMenuToggle/MobileMenuToggle';
import { useHeaderState } from '../../../hooks/useHeaderState';
import { useNavigation } from '../../../hooks/useNavigation';

export const HeaderBar: React.FC = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    user,
    closeAllMenus
  } = useHeaderState();

  const { getFilteredLinks } = useNavigation();

  const availableLinks = getFilteredLinks(!!user);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm" style={{ minHeight: 70 }}>
      <div className="container-fluid px-4">
        {/* Brand */}
        <div className="d-flex align-items-center">
          <Image
            src="/images/orientaucr.jpg"
            alt="orientaucr"
            variant="hero"
            className="img-fluid"
            style={{ maxWidth: 100 }}
          />
          <Link className="navbar-brand d-flex align-items-center ms-2" to={user ? "/home" : "/"}>
            <Text variant="subtitle" weight="bold" className="text-success">
              OrientaUCR
            </Text>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <MobileMenuToggle 
          isOpen={isMenuOpen} 
          onToggle={() => setIsMenuOpen(v => !v)} 
        />

        {/* Navigation Wrapper */}
        <div
          className={`header-nav-wrapper ${
            isMenuOpen 
              ? "d-flex flex-column position-absolute top-100 end-0 bg-white p-3 rounded shadow mt-2" 
              : "d-none d-lg-flex align-items-center justify-content-end"
          }`}
          style={isMenuOpen ? { zIndex: 1050, right: 16 } : {}}
        >
          {/* Navigation Links */}
          <div className="d-flex align-items-center">
            <NavigationMenu 
              links={availableLinks}
              isVertical={isMenuOpen}
              onLinkClick={closeAllMenus}
            />
          </div>

          {/* Auth Section */}
          <div className="d-flex align-items-center ms-3">
            {user ? (
              <AuthenticatedNav onMenuClose={closeAllMenus} />
            ) : (
              <PublicNav onMenuClose={closeAllMenus} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
