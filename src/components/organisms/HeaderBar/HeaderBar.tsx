import { Text } from "../../atoms/Text/Text";
import { Icon } from "../../atoms/Icon/Icon";
import { Button } from "../../atoms/Button/Button";
import { SearchBar } from "../../molecules/SearchBar/SearchBar";
import React, { useState } from "react";
import { Separator } from "../../atoms/Separator/Separator";
import { Image } from "../../atoms/Image/Image";

export const HeaderBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <div className="row align-items-center">
            <Image
              src="https://accionsocial.ucr.ac.cr/sites/default/files/herramienta/imagenes/2020-12/Logo%20UCR%20transparentePNG.PNG"
              alt="Logo UCR"
              variant="hero"
              className="img-fluid"
              style={{ maxWidth: "120px" }}
            />
            <div className="col-auto d-flex align-items-center">
              <Button
                variant="light"
                className=" align-items-center justify-content-center d-lg-none me-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Icon
                  variant={isMobileMenuOpen ? "close" : "menu"}
                  size="sm"
                  style={{ alignItems: "center" }}
                />
              </Button>

              <a className="navbar-brand d-flex align-items-center" href="#">
                <Text variant="subtitle" weight="bold" className="text-success">
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
                      <Text variant="body" className="text-secondary">
                        Sitio Principal
                      </Text>
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className="nav-link" href="#">
                      <Text variant="body" className="text-secondary">
                        Carreras
                      </Text>
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className="nav-link" href="#">
                      <Text variant="body" className="text-secondary">
                        Centros Académicos
                      </Text>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <Text variant="body" className="text-secondary">
                        Test Vocacional
                      </Text>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Search + Botones (extremo derecho) */}
            <div className="col-auto ms-auto d-flex align-items-center">
              <SearchBar></SearchBar>
              <Separator variant="vertical" />
              <Button variant="info">
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
      </nav>
    </>
  );
};
