import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser } from '../services/userService';
import { UserProfileCard } from '../components/organisms/LoginSection/UserProfileCardProps';
import { User } from '../types/userType';
import { Permission } from '../types/permissionType';
import { getUserFromLocalStorage } from '../utils/Auth';

const UserProfilesPages: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  //const [userRoleName, setUserRoleName] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userList = await getAllUsers(getUserFromLocalStorage()?.userId || '');
        if (userList && userList.length > 0) {
          setUsers(userList);
          setSelectedUserId(userList[0].userId || null);
        } else {
          throw new Error('No se encontraron usuarios');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    const fetchUserDetails = async () => {
      try {
        // Busca el usuario seleccionado y su rol
        const user = users.find(u => u.userId === selectedUserId);
        if (user && user.userRoles && user.userRoles.length > 0) {
          //setUserRoleName(user.userRoles[0].rolName);
          setPermissions(user.userRoles[0].permissions || []);
          setSelectedPermissions(user.userRoles[0].permissions?.map(p => p.permissionId) || []);
        } else {
          //setUserRoleName('No asignado');
          setPermissions([]);
          setSelectedPermissions([]);
        }
      } catch (err) {
        setPermissions([]);
        //setUserRoleName('Error al cargar rol');
      }
    };
    fetchUserDetails();
  }, [selectedUserId, users]);

  const selectedUser = users.find(user => user.userId === selectedUserId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.userId !== selectedUserId) return user;
        let newValue: any = value;
        if (type === 'number') {
          newValue = value === '' ? null : Number(value);
        } else if (type === 'checkbox') {
          newValue = checked;
        } else if (type === 'date') {
          newValue = value || null;
        }
        return {
          ...user,
          [name]: newValue,
        };
      })
    );
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      // Actualiza el usuario con los permisos seleccionados
      const updatedUser: User = {
        ...selectedUser,
        userRoles: selectedUser.userRoles && selectedUser.userRoles.length > 0
          ? [{
              ...selectedUser.userRoles[0],
              permissions: permissions.filter(p => selectedPermissions.includes(p.permissionId))
            }]
          : []
      };
      await updateUser(updatedUser);
      setIsEditing(false);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.userId === updatedUser.userId ? updatedUser : u))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermissionCheckboxChange = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleDeletePermissions = async () => {
    if (!selectedUser || selectedPermissions.length === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      // Elimina los permisos seleccionados del usuario localmente
      setPermissions(prev =>
        prev.filter(p => !selectedPermissions.includes(p.permissionId))
      );
      setSelectedPermissions([]);
      // Actualiza el usuario en el backend
      const updatedUser: User = {
        ...selectedUser,
        userRoles: selectedUser.userRoles && selectedUser.userRoles.length > 0
          ? [{
              ...selectedUser.userRoles[0],
              permissions: permissions.filter(p => !selectedPermissions.includes(p.permissionId))
            }]
          : []
      };
      await updateUser(updatedUser);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.userId === updatedUser.userId ? updatedUser : u))
      );
    } catch (err) {
      setError('Error al eliminar permisos');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container my-5">Cargando perfil...</div>;
  if (error) return <div className="container my-5">Error: {error}</div>;
  if (users.length === 0) return <div className="container my-5">No hay usuarios disponibles</div>;
  if (!selectedUserId || !selectedUser) return <div className="container my-5">Seleccione un usuario</div>;

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-12">
          <h2>Seleccionar Usuario</h2>
          <select
            className="form-select"
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
            disabled={isEditing}
          >
            <option value="">Seleccione un usuario</option>
            {users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.userName} {user.userLastname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedUser && (
        <UserProfileCard
          editableFields={["personal_info", "role_permissions"]}
          user={selectedUser}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          onSave={handleSave}
          onInputChange={handleInputChange}
          isLoading={isLoading}
          isSaving={isSaving}
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          onPermissionCheckboxChange={handlePermissionCheckboxChange}
          onDeletePermissions={handleDeletePermissions}
        />
      )}
    </div>
  );
};

export default UserProfilesPages;