import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, setAuthToken } from '../../services/userService';
import { useUser } from '../../contexts/UserContext';
import { loginValidation } from '../../validations/user/loginValidation';
import Swal from 'sweetalert2';

const LoginPage: React.FC = () => {
  const { refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginValidation(email, password);
    if (!validation.valid) {
      await Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: validation.message,
        confirmButtonText: "Aceptar"
      });
      return;
    }
    try {
      const token = await loginUser(email, password);
      setAuthToken(token);
      await refreshUser();
      navigate('/home');
    } catch (err: any) {
      const backendMsg = err.response?.data || err.message || "Error al iniciar sesión";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMsg,
        confirmButtonText: "Aceptar"
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Iniciar sesión</button>
        </form>
        <div className="text-center">
          <Link to="/forgot-password" className="d-block mb-2">¿Olvidó su contraseña?</Link>
          <span>¿No tienes cuenta? <Link to="/register">Regístrese aquí</Link></span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;