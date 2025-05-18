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

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUser({
  user_id: String(data.id),
  user_name: data.name.split(' ')[0] || '',
  user_lastname: data.name.split(' ')[1] || '',
  user_email: data.email || '',
  user_phone_number: data.phone
    ? parseInt(data.phone.replace(/\D/g, ''), 10)
    : null,
  user_birthdate: null,
  user_admission_average: null,
  user_allow_email_notification: false,
  user_allow_whatsapp_notification: false,
  create_at: new Date().toISOString(),
  user_role: null,
  user_profile: null
});

       
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Implement save functionality here
    setIsEditing(false);
    // You would typically make an API call to save the changes here
  };

  if (isLoading) return <div className="container my-5">Loading profile...</div>;
  if (error) return <div className="container my-5">Error: {error}</div>;
  if (!user) return <div className="container my-5">No user data found</div>;

  return (
    <div className="container my-5">
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
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <Input
                      type="text"
                      className="form-control text-center"
                      name="user_lastname"
                      value={user.user_lastname || ''}
                      onChange={handleInputChange}
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
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button 
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
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
                      value={user.user_email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.user_email}</p>
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
                      value={user.user_phone_number || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.user_phone_number || 'Not provided'}</p>
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
                      value={user.user_birthdate || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.user_birthdate || 'Not provided'}</p>
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
                    {user.create_at ? new Date(user.create_at).toLocaleDateString() : 'Unknown'}
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
                      value={user.user_admission_average || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.user_admission_average || 'Not provided'}</p>
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
                          checked={user.user_allow_email_notification || false}
                          onChange={(e) => setUser(prev => ({
                            ...prev!
                           
                          }))}
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
                          checked={user.user_allow_whatsapp_notification || false}
                          onChange={(e) => setUser(prev => ({
                            ...prev!
                        
                          }))}
                        />
                        <label className="form-check-label">
                          WhatsApp Notifications
                        </label>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted mb-0">
                      Email: {user.user_allow_email_notification ? 'Enabled' : 'Disabled'}, 
                      WhatsApp: {user.user_allow_whatsapp_notification ? 'Enabled' : 'Disabled'}
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