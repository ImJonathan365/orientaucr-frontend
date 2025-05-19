import React from 'react';
import { Image } from '../../atoms/Image/Image';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Title } from '../../atoms/Title/Ttile';


interface User {
  user_id: string;
  user_name: string;
  user_lastname?: string | null;
  user_email: string;
  user_phone_number?: number | null;
  user_birthdate?: string | null;
  user_admission_average?: number | null;
  user_allow_email_notification?: boolean;
  user_allow_whatsapp_notification?: boolean;
  create_at?: string;
  user_role?: string | null;
  user_profile?: string | null;
}

interface Permission {
  permission_id: string;
  permission_name: string;
  permission_description: string;
}

interface UserProfileCardProps {
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading?: boolean;
  isSaving?: boolean;
  permissions: Permission[];
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isEditing,
  onEditToggle,
  onSave,
  onInputChange,
  isLoading = false,
  isSaving = false,
  permissions = []
}) => {
  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <Image
              src={user.user_profile || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="rounded-circle img-fluid mb-3" 
              style={{ width: '150px' }}
            />
            {isEditing ? (
              <>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control text-center"
                    name="user_name"
                    value={user.user_name}
                    onChange={onInputChange}
                  />
                </div>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control text-center"
                    name="user_lastname"
                    value={user.user_lastname || ''}
                    onChange={onInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <h5 className="card-title">{user.user_name} {user.user_lastname}</h5>
                <p className="text-muted mb-1">{user.user_email}</p>
              </>
            )}
            
            <div className="d-flex justify-content-center mb-2">
              <Button
                className="btn btn-primary me-2"
                onClick={onEditToggle}
                disabled={isLoading || isSaving}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
              {isEditing && (
                <Button
                  className="btn btn-success"
                  onClick={onSave}
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body">
            <Title variant='h5' className="card-title">Información Personal</Title>
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Email</p>
              </div>
              <div className="col-sm-8">
                {isEditing ? (
                  <Input
                    type="email"
                    className="form-control"
                    name="user_email"
                    value={user.user_email}
                    onChange={onInputChange}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.user_email}</p>
                )}
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Teléfono</p>
              </div>
              <div className="col-sm-8">
                {isEditing ? (
                  <Input
                    type="tel"
                    className="form-control"
                    name="user_phone_number"
                    value={user.user_phone_number || ''}
                    onChange={onInputChange}
                  />
                ) : (
                  <p className="text-muted mb-0">
                    {user.user_phone_number ? `+${user.user_phone_number}` : 'No proporcionado'}
                  </p>
                )}
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Cumpleaños</p>
              </div>
              <div className="col-sm-8">
                {isEditing ? (
                  <Input
                    type="date"
                    className="form-control"
                    name="user_birthdate"
                    value={user.user_birthdate?.substring(0, 10) || ''}
                    onChange={onInputChange}
                  />
                ) : (
                  <p className="text-muted mb-0">
                    {user.user_birthdate ? new Date(user.user_birthdate).toLocaleDateString() : 'No proporcionado'}
                  </p>
                )}
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Miembro desde</p>
              </div>
              <div className="col-sm-8">
                <p className="text-muted mb-0">
                  {user.create_at ? new Date(user.create_at).toLocaleDateString() : 'Desconocido'}
                </p>
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Promedio de admisión</p>
              </div>
              <div className="col-sm-8">
                {isEditing ? (
                  <Input
                    type="number"
                    className="form-control"
                    name="user_admission_average"
                    value={user.user_admission_average || ''}
                    onChange={onInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                  />
                ) : (
                  <p className="text-muted mb-0">{user.user_admission_average || 'No proporcionado'}</p>
                )}
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Rol</p>
              </div>
              <div className="col-sm-8">
                {isEditing ? (
                  <Input
                    type="text"
                    className="form-control"
                    name="user_role"
                    value={user.user_role || ''}
                    onChange={onInputChange}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.user_role || 'No asignado'}</p>
                )}
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Permisos</p>
              </div>
              <div className="col-sm-8">
                {permissions.length > 0 ? (
                  <ul className="list-unstyled">
                    {permissions.map(permission => (
                      <li key={permission.permission_id}>
                        <strong>{permission.permission_name}</strong>: {permission.permission_description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">No tiene permisos asignados</p>
                )}
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-sm-4">
                <p className="mb-0">Notificaciones</p>
              </div>
              <div className="col-sm-8">
                {isEditing ? (
                  <div>
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        type="checkbox"
                        name="user_allow_email_notification"
                        checked={user.user_allow_email_notification || false}
                        onChange={onInputChange}
                      />
                      <label className="form-check-label">
                        Notificaciones por Email
                      </label>
                    </div>
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        type="checkbox"
                        name="user_allow_whatsapp_notification"
                        checked={user.user_allow_whatsapp_notification || false}
                        onChange={onInputChange}
                      />
                      <label className="form-check-label">
                        Notificaciones por WhatsApp
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted mb-0">
                    Email: {user.user_allow_email_notification ? 'Activado' : 'Desactivado'}, 
                    WhatsApp: {user.user_allow_whatsapp_notification ? 'Activado' : 'Desactivado'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};