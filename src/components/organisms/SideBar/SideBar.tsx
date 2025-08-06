import { useUser } from "../../../contexts/UserContext";
import { SidebarToggle } from "../../molecules/SidebarToggle/SidebarToggle";
import { SidebarNavigation, SidebarMenuItem } from "../../molecules/SidebarNavigation/SidebarNavigation";
import { Separator } from "../../atoms/Separator/Separator";

interface SideBarProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

const menuItems: SidebarMenuItem[] = [
  { path: "/career-list", icon: "book", label: "Carreras", permission: "VER CARRERAS" },
  { path: "/course-list", icon: "journal", label: "Cursos", permission: "VER CURSOS" },
  { path: "/events-list", icon: "calendar-event", label: "Eventos", permission: "VER EVENTOS" },
  { path: "/test-list", icon: "clipboard", label: "Preguntas Test vocacional", permission: "VER PREGUNTAS TEST" },
  { path: "/simulation-questions", icon: "edit", label: "Preguntas prueba simulada", permission: "VER PREGUNTAS SIMULADAS" },
  { path: "/users", icon: "people", label: "Usuarios", permission: "VER USUARIOS" },
  { path: "/roles-list", icon: "shield", label: "Roles", permission: "VER ROLES" },
  { path: "/notifications", icon: "bell", label: "Notificaciones", permission: "VER NOTIFICACIONES" },
  { path: "/categories", icon: "tags", label: "Categorías", permission: "VER PREGUNTAS SIMULADAS" }
];

export default function SideBar({ visible, setVisible }: SideBarProps) {
  const { user: currentUser, loading } = useUser();

  if (loading || !currentUser) {
    return null;
  }

  const userPermissions: string[] = currentUser.userRoles?.flatMap(
    role => role.permissions.map(permission => permission.permissionName)
  ) || [];
  
  const filteredMenuItems = menuItems.filter(
    item => userPermissions.includes(item.permission)
  );

  const handleToggle = () => {
    setVisible(!visible);
  };

  const handleNavigate = () => {
    if (window.innerWidth <= 991.98) {
      setVisible(false);
    }
  };

  if (!visible) {
    return (
      <SidebarToggle
        isVisible={false}
        onToggle={handleToggle}
        className="sidebar-toggle-floating"
      />
    );
  }

  return (
    <aside className="sidebar sidebar-expanded" role="navigation" aria-label="Navegación principal">
      <div className="sidebar-header">
        <SidebarToggle
          isVisible={true}
          onToggle={handleToggle}
          className="sidebar-toggle-close"
        />
      </div>
      
      <Separator variant="horizontal" className="sidebar-separator" />
      
      <div className="sidebar-content">
        <SidebarNavigation
          menuItems={filteredMenuItems}
          onNavigate={handleNavigate}
          className="sidebar-nav"
        />
      </div>
    </aside>
  );
}