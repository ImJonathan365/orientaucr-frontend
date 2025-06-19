import React, { useState, useRef, useEffect } from "react";
import { Text } from "../../atoms/Text/Text";
import { Icon } from "../../atoms/Icon/Icon";
import { Button } from "../../atoms/Button/Button";
import { Image } from "../../atoms/Image/Image";
import { Link } from "react-router-dom";
import { ProfileDropdown } from "../../molecules/ProfileDropdown/ProfileDropdown";
import { useUser } from "../../../contexts/UserContext";

export const HeaderBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

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

  const navLinks = [
    { to: "/home", label: "Inicio" },
    { to: "/events", label: "Eventos" },
    { to: "/academic-centers", label: "Centros Académicos" },
    { to: "/vocational-test", label: "Test Vocacional" },
    { to: "/simulation-exam-start", label: "Prueba Simulada" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm" style={{ minHeight: 70 }}>
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center">
          <Image
            src="https://accionsocial.ucr.ac.cr/sites/default/files/herramienta/imagenes/2020-12/Logo%20UCR%20transparentePNG.PNG"
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
          className={`header-nav-wrapper align-items-center ${isMenuOpen ? "d-flex flex-column position-absolute top-100 end-0 bg-white p-3 rounded shadow mt-2" : "d-none d-lg-flex"}`}
          style={isMenuOpen ? { zIndex: 1050, right: 16 } : {}}
        >
          <ul className={`navbar-nav ${isMenuOpen ? "" : "flex-lg-row ms-auto align-items-center"}`}>
            {user &&
              navLinks.map((link) => (
                <li className={`nav-item ${isMenuOpen ? "mb-2" : "me-lg-3"}`} key={link.to}>
                  <Link
                    className="nav-link"
                    to={link.to}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setProfileMenuOpen(false);
                    }}
                  >
                    <Text variant="body" className="text-secondary">
                      {link.label}
                    </Text>
                  </Link>
                </li>
              ))}
            {user ? (
              <li className={`nav-item position-relative ${isMenuOpen ? "" : "ms-lg-3"}`}>
                <div ref={profileMenuRef} style={{ position: "relative" }}>
                  <Button
                    variant="info"
                    onClick={() => setProfileMenuOpen((v) => !v)}
                  >
                    <Icon variant="user" size="sm" />
                  </Button>
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