import React, { useState, useEffect } from 'react';
import { Image } from '../../atoms/Image/Image';
import { Input } from '../../atoms/Input/Input';

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

interface ApiResponse {
  data: User[];
}

const UserProfile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:9999/api/user/listUser');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.data && result.data.length > 0) {
          setUsers(result.data);
          setSelectedUserId(result.data[0].user_id); // Selecciona el primer usuario por defecto
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

  const selectedUser = users.find(user => user.user_id === selectedUserId) || null;

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
      const response = await fetch(`http://localhost:9999/api/user/update/${selectedUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container my-5">Loading profile...</div>;
  if (error) return <div className="container my-5">Error: {error}</div>;
  if (!selectedUser) return <div className="container my-5">No user data found</div>;

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

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <Image
                src={selectedUser.user_profile || 'https://via.placeholder.com/150'} 
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
                      value={selectedUser.user_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      type="text"
                      className="form-control text-center"
                      name="user_lastname"
                      value={selectedUser.user_lastname || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h5 className="card-title">{selectedUser.user_name} {selectedUser.user_lastname}</h5>
                  <p className="text-muted mb-1">{selectedUser.user_email}</p>
                </>
              )}
              
              <div className="d-flex justify-content-center mb-2">
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading || isSaving}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button 
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={isLoading || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Personal Information</h5>
              
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
                      value={selectedUser.user_email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-muted mb-0">{selectedUser.user_email}</p>
                  )}
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-sm-4">
                  <p className="mb-0">Phone</p>
                </div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="tel"
                      className="form-control"
                      name="user_phone_number"
                      value={selectedUser.user_phone_number || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-muted mb-0">
                      {selectedUser.user_phone_number ? `+${selectedUser.user_phone_number}` : 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-sm-4">
                  <p className="mb-0">Birthdate</p>
                </div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="date"
                      className="form-control"
                      name="user_birthdate"
                      value={selectedUser.user_birthdate?.substring(0, 10) || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-muted mb-0">
                      {selectedUser.user_birthdate ? new Date(selectedUser.user_birthdate).toLocaleDateString() : 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-sm-4">
                  <p className="mb-0">Member since</p>
                </div>
                <div className="col-sm-8">
                  <p className="text-muted mb-0">
                    {selectedUser.create_at ? new Date(selectedUser.create_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-sm-4">
                  <p className="mb-0">Admission Average</p>
                </div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="number"
                      className="form-control"
                      name="user_admission_average"
                      value={selectedUser.user_admission_average || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <p className="text-muted mb-0">{selectedUser.user_admission_average || 'Not provided'}</p>
                  )}
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-sm-4">
                  <p className="mb-0">Notifications</p>
                </div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <div>
                      <div className="form-check">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="user_allow_email_notification"
                          checked={selectedUser.user_allow_email_notification || false}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">
                          Email Notifications
                        </label>
                      </div>
                      <div className="form-check">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="user_allow_whatsapp_notification"
                          checked={selectedUser.user_allow_whatsapp_notification || false}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">
                          WhatsApp Notifications
                        </label>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted mb-0">
                      Email: {selectedUser.user_allow_email_notification ? 'Enabled' : 'Disabled'}, 
                      WhatsApp: {selectedUser.user_allow_whatsapp_notification ? 'Enabled' : 'Disabled'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;