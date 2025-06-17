import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, setAuthToken } from '../../services/userService';
import { saveToken } from '../../utils/Auth';

const LoginPage: React.FC = () => {
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
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;