import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAutoLogout } from "./hooks/useAutoLogout";
import { UserProvider } from "./contexts/UserContext";

function AutoLogoutWrapper() {
  useAutoLogout(20 * 60 * 1000); // Cierra la sesión del usuario después de 20 minutos de inactividad
  return null;
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AutoLogoutWrapper />
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
