import { BrowserRouter } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";

function AppRoutes() {
  const { user } = useUser();

  if (!user) {
    return (
      <PublicRoutes />
    );
  }

  return (
    <>
    <PrivateRoutes />
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
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
    </UserProvider>
  );
}

export default App;
