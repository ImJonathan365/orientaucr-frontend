import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const NotFound = () => {
  const location = useLocation();
    const navigate = useNavigate();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if(location.pathname.startsWith("/careers/edit/")){
            setRedirecting(true);
            navigate("/career-list", { replace: true });
        }

    }, [location, navigate]);
      useEffect(() => {
        if(location.pathname.startsWith("/roles/edit/")){
            setRedirecting(true);
            navigate("/roles-list", { replace: true });
        }
        
    }, [location, navigate]);
      useEffect(() => {
        if(location.pathname.startsWith("/events/edit/")){
            setRedirecting(true);
            navigate("/events-list", { replace: true });
        }
        
    }, [location, navigate]);
    useEffect(() => {
        if(location.pathname.startsWith("/careers/curricula/")){
            setRedirecting(true);
            navigate("/career-list", { replace: true });
        }
    }, [location, navigate]);
    useEffect(() => {
        if(location.pathname.startsWith("simulation-questions/edit/")){
            setRedirecting(true);
            navigate("/simulation-questions", { replace: true });
        }
    }, [location, navigate]);
  return (
    <div className="not-found">
      <center><h1>404 - Página no encontrada</h1></center>
    </div>
  );
}