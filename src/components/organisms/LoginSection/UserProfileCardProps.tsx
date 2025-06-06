import React from 'react';
import { Image } from '../../atoms/Image/Image';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Title } from '../../atoms/Title/Ttile';
import { User } from '../../../types/userType';
import { Permission } from '../../../types/permissionType';

type EditableFields = 'profile' | 'personal_info' | 'notifications' | 'role_permissions';

interface UserProfileCardProps {
  user: User;
  isEditing: boolean;
  editableFields?: EditableFields[];
  onEditToggle: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isLoading?: boolean;
  isSaving?: boolean;
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionCheckboxChange: (permissionId: string) => void;
  onDeletePermissions: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isEditing,
  editableFields = ['profile', 'personal_info', 'notifications', 'role_permissions'],
  onEditToggle,
  onSave,
  onInputChange,
  isLoading = false,
  isSaving = false,
  permissions = [],
  selectedPermissions = [],
  onPermissionCheckboxChange,
  onDeletePermissions,
}) => {
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
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <Image
              src={user.userProfilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="rounded-circle img-fluid mb-3"
              style={{ width: '150px' }}
            />

            {canEdit('profile') ? (
              <>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control text-center"
                    name="userName"
                    value={user.userName}
                    onChange={onInputChange}
                  />
                </div>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control text-center"
                    name="userLastname"
                    value={user.userLastname || ''}
                    onChange={onInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <h5 className="card-title">{user.userName} {user.userLastname}</h5>
                <p className="text-muted mb-1">{user.userEmail}</p>
              </>
            )}

            <div className="d-flex justify-content-center mb-2">
              {editableFields.length > 0 && (
                <Button
                  className="btn btn-primary me-2"
                  onClick={onEditToggle}
                  disabled={isLoading || isSaving}
                >
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </Button>
              )}
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
            <Title variant="h5" className="card-title">Información Personal</Title>

            {/* Email */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Email</p></div>
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
              <div className="col-sm-4"><p className="mb-0">Cumpleaños</p></div>
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
                    max="100"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.userAdmissionAverage ?? 'No proporcionado'}</p>
                )}
              </div>
            </div>

            <hr />

            {/* Rol */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Rol</p></div>
              <div className="col-sm-8">
                <p className="text-muted mb-0">
                  {user.userRoles && user.userRoles.length > 0
                    ? user.userRoles.map(r => r.rolName).join(', ')
                    : 'No asignado'}
                </p>
              </div>
            </div>

            <hr />

            {/* Permisos */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Permisos</p></div>
              <div className="col-sm-8">
                {canEdit('role_permissions') ? (
                  <div className="form-group">
                    {permissions.length > 0 ? (
                      <>
                        {permissions.map(permission => (
                          <div key={permission.permissionId} className="form-check">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedPermissions.includes(permission.permissionId)}
                              onChange={() => onPermissionCheckboxChange(permission.permissionId)}
                              disabled={isSaving}
                            />
                            <label className="form-check-label">
                              {permission.permissionName} - {permission.permissionDescription}
                            </label>
                          </div>
                        ))}
                        <Button
                          className="btn btn-danger mt-3"
                          onClick={onDeletePermissions}
                          disabled={isSaving || selectedPermissions.length === 0}
                        >
                          {isSaving ? 'Eliminando...' : 'Eliminar Permisos Seleccionados'}
                        </Button>
                      </>
                    ) : (
                      <p className="text-muted">No hay permisos disponibles</p>
                    )}
                  </div>
                ) : (
                  permissions.length > 0 ? (
                    <ul className="list-unstyled">
                      {permissions.map(permission => (
                        <li key={permission.permissionId}>
                          <strong>{permission.permissionName}</strong>: {permission.permissionDescription}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted mb-0">No tiene permisos asignados</p>
                  )
                )}
              </div>
            </div>

            <hr />

            {/* Notificaciones */}
            <div className="row">
              <div className="col-sm-4"><p className="mb-0">Notificaciones</p></div>
              <div className="col-sm-8">
                {canEdit('notifications') ? (
                  <>
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
                  </>
                ) : (
                  <ul className="list-unstyled mb-0">
                    <li>Email: {user.userAllowEmailNotification ? 'Sí' : 'No'}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};