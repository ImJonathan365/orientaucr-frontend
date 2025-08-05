import { useLocation } from 'react-router-dom';

export interface NavLink {
  to: string;
  label: string;
  requiresAuth?: boolean;
  icon?: string;
}

export const useNavigation = () => {
  const location = useLocation();

  const navLinks: NavLink[] = [
    { to: "/home", label: "Inicio" },
    { to: "/academic-centers", label: "Centros Académicos" },
    { to: "/events", label: "Eventos" },
    { to: "/vocational-test", label: "Test Vocacional" },
    { to: "/simulation-exam-start", label: "Prueba Simulada" },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const getFilteredLinks = (isAuthenticated: boolean) => {
    return navLinks.filter(link => 
      !link.requiresAuth || (link.requiresAuth && isAuthenticated)
    );
  };

  return {
    navLinks,
    isActiveLink,
    getFilteredLinks,
    currentPath: location.pathname
  };
};
