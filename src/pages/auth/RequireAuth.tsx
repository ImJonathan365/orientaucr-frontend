import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && (!user || !user.userId)) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || !user.userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}