import { HeaderBar } from "../components/organisms/HeaderBar/HeaderBar";
import FooterBar from "../components/organisms/FooterBar/FooterBar";
import { Link } from "react-router-dom";

export default function PublicHomePage() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <HeaderBar />
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
          </div>
        </div>
        <FooterBar />
      </div>
    </>
  );
}