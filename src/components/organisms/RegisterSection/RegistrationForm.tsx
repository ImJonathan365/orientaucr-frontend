import React from 'react';
import { Input, Button, Title } from '../../atoms';

interface RegistrationFormData {
  userName: string;
  userEmail: string;
  userPassword: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  formData: RegistrationFormData;
  isLoading: boolean;
  onInputChange: (field: keyof RegistrationFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  isLoading,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <>
      <Title variant="h2" centered className="mb-4">
        Registro de Usuario
      </Title>
      
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <Input
            variant="default"
            label="Nombre:"
            type="text"
            value={formData.userName}
            onChange={(e) => onInputChange('userName', e.target.value)}
            required
            placeholder="Ej: Juan"
          />
        </div>
        
        <div className="mb-3">
          <Input
            variant="email"
            label="Correo electrónico:"
            type="email"
            value={formData.userEmail}
            onChange={(e) => onInputChange('userEmail', e.target.value)}
            required
            placeholder="Ej: juan@email.com"
          />
        </div>
        
        <div className="mb-3">
          <Input
            variant="password"
            label="Contraseña:"
            type="password"
            value={formData.userPassword}
            onChange={(e) => onInputChange('userPassword', e.target.value)}
            required
            placeholder="********"
          />
        </div>
        
        <div className="mb-3">
          <Input
            variant="password"
            label="Confirmar contraseña:"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            required
            placeholder="********"
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          className="w-100 mt-2"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </form>
    </>
  );
};
