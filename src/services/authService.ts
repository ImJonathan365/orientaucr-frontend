// src/services/authService.ts
//import { User } from '../types/user';

const API_URL = 'http://localhost:9999/api/user';

export interface User {
  user_id?: string;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone_number: number | null;
  user_birthdate: string | null;
  user_password: string;
  user_admission_average: number | null;
  user_allow_email_notification: boolean;
  user_allow_whatsapp_notification: boolean;
  userProfilePicture?: string;
  user_role?: string;
}

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
    throw new Error(data.message || 'Error en la autenticación');
    }

    if (!data.success) {

      throw new Error(data.message || 'Credenciales incorrectas');
    }

      const user: User = {
      user_id: data.user.user_id,
      user_name: data.user.user_name,
      user_lastname: data.user.user_lastname,
      user_email: data.user.user_email,
      user_phone_number: data.user.user_phone_number ?? null,
      user_birthdate: data.user.user_birthdate ?? null,
      user_password: data.user.user_password,
      user_admission_average: data.user.user_admission_average ?? null,
      user_allow_email_notification: data.user.user_allow_email_notification,
      user_allow_whatsapp_notification: data.user.user_allow_whatsapp_notification,
      userProfilePicture: data.user.userProfilePicture,
      user_role: data.user.user_role,
    };
    console.log('Login successful:', data);
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};