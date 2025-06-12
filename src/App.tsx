import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from "./routes/AppRoutes";
import { useAutoLogout } from "./hooks/useAutoLogout";

function AutoLogoutWrapper() {
  useAutoLogout(10 * 60 * 1000);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AutoLogoutWrapper />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
