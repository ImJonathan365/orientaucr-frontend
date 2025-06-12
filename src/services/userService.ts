// src/services/userService.ts
import axios from 'axios';
import { User } from '../types/userType';

const API_BASE_URL = 'http://localhost:9999/api/user';

export const loginUser = async (userEmail: string, userPassword: string): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_BASE_URL}/login`, {
      userEmail,
      userPassword
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Credenciales incorrectas');
    }
    throw new Error('Error al iniciar sesión');
  }
};

export const registerUser = async (user: Pick<User, 'userName' | 'userEmail' | 'userPassword'>): Promise<string> => {
  const response = await axios.post<string>(`${API_BASE_URL}/register`, user, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const addUser = async (user: User, imageFile?: File): Promise<string> => {
  const formData = new FormData();
  formData.append('user', JSON.stringify(user));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await axios.post<string>(`${API_BASE_URL}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getAllUsers = async (userId: string): Promise<User[]> => {
  const response = await axios.get<User[]>(`${API_BASE_URL}/list`, {
    params: { userId }
  });
  return response.data;
};

export const searchUsers = async (search: string, userId: string): Promise<User[]> => {
  const response = await axios.get<User[]>(`${API_BASE_URL}/search`, {
    params: { search, userId }
  });
  return response.data;
};

export const deleteUser = async (userId: string): Promise<string> => {
  const response = await axios.delete<string>(`${API_BASE_URL}/delete/${userId}`);
  return response.data;
};

export const updateUser = async (user: User, imageFile?: File): Promise<string> => {
  const formData = new FormData();
  formData.append('user', JSON.stringify(user));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await axios.put<string>(`${API_BASE_URL}/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await axios.get<User>(`${API_BASE_URL}/find/${userId}`);
  return response.data;
};
