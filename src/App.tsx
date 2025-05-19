import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { HomePage } from "./pages/home/HomePage";
import { Login } from "./pages/auth/LoginPage";
import { EventsPage } from "./pages/home/EventsPage";
import { AcademicCentersPage } from "./pages/home/AcademicCentersPage";
import { VocationalTestPage } from "./pages/home/VocationalTestPage";
import { SimulationTestPage } from "./pages/home/SimulationTestPage";

function AppRoutes() {
  const { user } = useUser();

  if (!user) {
    return (
      <Login />
    );
  }

  return (
    <>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/academic-centers" element={<AcademicCentersPage />} />
        <Route path="/vocational-test" element={<VocationalTestPage />} />
        <Route path="/simulation-test" element={<SimulationTestPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;


/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { HeaderBar } from './components/organisms/HeaderBar/HeaderBar';
import LoginSection  from './components/organisms/LoginSection/LoginSection';
import { FormBar } from './components/organisms/FormBar/FormBar';
import UserProfile from './components/organisms/LoginSection/UserProfile';
import { CareerListPage } from './pages/CareerListPage';

function App() {
  const handleLogin = (email: string, password: string) => {
    console.log("Iniciando sesión con:", email, password);
    // Aquí iría tu lógica de autenticación real
  };

  const handleForgotPassword = () => {
    console.log("Redirigiendo a recuperación de contraseña...");
    // Lógica para recuperar contraseña
  };

  const handleRegister = (userData: any) => {
    console.log("Registrando usuario:", userData);
    // Aquí iría tu llamada a la API para registrar el usuario
    // Ejemplo:
    // registerUser(userData).then(() => navigate('/'));
  };

  return (
    <Router>
      <div className="app-container">
        <HeaderBar />
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <LoginSection
                  onLogin={handleLogin}
                  onForgotPassword={handleForgotPassword}
                />
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <FormBar 
                  onSubmit={handleRegister}
                  title="Registro de Nuevo Usuario"
                  icon="user"  // Asegúrate que 'user' esté en tus IconVariant
                />
              } 
            />
            <Route 
              path="/listCareers" 
              element={<CareerListPage />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
*/