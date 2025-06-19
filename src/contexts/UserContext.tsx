import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/userType";
import { getCurrentUser } from "../services/userService";
import { getToken } from "../utils/Auth";

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => { },
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const token = getToken();
    console.log("UserContext: token actual:", token);
    if (!token) {
      setUser(null);
      setLoading(false);
      console.log("UserContext: No token, usuario null");
      return;
    }
    try {
      const u = await getCurrentUser();
      setUser(u);
      console.log("UserContext: Usuario cargado:", u);
    } catch (e) {
      setUser(null);
      console.log("UserContext: Error al cargar usuario:", e);
    } finally {
      setLoading(false);
      console.log("UserContext: loading=false");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);