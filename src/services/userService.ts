import { UserFormData } from '../types/user';

const API_URL = 'http://localhost:9999/api/user';

export const registerUser = async (userData: UserFormData) => {
  try {
    // Preparar los datos para el backend
    const payload = {
      user_name: userData.user_name,
      user_lastname: userData.user_lastname,
      user_email: userData.user_email,
      user_phone_number: userData.user_phone_number ? parseInt(userData.user_phone_number) : null,
      user_birthdate: userData.user_birthdate ? new Date(userData.user_birthdate).toISOString() : null,
      user_password: userData.user_password,
      user_admission_average: userData.user_admission_average ? parseFloat(userData.user_admission_average) : null,
      user_allow_email_notification: userData.user_allow_email_notification,
      user_allow_whatsapp_notification: userData.user_allow_whatsapp_notification,
      userProfilePicture: userData.userProfilePicture || null,
      user_role: null
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
};
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_URL}/upload-profile-image`, {
      method: 'POST',
      body: formData,
      // No necesitas headers para FormData
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    return data.imagePath; // Asume que el backend devuelve la ruta
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
