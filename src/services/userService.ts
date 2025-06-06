// src/services/userService.ts
import axios from 'axios';
import { User } from '../types/userType';

const API_BASE_URL = 'http://localhost:9999/api/user';

export const addUser = async (addUser : any) => {
   const response = await axios.post<User>(`${API_BASE_URL}/add`, addUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

export const login = async (userEmail: string, userPassword: string) => {
  try {
    const response = await axios.post<User>(
      `${API_BASE_URL}/login`,
      { userEmail, userPassword },
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

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${API_BASE_URL}/list`);
  return response.data;
};
export const deleteUser = async (userId: string) => {
  await axios.delete(`${API_BASE_URL}/delete/${userId}`);
};

export const updateUser = async (user: User) => {
  await axios.post(`${API_BASE_URL}/update`, user, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await axios.get<User>(`${API_BASE_URL}/search/${userId}`);
  return response.data;
};
