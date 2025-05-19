import React, { useState } from 'react';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { registerUser } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserFormData } from '../../../types/user';

interface FormBarProps {
  title?: string;
  icon?: 'user';
  onSubmit?: (userData: UserFormData) => void;
}

export const FormBar: React.FC<FormBarProps> = ({
  title = 'Registro Completo de Usuario',
  icon = 'user-plus',
  onSubmit
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    user_name: '',
    user_lastname: '',
    user_email: '',
    user_phone_number: '',
    user_birthdate: '',
    user_password: '',
    user_admission_average: '',
    user_allow_email_notification: true,
    user_allow_whatsapp_notification: false,
    userProfilePicture: ''
  });

  // Estado para la vista previa de la imagen
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Crear preview temporal
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Guardar solo el nombre del archivo
      setFormData(prev => ({
        ...prev,
        userProfilePicture: file.name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await registerUser({
          ...formData,
          user_phone_number: formData.user_phone_number,
          user_birthdate: formData.user_birthdate,
          user_admission_average: formData.user_admission_average,
          userProfilePicture: formData.userProfilePicture || ''
        });
      }
      
      toast.success('Usuario registrado exitosamente!');
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      toast.error(message);
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-header bg-primary text-white">
        <div className="d-flex align-items-center">
          <Icon variant="user" size="lg" className="me-2" />
          <Text variant="title" color="light" weight="bold">{title}</Text>
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <Input
                label="Nombre *"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Apellido"
                name="user_lastname"
                value={formData.user_lastname}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Input
                variant="email"
                label="Email *"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <Input
                type="tel"
                label="Teléfono"
                name="user_phone_number"
                value={formData.user_phone_number}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Input
                variant="password"
                label="Contraseña *"
                name="user_password"
                value={formData.user_password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <Input
                type="date"
                label="Fecha de Nacimiento"
                name="user_birthdate"
                value={formData.user_birthdate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <Input
                type="number"
                step="0.01"
                label="Promedio Admisión"
                name="user_admission_average"
                value={formData.user_admission_average}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <Text variant="body" className="mb-2">Preferencias de Notificación:</Text>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="user_allow_email_notification"
                      checked={formData.user_allow_email_notification}
                      onChange={handleChange}
                      id="emailNotifications"
                    />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Email
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="user_allow_whatsapp_notification"
                      checked={formData.user_allow_whatsapp_notification}
                      onChange={handleChange}
                      id="whatsappNotifications"
                    />
                    <label className="form-check-label" htmlFor="whatsappNotifications">
                      WhatsApp
                    </label>
                    
                  </div>
                </div>
              </div>
            </div>

 <div className="col-12">
              <div className="mb-3">
                <Text variant="body" className="mb-2">Foto de Perfil</Text>
                <div className="d-flex align-items-center gap-3">
                  {previewImage && (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-control"
                      style={{ display: 'none' }}
                    />
                    <label 
                      htmlFor="profilePicture" 
                      className="btn btn-outline-primary"
                    >
                      <Icon variant="upload" className="me-2" />
                      {formData.userProfilePicture ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </label>
                    {formData.userProfilePicture && (
                      <div className="small text-muted mt-1">
                        {formData.userProfilePicture}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex justify-content-end gap-3 mt-4">
                <Button 
                  variant="secondary" 
                  type="button"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                >
                  <Icon variant="close" className="me-2" />
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                      <span role="status">Registrando...</span>
                    </>
                  ) : (
                    <>
                      <Icon variant="check" className="me-2" />
                      Registrar Usuario
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};