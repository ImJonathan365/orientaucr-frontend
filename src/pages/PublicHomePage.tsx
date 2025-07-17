import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { removeTokens } from '../utils/Auth';
import { LoadingScreen } from "../components/atoms/Spinner/LoadingScreen";

export default function PublicHomePage() {
  const [showSpinner, setShowSpinner] = useState(false);
  
  useEffect(() => {
    removeTokens();
  }, []);

  const handleSpinnerClick = () => {
    setShowSpinner(true);
    // Simular carga por 3 segundos
    setTimeout(() => {
      setShowSpinner(false);
    }, 3000);
  };

  if (showSpinner) {
    return <LoadingScreen text="Cargando..." variant="primary" minHeight="100vh" />;
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="container py-5">
          <div className="text-center">
            <h1 className="mb-4">Bienvenido a ORIENTAUCR</h1>
            <p className="lead mb-4">
              Plataforma de orientación vocacional y académica de la Universidad de Costa Rica.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/login" className="btn btn-primary">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-outline-primary">
                Registrarse
              </Link>
            </div>
            <button className="btn btn-info" onClick={handleSpinnerClick}>
              Spinner
            </button>
          </div>
        </div>
      </div>
    </>
  );
}