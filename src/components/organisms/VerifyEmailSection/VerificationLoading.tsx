import React from 'react';
import { Spinner, Title, Text } from '../../atoms';

export const VerificationLoading: React.FC = () => {
  return (
    <>
      <Spinner
        size="md"
        variant="primary"
        className="mb-3"
        text="Verificando..."
      />
      <Title variant="h3" centered className="mb-3">
        Verificando tu correo electrónico
      </Title>
      <Text color="muted" className="text-center">
        Por favor espera mientras verificamos tu cuenta...
      </Text>
    </>
  );
};
