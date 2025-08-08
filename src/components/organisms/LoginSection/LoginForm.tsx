import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Title } from '../../atoms';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  formData: LoginFormData;
  onInputChange: (field: keyof LoginFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoHome: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onGoHome
}) => {
  return (
    <>
      <div className="text-center mb-4">
        <Button
          variant="secondary"
          onClick={onGoHome}
        >
          <i className="bi bi-house me-1"></i>
          Regresar
        </Button>
      </div>
      
      <Title variant="h2" centered className="mb-4">
        Iniciar sesión
      </Title>
      
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <Input
            variant="email"
            label="Correo electrónico:"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <Input
            variant="password"
            label="Contraseña:"
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            required
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-100 mb-3"
        >
          Iniciar sesión
        </Button>
      </form>
      
      <div className="text-center">
        <Link to="/forgot-password" className="d-block mb-2">
          ¿Olvidó su contraseña?
        </Link>
        <span>
          ¿No tienes cuenta? <Link to="/register">Regístrese aquí</Link>
        </span>
      </div>
    </>
  );
};
