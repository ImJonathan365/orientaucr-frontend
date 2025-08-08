import React from 'react';
import { Icon, Title, Text, Button } from '../../atoms';

interface VerificationErrorProps {
  message: string;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const VerificationError: React.FC<VerificationErrorProps> = ({
  message,
  onGoToLogin,
  onGoToRegister
}) => {
  const getErrorDescription = () => {
    if (message.includes("expirado")) {
      return "Parece que el enlace de verificación ha expirado. Te recomendamos registrarte nuevamente.";
    } else if (message.includes("corrupto")) {
      return "Parece que el enlace es inválido. Te recomendamos registrarte nuevamente.";
    } else {
      return "El enlace de verificación puede haber expirado o ser inválido.";
    }
  };

  return (
    <>
      <Icon variant="close" size="xl" className="text-danger d-block mb-3 text-center" />
      <Title variant="h2" color="danger" centered className="mb-3">
        Error de Verificación
      </Title>
      <div className="alert alert-danger">
        <Text className="mb-0">{message}</Text>
      </div>
      <Text color="muted" className="mb-4 text-center">
        {getErrorDescription()}
      </Text>
      <div className="d-grid gap-2">
        <Button
          variant="primary"
          onClick={onGoToLogin}
        >
          Ir al Login
        </Button>
        <Button
          variant="secondary"
          onClick={onGoToRegister}
        >
          Registrarse de nuevo
        </Button>
      </div>
    </>
  );
};
