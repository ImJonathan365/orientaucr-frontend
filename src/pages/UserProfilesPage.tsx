import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserProfileCard } from '../components/organisms/LoginSection/UserProfileCardProps';

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get<ApiResponse<User[]>>('http://localhost:9999/api/user/listUser');
        
        if (data.data && data.data.length > 0) {
          setUsers(data.data);
          setSelectedUserId(data.data[0].user_id);
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
        const { data } = await axios.get<ApiResponse<Permission[]>>(
          'http://localhost:9999/api/roles/permissions/user', 
          { params: { user_id: selectedUserId } }
        );
        
        setPermissions(Array.isArray(data.data) ? data.data : []);
        // Obtener nombre del rol usando el procedimiento almacenado correcto
           const roleResponse = await axios.get<{ rol_name: string }>(
      'http://localhost:9999/api/roles/FindById',
      { params: { user_id: selectedUserId } }
    );

        setPermissions(Array.isArray(data.data) ? data.data : []);
         setUserRoleName(roleResponse.data.rol_name || 'No asignado');
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
    const { name, value, type } = e.target as HTMLInputElement;
    
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.user_id !== selectedUserId) return user;
        
        let newValue: any = value;
        
        if (type === 'number') {
          newValue = value === '' ? null : Number(value);
        } else if (type === 'checkbox') {
          newValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'date') {
          newValue = value || null;
        }
        
        return {
          ...user,
          [name]: newValue
        };
      });
    });
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    
    setIsSaving(true);
    try {
      // Actualizar datos del usuario
      await axios.put(
        `http://localhost:9999/api/user/update/${selectedUser.user_id}`,
        selectedUser
      );
      
      // Si se editó el rol, actualizarlo
      if (selectedUser.user_role !== userRoleName) {
        await axios.post(
          'http://localhost:9999/api/roles/update',
          {
            user_id: selectedUser.user_id,
            rol_id: selectedUser.user_role
          }
        );
      }
      
      setIsEditing(false);
      
      // Refrescar los datos después de guardar
      const roleResponse = await axios.get<string>(
        `http://localhost:9999/api/roles/FindById`,
        { params: { user_id: selectedUser.user_id } }
      );
      setUserRoleName(roleResponse.data || 'No asignado');
      
      const permissionsResponse = await axios.get<Permission[]>(
        'http://localhost:9999/api/roles/permissions/user', 
        { params: { user_id: selectedUser.user_id } }
      );
      setPermissions(Array.isArray(permissionsResponse.data) ? permissionsResponse.data : []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container my-5">Loading profile...</div>;
  if (error) return <div className="container my-5">Error: {error}</div>;
  if (!userWithRole) return <div className="container my-5">No user data found</div>;

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-12">
          <h2>Seleccionar Usuario</h2>
          <select 
            className="form-select"
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value)}
            disabled={isEditing}
          >
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {user.user_name} {user.user_lastname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <UserProfileCard editableFields={["role_permissions"]}
        user={userWithRole}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        onSave={handleSave}
        onInputChange={handleInputChange}
        isLoading={isLoading}
        isSaving={isSaving}
        permissions={permissions}
      />
    </div>
  );
};

export default UserProfilesPages;