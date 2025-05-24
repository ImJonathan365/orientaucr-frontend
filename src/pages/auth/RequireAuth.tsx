import React, { JSX, ReactNode } from "react";
import { useUser } from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps): JSX.Element {
  const { user, loading } = useUser();
  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}