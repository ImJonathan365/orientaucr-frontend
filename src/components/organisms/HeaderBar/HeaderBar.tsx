import React, { useState, useRef, useEffect } from "react";
import { Text } from "../../atoms/Text/Text";
import { Icon } from "../../atoms/Icon/Icon";
import { Button } from "../../atoms/Button/Button";
import { Image } from "../../atoms/Image/Image";
import { Link, useLocation } from "react-router-dom";
import { ProfileDropdown } from "../../molecules/ProfileDropdown/ProfileDropdown";
import { useUser } from "../../../contexts/UserContext";
import { getUserProfileImage } from "../../../services/userService";

export const HeaderBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Cargar imagen de perfil cuando el usuario cambie
  useEffect(() => {
    const loadProfileImage = async () => {
      if (user?.userProfilePicture) {
        try {
          const imageUrl = await getUserProfileImage(user.userProfilePicture);
          setProfileImageUrl(imageUrl);
        } catch (error) {
          setProfileImageUrl(null);
        }
      } else {
        setProfileImageUrl(null);
      }
    };

    loadProfileImage();
  }, [user?.userProfilePicture]);

  const navLinks = [
    { to: "/home", label: "Inicio" },
    { to: "/academic-centers", label: "Centros Académicos" },
    { to: "/events", label: "Eventos" },
    { to: "/vocational-test", label: "Test Vocacional" },
    { to: "/simulation-exam-start", label: "Prueba Simulada" },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm" style={{ minHeight: 70 }}>
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center">
          <Image
            src="/images/orientaucr.jpg"
            alt="orietaucr"
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

        <Button
          variant="light"
          className="d-lg-none"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <Icon variant={isMenuOpen ? "close" : "menu"} size="sm" />
        </Button>

        <div
          className={`header-nav-wrapper ${isMenuOpen ? "d-flex flex-column position-absolute top-100 end-0 bg-white p-3 rounded shadow mt-2" : "d-none d-lg-flex align-items-center"}`}
          style={isMenuOpen ? { zIndex: 1050, right: 16 } : {}}
        >
          <ul className={`navbar-nav ${isMenuOpen ? "" : "flex-lg-row ms-auto align-items-center"}`}>
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.to);
              return (
                <li className={`nav-item ${isMenuOpen ? "mb-2" : "me-lg-3"} d-flex align-items-center`} key={link.to}>
                  <Link
                    className={`nav-link d-flex align-items-center header-nav-link ${isActive ? 'active' : ''}`}
                    to={link.to}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setProfileMenuOpen(false);
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
            {user ? (
              <li className={`nav-item position-relative ${isMenuOpen ? "" : "ms-lg-3"}`}>
                <div ref={profileMenuRef} style={{ position: "relative" }}>
                  <button
                    className="profile-button"
                    onClick={() => setProfileMenuOpen((v) => !v)}
                  >
                    {profileImageUrl ? (
                      <img 
                        src={profileImageUrl} 
                        alt="Perfil" 
                        className="profile-image"
                      />
                    ) : (
                      <Icon variant="user" className="profile-icon" />
                    )}
                  </button>
                  {profileMenuOpen && (
                    <ProfileDropdown onClose={() => setProfileMenuOpen(false)} />
                  )}
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary me-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};