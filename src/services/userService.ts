// src/services/userService.ts
import axios from 'axios';
import { User } from '../types/user';

const API_BASE_URL = 'http://localhost:9999/api/user';

export const addUser = async (addUser : any) => {
   const response = await axios.post<User>(`${API_BASE_URL}/add`, addUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

export const login = async (user_email: string, user_password: string) => {
  try {
    const response = await axios.post<User>(
      `${API_BASE_URL}/login`,
      { user_email, user_password },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Credenciales incorrectas');
    }
    throw new Error('Error al iniciar sesión');
  }
};


