// src/services/authService.ts
import { User } from '../types/user';

const API_URL = 'http://localhost:9999/api/user';

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

    console.log('Login successful:', data);
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};