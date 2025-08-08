import React from 'react';
import { Icon, Title, Text, Button } from '../../atoms';

interface VerificationSuccessProps {
  message: string;
  onGoToHome?: () => void;
}

export const VerificationSuccess: React.FC<VerificationSuccessProps> = ({
  message,
  onGoToHome
}) => {
  return (
    <>
      <Icon variant="check" size="xl" className="text-success d-block mb-3 text-center" />
      <Title variant="h2" color="success" centered className="mb-3">
        ¡Verificación Exitosa!
      </Title>
      <div className="alert alert-success">
        <Text className="mb-0">{message}</Text>
      </div>
      <Text color="muted" className="mb-4 text-center">
        Tu cuenta ha sido verificada correctamente. Serás redirigido automáticamente en unos segundos.
      </Text>
      {onGoToHome && (
        <Button
          variant="primary"
          className="w-100"
          onClick={onGoToHome}
        >
          Ir al Dashboard
        </Button>
      )}
    </>
  );
};
