import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../atoms/Input/Input';
import { Text } from '../../atoms/Text/Text';
import { Button } from '../../atoms/Button/Button';
import { Image } from '../../atoms/Image/Image';

interface LoginSectionProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword?: () => void;
}

const LoginSection: React.FC<LoginSectionProps> = ({
  onLogin,
  onForgotPassword
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    onLogin(email, password);
  };

  return (
      <div className="bg-light bg-gradient min-vh-100 d-flex align-items-start pt-5 justify-content-center"> 
      <div className="bg-white rounded p-4 shadow w-100 mt-5" style={{ maxWidth: '400px' }}> 
        <div className="text-center mb-4">
          <Image
            src="https://accionsocial.ucr.ac.cr/sites/default/files/herramienta/imagenes/2020-12/Logo%20UCR%20transparentePNG.PNG"
            alt="Logo UCR"
            variant="hero" 
            className="img-fluid"
            style={{ maxWidth: '120px' }}
          />
        </div>

        <div className="text-center mb-3">
          <Text variant="title">Iniciar sesión</Text>
        </div>

        <div className="mb-3">
          <Input 
            variant="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Input 
            variant="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-grid mb-3">
          <Button variant="primary" onClick={handleLoginClick}>
            Iniciar sesión
          </Button>
        </div>

        <div className="d-flex justify-content-between small">
          <Button 
            variant="link" 
            size="small" 
            onClick={onForgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </Button>
          <Button 
            variant="link" 
            size="small"
            onClick={() => navigate('/register')}
          >
            Crear una cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;