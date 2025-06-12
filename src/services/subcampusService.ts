import axios from 'axios';
import { Subcampus } from '../types/subcampusType';

const API_URL = 'http://localhost:9999/api/subcampus';

export const getAllSubcampus = async (): Promise<Subcampus[]> => {
  const response = await axios.get<Subcampus[]>(`${API_URL}/all`);
  return response.data;
};

export const getSubcampusById = async (id: string): Promise<Subcampus> => {
  const response = await axios.get<Subcampus>(`${API_URL}/${id}`);
  return response.data;
};

export const addSubcampus = async (subcampus: Subcampus): Promise<string> => {
  try {
    const response = await axios.post<string>(`${API_URL}/add`, subcampus);
    return response.data;
  } catch (error: any) {
    const message = "Error al añadir el subcampus.\n\nYa existe un subcampus con el mismo nombre o ubicación.";
    throw new Error(message);
  }
};

export const updateSubcampus = async (subcampus: Subcampus): Promise<string> => {
  const response = await axios.put<string>(`${API_URL}/update`, subcampus);
  return response.data;
};

export const deleteSubcampus = async (id: string): Promise<string> => {
  const response = await axios.delete<string>(`${API_URL}/delete/${id}`);
  return response.data;
};
