import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../atoms/Input/Input';
import { Text } from '../../atoms/Text/Text';
import { Button } from '../../atoms/Button/Button';
import { Image } from '../../atoms/Image/Image';
import { toast } from 'react-toastify';
import { login } from '../../../services/authService';
import { setUser } from '../../../contexts/UserContext';

interface LoginSectionProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
}

const LoginSection: React.FC<LoginSectionProps> = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = async () => {
    if (!email || !password) {
      toast.error('Por favor ingrese correo y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
      toast.success(`🎉 ¡Bienvenido ${user.user_name}!`);

      // Redirigir a dashboard después de login exitoso
      navigate('/register'); // Cambia esta ruta según necesites

    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';

      if (error instanceof Error) {
        if (error.message.includes('Credenciales') || error.message.includes('incorrectos')) {
          errorMessage = '🔐 Correo o contraseña incorrectos';
        } else if (error.message.includes('no encontrado')) {
          errorMessage = '❌ Cuenta no encontrada';
        } else if (error.message.includes('servidor')) {
          errorMessage = '🚨 Error del servidor. Intente más tarde';
        }
      }

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } finally {
      setIsLoading(false);
    }
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
          <Button
            variant="primary"
            onClick={handleLoginClick}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
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