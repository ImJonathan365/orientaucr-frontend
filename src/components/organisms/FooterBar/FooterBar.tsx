import { Link } from "react-router-dom";

export default function FooterBar() {
  return (
    <footer className="bg-light text-dark w-100 mt-auto">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-4">
        <div className="mb-3 mb-md-0">
          <p className="mb-0">© {new Date().getFullYear()} ORIENTAUCR. Todos los derechos reservados.</p>
        </div>
        <ul className="nav">
          <li className="nav-item">
            <Link to="/acerca-de" className="nav-link px-2 text-dark">Acerca de</Link>
          </li>
          <li className="nav-item">
            <Link to="/contacto" className="nav-link px-2 text-dark">Contacto</Link>
          </li>
          <li className="nav-item">
            <Link to="/politicas" className="nav-link px-2 text-dark">Políticas</Link>
          </li>
          <li className="nav-item">
            <Link to="/ayuda" className="nav-link px-2 text-dark">Ayuda</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}