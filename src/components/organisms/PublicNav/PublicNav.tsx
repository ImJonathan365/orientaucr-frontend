import React from 'react';
import { Link } from 'react-router-dom';

interface PublicNavProps {
  onMenuClose?: () => void;
}

export const PublicNav: React.FC<PublicNavProps> = ({
  onMenuClose
}) => {
  const handleLinkClick = () => {
    if (onMenuClose) {
      onMenuClose();
    }
  };

  return (
    <>
      <div className="nav-item me-2">
        <Link
          to="/login"
          className="btn btn-outline-primary"
          onClick={handleLinkClick}
        >
          Iniciar sesión
        </Link>
      </div>
      <div className="nav-item">
        <Link
          to="/register"
          className="btn btn-primary"
          onClick={handleLinkClick}
        >
          Registrarse
        </Link>
      </div>
    </>
  );
};
