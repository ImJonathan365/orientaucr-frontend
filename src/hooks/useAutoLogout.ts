import { useEffect } from "react";
import { getUserFromLocalStorage, logoutUser, saveUserToLocalStorage } from "../utils/Auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function useAutoLogout(inactivityLimit: number) {
  const navigate = useNavigate();

  useEffect(() => {
    const updateActivity = () => {
      const user = getUserFromLocalStorage();
      if (user) {
        user.lastActivity = Date.now();
        saveUserToLocalStorage(user);
      }
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);

    const interval = setInterval(() => {
      const user = getUserFromLocalStorage();
      if (user && user.lastActivity && Date.now() - user.lastActivity > inactivityLimit) {
        logoutUser();
        Swal.fire({
          title: "Sesión expirada",
          text: "Su sesión ha expirado por inactividad. Por favor, inicie sesión nuevamente.",
          icon: "warning",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/login");
        });
      }
    }, 5000);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      clearInterval(interval);
    };
  }, [inactivityLimit, navigate]);
}