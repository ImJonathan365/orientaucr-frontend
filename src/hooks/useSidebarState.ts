import { useState, useEffect } from 'react';

export const useSidebarState = () => {
  // Recuperar estado del localStorage o usar false como default
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem('sidebar-visible');
    return saved ? JSON.parse(saved) : false; // Cambiar default a false
  });

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('sidebar-visible', JSON.stringify(isVisible));
  }, [isVisible]);

  const toggleSidebar = () => {
    setIsVisible((prev: boolean) => !prev);
  };

  const showSidebar = () => {
    setIsVisible(true);
  };

  const hideSidebar = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    setIsVisible,
    toggleSidebar,
    showSidebar,
    hideSidebar
  };
};
