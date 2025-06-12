import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from "./routes/AppRoutes";
import { useAutoLogout } from "./hooks/useAutoLogout";

function AutoLogoutWrapper() {
  useAutoLogout(10 * 60 * 1000); // Cierra la sesión del usuario después de 10 minutos de inactividad
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AutoLogoutWrapper />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
