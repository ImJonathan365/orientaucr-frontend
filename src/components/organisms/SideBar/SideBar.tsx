import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

interface SideBarProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

const menuItems = [
  { path: "/career-list", icon: "bi-book", label: "Carreras", permission: "VER CARRERAS" },
  { path: "/course-list", icon: "bi-journal-bookmark", label: "Cursos", permission: "VER CURSOS" },
  { path: "/events-list", icon: "bi-calendar-event", label: "Eventos", permission: "VER EVENTOS" },
  { path: "/test-list", icon: "bi-clipboard-check", label: "Preguntas Test vocacional", permission: "VER PREGUNTAS TEST" },
  { path: "/simulation-questions", icon: "bi-pencil-square", label: "Preguntas prueba simulada", permission: "VER PREGUNTAS SIMULADAS" },
  { path: "/users", icon: "bi-people", label: "Usuarios", permission: "VER USUARIOS" },
  { path: "/roles-list", icon: "bi-shield-check", label: "Roles", permission: "VER ROLES" },
  { path: "/notifications", icon: "bi-bell", label: "Notificaciones", permission: "VER NOTIFICACIONES" },
  { path: "/categories", icon: "bi-tags", label: "Categorías", permission: "VER PREGUNTAS SIMULADAS" }
];

export default function SideBar({ visible, setVisible }: SideBarProps) {
  const { user: currentUser, loading } = useUser();
  const location = useLocation();

  const sidebarStyle = {
    width: "280px",
    zIndex: 1040,
    transition: "left 0.3s",
    backgroundColor: "#73bbf0"
  };

  if (loading && !currentUser) {
    return null;
  }
  if (!currentUser) return null;

  const userPermissions: string[] = currentUser.userRoles?.flatMap(r => r.permissions.map(p => p.permissionName)) || [];

  const filteredMenuItems = menuItems.filter(item => userPermissions.includes(item.permission));

  if (!visible) {
    return (
      <button
        className="btn btn-light shadow"
        style={{ position: "fixed", zIndex: 1050, left: 10, borderRadius: "50%", width: 48, height: 48, padding: 0 }}
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
      style={sidebarStyle}
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
        {filteredMenuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : 'link-dark'}`}
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