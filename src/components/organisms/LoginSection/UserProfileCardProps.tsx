import React, { useRef } from 'react';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Title } from '../../atoms/Title/Ttile';
import { User } from '../../../types/userType';
import { useNavigate } from 'react-router-dom';

type EditableFields = 'profile' | 'personal_info' | 'notifications';

interface UserProfileCardProps {
  user: User;
  isEditing: boolean;
  editableFields?: EditableFields[];
  onEditToggle: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isLoading?: boolean;
  isSaving?: boolean;
  onProfilePictureChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isEditing,
  editableFields = ['profile', 'personal_info', 'notifications'],
  onEditToggle,
  onSave,
  onInputChange,
  isLoading = false,
  isSaving = false,
  onProfilePictureChange,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEdit = (fieldType: EditableFields) => editableFields.includes(fieldType) && isEditing;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No proporcionado';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="row">
      {/* Mi Perfil: Imagen y botón editar */}
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <img
              src={
                user.userProfilePicture
                  ? `http://localhost:9999/users/${user.userProfilePicture}`
                  : 'https://via.placeholder.com/150'
              }
              alt="Profile"
              className="rounded-circle img-fluid mb-3"
              style={{ width: '150px', objectFit: 'cover', cursor: isEditing ? 'pointer' : 'default' }}
              onClick={() => {
                if (isEditing && fileInputRef.current) fileInputRef.current.click();
              }}
              title={isEditing ? "Cambiar foto de perfil" : ""}
            />
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={onProfilePictureChange}
                  disabled={isSaving}
                />
                <small className="text-muted d-block mb-2">Haz clic en la imagen para cambiarla</small>
              </div>
            )}
            <h5 className="card-title">{user.userName} {user.userLastname}</h5>
            <div className="d-flex justify-content-center mb-2">
              <Button
                className="btn btn-primary"
                onClick={onEditToggle}
                disabled={isLoading || isSaving}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
              {isEditing && (
                <Button
                  className="btn btn-success ms-2"
                  onClick={onSave}
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
              )}
            </div>
            <Button
              className="btn btn-secondary mt-2"
              onClick={() => navigate("/home")}
            >
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Información Personal */}
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body">
            <Title variant="h5" className="card-title">Información Personal</Title>

            {/* Nombre */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Nombre</p></div>
              <div className="col-sm-8">
                {canEdit('personal_info') ? (
                  <Input
                    type="text"
                    className="form-control"
                    name="userName"
                    value={user.userName}
                    onChange={onInputChange}
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.userName}</p>
                )}
              </div>
            </div>
            <hr />

            {/* Apellido */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Apellido</p></div>
              <div className="col-sm-8">
                {canEdit('personal_info') ? (
                  <Input
                    type="text"
                    className="form-control"
                    name="userLastname"
                    value={user.userLastname || ''}
                    onChange={onInputChange}
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.userLastname ? user.userLastname : 'No proporcionado'}</p>
                )}
              </div>
            </div>
            <hr />
            {/* Email */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Correo</p></div>
              <div className="col-sm-8">
                {canEdit('personal_info') ? (
                  <Input
                    type="email"
                    className="form-control"
                    name="userEmail"
                    value={user.userEmail}
                    onChange={onInputChange}
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.userEmail}</p>
                )}
              </div>
            </div>
            <hr />

            {/* Cumpleaños */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Fecha de nacimiento</p></div>
              <div className="col-sm-8">
                {canEdit('personal_info') ? (
                  <Input
                    type="date"
                    className="form-control"
                    name="userBirthdate"
                    value={user.userBirthdate?.substring(0, 10) || ''}
                    onChange={onInputChange}
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-muted mb-0">{formatDate(user.userBirthdate)}</p>
                )}
              </div>
            </div>
            <hr />

            {/* Promedio */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Promedio de admisión</p></div>
              <div className="col-sm-8">
                {canEdit('personal_info') ? (
                  <Input
                    type="number"
                    className="form-control"
                    name="userAdmissionAverage"
                    value={user.userAdmissionAverage?.toString() || ''}
                    onChange={onInputChange}
                    step="0.01"
                    min="0"
                    max="800"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.userAdmissionAverage ?? 'No proporcionado'}</p>
                )}
              </div>
            </div>
            <hr />

            {/* Notificaciones */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Recibe correos</p></div>
              <div className="col-sm-8">
                {canEdit('notifications') ? (
                  <div className="form-check">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      name="userAllowEmailNotification"
                      checked={user.userAllowEmailNotification || false}
                      onChange={onInputChange}
                      disabled={isSaving}
                    />
                    <label className="form-check-label">Notificaciones por Email</label>
                  </div>
                ) : (
                  <span className="text-muted mb-0">
                    {user.userAllowEmailNotification ? 'Sí' : 'No'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};