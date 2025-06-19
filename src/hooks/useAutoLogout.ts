import { useEffect } from "react";
import { getToken, removeTokens, updateTokenActivity, getTokenLastActivity } from "../utils/Auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function useAutoLogout(inactivityLimit: number) {
  const navigate = useNavigate();

  
  useEffect(() => {
    const updateActivity = () => {
      if (getToken()) {
        updateTokenActivity();
      }
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);

    const interval = setInterval(() => {
      const lastActivity = getTokenLastActivity();
      if (getToken() && lastActivity && Date.now() - lastActivity > inactivityLimit) {
        removeTokens();
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