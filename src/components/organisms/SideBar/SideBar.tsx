import { Link, useLocation } from "react-router-dom";
import { getUserFromLocalStorage } from "../../../utils/Auth";

interface SideBarProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

export default function SideBar({ visible, setVisible }: SideBarProps) {
  const user = getUserFromLocalStorage();
  const location = useLocation();

  const menuItems = [

    { path: "/home", icon: "bi-house", label: "Home" },
    { path: "/career-list", icon: "bi-book", label: "Carreras" },
    { path: "/course-list", icon: "bi-journal-bookmark", label: "Cursos" },
    { path: "/events-list", icon: "bi-calendar-event", label: "Events" },
    { path: "/vocational-test", icon: "bi-clipboard-check", label: "Vocational Test" },
    { path: "/simulation-test", icon: "bi-pencil-square", label: "Simulation Test" },
    { path: "/usuarios", icon: "bi-people", label: "List User" },
    { path: "/test-list", icon: "bi-question-circle", label: "Preguntas Test" },
    { path: "/simulation-questions", icon: "bi-question-circle", label: "Preguntas prueba simulada" },
    { path: "/simulation-exam-start", icon: "bi-clipboard-check", label:  "Prueba simulada" },
    { path: "/career-list", icon: "bi-book", label: "Carreras" },
    { path: "/events-list", icon: "bi-calendar-event", label: "Eventos" },
    { path: "/test-list", icon: "bi-clipboard-check", label: "Test vocacional" },
    { path: "/users", icon: "bi-people", label: "Usuarios" },
    { path: "/simulation-questions", icon: "bi-pencil-square", label: "Prueba simulada" },
    { path: "/roles-list", icon: "bi-shield-check", label: "Roles" },
    { path: "/notifications", icon: "bi-bell", label: "Notificaciones" }
  ];

  if (!visible) {
    return (
      <button
        className="btn btn-light shadow"
        style={{ position: "fixed", zIndex: 1050, left: 10, top: 70, borderRadius: "50%", width: 48, height: 48, padding: 0 }}
        onClick={() => setVisible(true)}
        aria-label="Mostrar menú"
      >
        <i className="bi bi-list fs-3"></i>
      </button>
    );
  }

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light"
      style={{
        width: "280px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 56,
        zIndex: 1040,
        transition: "left 0.3s"
      }}
    >
      <button
        className="btn btn-light mb-3 align-self-end"
        style={{ borderRadius: "50%", width: 40, height: 40, padding: 0 }}
        onClick={() => setVisible(false)}
        aria-label="Ocultar menú"
      >
        <i className="bi bi-x-lg fs-5"></i>
      </button>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : 'link-dark'}`}
              onClick={() => setVisible(false)}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}