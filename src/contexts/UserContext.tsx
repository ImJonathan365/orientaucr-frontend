import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/userType";
import { useEffect } from "react";
import Swal from "sweetalert2";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    const updateActivity = () => {
      const session = localStorage.getItem("user");
      if (session) {
        const data = JSON.parse(session);
        data.lastActivity = Date.now();
        localStorage.setItem("user", JSON.stringify(data));
      }
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, []);

  useEffect(() => {
    const INACTIVITY_LIMIT = 60 * 60 * 1000;

    let alertShown = false;

    const checkInactivity = () => {
      const session = localStorage.getItem("user");
      if (session && !alertShown) {
        const data = JSON.parse(session);
        if (Date.now() - data.lastActivity > INACTIVITY_LIMIT) {
          alertShown = true;
          Swal.fire({
            title: "Sesión expirada",
            text: "Su sesión ha expirado por inactividad. Por favor, inicie sesión nuevamente.",
            icon: "warning",
            confirmButtonText: "Aceptar",
          }).then(() => {
            localStorage.removeItem("user");
            setUser(null);
            alertShown = false;
          });
        }
      }
    };

    const interval = setInterval(checkInactivity, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
