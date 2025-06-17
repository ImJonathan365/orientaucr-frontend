import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { User } from "../../types/userType";
import { getCurrentUser } from "../../services/userService";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!currentUser || !currentUser.userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}