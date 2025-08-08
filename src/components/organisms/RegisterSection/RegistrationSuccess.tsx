import React from 'react';
import { Icon, Title, Text, Button } from '../../atoms';

interface RegistrationSuccessProps {
  userEmail: string;
  onGoToLogin: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  userEmail,
  onGoToLogin
}) => {
  return (
    <div className="text-center">
      <Title variant="h2" color="success" className="mb-4">
        ¡Registro Exitoso!
      </Title>
      <div className="alert alert-info">
        <Icon variant="envelope" size="xl" className="text-info d-block mb-3" />
        <Text className="mb-3">
          Te hemos enviado un correo de verificación a <strong>{userEmail}</strong>
        </Text>
        <Text color="muted">
          Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
        </Text>
      </div>
      <Button
        variant="primary"
        className="w-100 mt-3"
        onClick={onGoToLogin}
      >
        Ir al Login
      </Button>
    </div>
  );
};
