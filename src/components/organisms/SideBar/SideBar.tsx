import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getUserFromLocalStorage } from '../../../utils/Auth';

export default function SideBar() {
  const user = getUserFromLocalStorage();
  const location = useLocation();

  const menuItems = [
    { path: "/home", icon: "bi-house", label: "Home" },
    { path: "/career-list", icon: "bi-book", label: "Careers" },
    { path: "/events-list", icon: "bi-calendar-event", label: "Events" },
    { path: "/vocational-test", icon: "bi-clipboard-check", label: "Vocational Test" },
    { path: "/simulation-test", icon: "bi-pencil-square", label: "Simulation Test" },
    { path: "/usuarios", icon: "bi-people", label: "List User" },
    { path: "/test-list", icon: "bi-question-circle", label: "Preguntas Test" },
    { path: "/simulation-questions", icon: "bi-question-circle", label: "Preguntas prueba simulada" },
    { path: "/simulation-exam-start", icon: "bi-clipboard-check", label:  "Prueba simulada" },
    { path: "/roles-list", icon: "bi-shield-check", label: "Roles" },
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{width: "280px", height: "100vh"}}>
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <i className="bi bi-person-circle fs-4 me-2"></i>
        <span className="fs-4">{user?.userName }</span>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
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