import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { HeaderBar } from './components/organisms/HeaderBar/HeaderBar';
import LoginSection  from './components/organisms/LoginSection/LoginSection';
import { FormBar } from './components/organisms/FormBar/FormBar';

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;