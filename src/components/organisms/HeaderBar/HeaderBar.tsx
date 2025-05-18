import { Text } from '../../atoms/Text/Text';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import React, { useState } from 'react';
import { Separator } from '../../atoms/Separator/Separator';

export const HeaderBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const styles = {
    headerWrapper: {
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    navItem: {
      marginRight: '20px'
    },
    navLink: {
      color: '#6c757d',
      fontWeight: 500,
      transition: 'color 0.3s'
    },
    navLinkHover: {
      color: '#198754'
    },
    circleButton: {
      width: '40px',
      height: '40px'
    },
    menuButton: {
      backgroundColor: '#e9ecef'
    }
  };

  return (
    <>
      <header className="bg-white py-3" style={styles.headerWrapper}>
        <div className="container">
          <div className="row align-items-center">
            {/* Logo + Botón móvil (extremo izquierdo) */}
            <div className="col-auto d-flex align-items-center">
              <Button
                variant="light"
                className="rounded-circle p-0 d-flex align-items-center justify-content-center d-lg-none me-2"
                style={{ ...styles.circleButton, ...styles.menuButton }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Icon variant={isMobileMenuOpen ? 'close' : 'menu'} size="sm" />
              </Button>

              <Separator variant="vertical" thickness={1} color="#dee2e6" className="d-none d-lg-block me-3" />

              <a className="navbar-brand d-flex align-items-center" href="#">
                <Icon variant="edit" size="lg" className="me-2 text-success" />
                <Text variant="title" weight="bold" className="text-success">
                  Universidad de Costa Rica
                </Text>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="col d-none d-lg-block">
              <nav className="navbar navbar-expand">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item me-3">
                    <a className="nav-link" href="#">
                      <Text variant="body" className="text-secondary">Sitio Principal</Text>
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className="nav-link" href="#">
                      <Text variant="body" className="text-secondary">Carreras</Text>
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className="nav-link" href="#">
                      <Text variant="body" className="text-secondary">Centros Académicos</Text>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <Text variant="body" className="text-secondary">Test Vocacional</Text>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Search + Botones (extremo derecho) */}
            <div className="col-auto ms-auto d-flex align-items-center">
              <SearchBar />
              <Separator variant='vertical' />
              <Button
                variant="light"
                className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ ...styles.circleButton, ...styles.menuButton }}
              >
                <Icon variant="user" size="sm" />
              </Button>
            </div>
          </div>

          {/* Menú móvil (se muestra al hacer click) */}
          {isMobileMenuOpen && (
            <div className="d-lg-none mt-3">
              <nav className="navbar">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <Text variant="body">Sitio Principal</Text>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <Text variant="body">Carreras</Text>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <Text variant="body">Centros Académicos</Text>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <Text variant="body">Test Vocacional</Text>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};