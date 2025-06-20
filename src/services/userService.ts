import axios from "../utils/AxiosConfig";
import { User } from '../types/userType';
import { saveTokens, getToken } from '../utils/Auth';

const API_BASE_URL = 'http://localhost:9999/api';

export const loginUser = async (userEmail: string, userPassword: string): Promise<string> => {
  try {
    const response = await axios.post<{ token: string, refreshToken: string }>(`${API_BASE_URL}/auth/login`, {
      userEmail,
      userPassword
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    saveTokens(response.data.token, response.data.refreshToken);
    return response.data.token;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Credenciales incorrectas');
    }
    throw new Error('Error al iniciar sesión');
  }
};

export const registerUser = async (user: Pick<User, 'userName' | 'userEmail' | 'userPassword'>): Promise<string> => {
  const response = await axios.post<{ token: string, refreshToken: string }>(`${API_BASE_URL}/auth/register`, user, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  saveTokens(response.data.token, response.data.refreshToken);
  return response.data.token;
};

export const addUser = async (user: User, imageFile?: File): Promise<string> => {
  const formData = new FormData();
  formData.append('user', JSON.stringify(user));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await axios.post<string>(`${API_BASE_URL}/user/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getAllUsers = async (userId: string): Promise<User[]> => {
  const response = await axios.get<User[]>(`${API_BASE_URL}/user/list`, {
    params: { userId }
  });
  return response.data;
};

export const searchUsers = async (search: string, userId: string): Promise<User[]> => {
  const response = await axios.get<User[]>(`${API_BASE_URL}/user/search`, {
    params: { search, userId }
  });
  return response.data;
};

export const deleteUser = async (userId: string): Promise<string> => {
  const response = await axios.delete<string>(`${API_BASE_URL}/user/delete/${userId}`);
  return response.data;
};

export const updateUser = async (user: User, imageFile?: File): Promise<string> => {
  const formData = new FormData();
  formData.append('user', JSON.stringify(user));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await axios.put<string>(`${API_BASE_URL}/user/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await axios.get<User>(`${API_BASE_URL}/user/find/${userId}`);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const token = getToken();
  if (!token) throw new Error("No token");
  const response = await axios.get<User>(`${API_BASE_URL}/user/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getUserProfileImage = async (filename: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/users/${filename}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data as Blob);
  } catch {
    return null;
  }
};