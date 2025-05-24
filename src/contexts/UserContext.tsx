import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types/user";

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
    const INACTIVITY_LIMIT = 10 * 60 * 1000; // 1 minuto

    const checkInactivity = () => {
      const session = localStorage.getItem("user");
      if (session) {
        const data = JSON.parse(session);
        if (Date.now() - data.lastActivity > INACTIVITY_LIMIT) {
          console.log("Sesión expirada por inactividad");
          localStorage.removeItem("user");
          setUser(null);
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
