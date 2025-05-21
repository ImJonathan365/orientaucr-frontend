import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  updateUser
} from '../services/userService';
import { UserProfileCard } from '../components/organisms/LoginSection/UserProfileCardProps';
import { User } from '../types/user';
import axios from 'axios';

interface Permission {
  permission_id: string;
  permission_name: string;
  permission_description: string;
}

interface ApiResponse<T> {
  data: T;
}

const UserProfilesPages: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoleName, setUserRoleName] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userList = await getAllUsers();

        if (userList && userList.length > 0) {
          setUsers(userList);
          setSelectedUserId(userList[0].user_id || null);
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
        const [{ data: permissionData }, roleResponse] = await Promise.all([
          axios.get<ApiResponse<Permission[]>>('http://localhost:9999/api/roles/permissions/user', {
            params: { user_id: selectedUserId },
          }),
          axios.get<{ rol_name: string }>('http://localhost:9999/api/roles/FindById', {
            params: { user_id: selectedUserId },
          }),
        ]);

        setPermissions(Array.isArray(permissionData.data) ? permissionData.data : []);
        setUserRoleName(roleResponse.data.rol_name || 'No asignado');
        setSelectedPermissions([]); // Resetear selección al cambiar de usuario
      } catch (err) {
        console.error('Error al cargar detalles:', err);
        setPermissions([]);
        setUserRoleName('Error al cargar rol');
      }
    };

    fetchUserDetails();
  }, [selectedUserId]);

  const selectedUser = users.find(user => user.user_id === selectedUserId);
  const userWithRole = selectedUser ? {
    ...selectedUser,
    user_role: userRoleName
  } : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.user_id !== selectedUserId) return user;

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
    // 1. Actualizar datos básicos del usuario
    await updateUser(selectedUser);

    // 2. Actualizar rol solo si cambió
    if (selectedUser.user_role !== userRoleName) {
      await axios.post('http://localhost:9999/api/roles/update', {
        user_id: selectedUser.user_id,
        rol_id: selectedUser.user_role,
      });
      
      // Actualizar el nombre del rol localmente
      const roleResponse = await axios.get<{ rol_name: string }>('http://localhost:9999/api/roles/FindById', {
        params: { user_id: selectedUser.user_id },
      });
      setUserRoleName(roleResponse.data.rol_name || 'No asignado');
    }

    setIsEditing(false);
    
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
  if (!selectedUserId || selectedPermissions.length === 0) return;

  try {
    setIsSaving(true);
    setError(null);
    
    // Versión más robusta con manejo de errores
    await Promise.all(
      selectedPermissions.map(permissionId => 
        axios.post('http://localhost:9999/api/roles/delete', {
          user_id: selectedUserId,
          permission_id: permissionId
        })
      )
    );

    // Actualización optimista (sin volver a cargar)
    setPermissions(prev => 
      prev.filter(p => !selectedPermissions.includes(p.permission_id))
    );
    setSelectedPermissions([]);

  } catch (err) {
    setError('Error al eliminar permisos');
    console.error('Error:', err);
    // Opcional: Recargar permisos para sincronizar
    const { data } = await axios.get<ApiResponse<Permission[]>>(
      'http://localhost:9999/api/roles/permissions/user', 
      { params: { user_id: selectedUserId } }
    );
    setPermissions(Array.isArray(data.data) ? data.data : []);
  } finally {
    setIsSaving(false);
  }
};

  if (isLoading) return <div className="container my-5">Loading profile...</div>;
  if (error) return <div className="container my-5">Error: {error}</div>;
  if (users.length === 0) return <div className="container my-5">No hay usuarios disponibles</div>;
  if (!selectedUserId || !userWithRole) return <div className="container my-5">Seleccione un usuario</div>;

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
              <option key={user.user_id} value={user.user_id}>
                {user.user_name} {user.user_lastname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {userWithRole && (
        <UserProfileCard
          editableFields={["personal_info"]}
          user={userWithRole}
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