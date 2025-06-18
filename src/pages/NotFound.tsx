import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith("/careers/edit/")) {
      navigate("/career-list", { replace: true });
    } else if (location.pathname.startsWith("/roles/edit/")) {
      navigate("/roles-list", { replace: true });
    } else if (location.pathname.startsWith("/events/edit/")) {
      navigate("/events-list", { replace: true });
    } else if (location.pathname.startsWith("/careers/curricula/")) {
      navigate("/career-list", { replace: true });
    } else if (location.pathname.startsWith("/careers/")) {
      navigate("/career-list", { replace: true });
    } else if (location.pathname.startsWith("/courses/")) {
      navigate("/course-list", { replace: true });
    } else if (location.pathname.startsWith("simulation-questions/edit/")) {
      navigate("/simulation-questions", { replace: true });
    } else if (location.pathname.startsWith("/")) {
      navigate("/home", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="not-found">
      <center><h1>404 - Página no encontrada</h1></center>
    </div>
  );
};