import { ReactNode } from "react";
import { getUserFromLocalStorage } from "../../utils/Auth";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = getUserFromLocalStorage();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}