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
  return (
    <div className="not-found">
      <center><h1>404 - Página no encontrada</h1></center>
    </div>
  );
}