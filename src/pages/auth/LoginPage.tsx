import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, setAuthToken } from '../../services/userService';
import { useUser } from '../../contexts/UserContext';
import { loginValidation } from '../../validations/user/loginValidation';
import { showError } from '../../utils/Alert';
import { LoginForm } from '../../components/organisms';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginValidation(formData.email, formData.password);
    if (!validation.valid) {
      await showError("Error de validación", validation.message || "Datos inválidos");
      return;
    }
    try {
      const token = await loginUser(formData.email, formData.password);
      setAuthToken(token);
      await refreshUser();
      navigate('/home');
    } catch (err: any) {
      const backendMsg = err.response?.data || err.message || "Error al iniciar sesión";
      await showError("Error", backendMsg);
    }
  };

  const handlePublicHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <LoginForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleLogin}
          onGoHome={handlePublicHome}
        />
      </div>
    </div>
  );
};

export default LoginPage;