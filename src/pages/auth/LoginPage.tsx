import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, setAuthToken } from '../../services/userService';
import { saveToken } from '../../utils/Auth';
import { useUser } from '../../contexts/UserContext';

const LoginPage: React.FC = () => {
  const { refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = await loginUser(email, password);
      saveToken(token);
      setAuthToken(token);
      await refreshUser();
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
              required
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
              required
            />
          </div>
          {error && (
            <div className="alert alert-danger py-1" role="alert">
              {error}
            </div>
          )}
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