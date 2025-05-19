import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { HeaderBar } from './components/organisms/HeaderBar/HeaderBar';
import LoginSection  from './components/organisms/LoginSection/LoginSection';
import { FormBar } from './components/organisms/FormBar/FormBar';

import { CareerListPage } from './pages/CareerListPage';
const App = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Iniciando sesión con:", email, password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleForgotPassword = () => {
    console.log("Redirigiendo a recuperación de contraseña...");
  };

  return (
    
    <Router>
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
            <Route path="/register" element={<FormBar />} />
            <Route path="/listCareers" element={<CareerListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; // Exportación por defecto