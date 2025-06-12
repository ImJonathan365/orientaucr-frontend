import axios from 'axios';
import { Campus } from '../types/campusType';

const API_URL = 'http://localhost:9999/api/campus';

export const getAllCampus = async (): Promise<Campus[]> => {
  const response = await axios.get<Campus[]>(`${API_URL}/all`);
  return response.data;
};

export const getCampusById = async (id: string): Promise<Campus> => {
  const response = await axios.get<Campus>(`${API_URL}/${id}`);
  return response.data;
};

export const addCampus = async (campus: Campus): Promise<string> => {
  try {
    const response = await axios.post<string>(`${API_URL}/add`, campus);
    return response.data;
  } catch (error: any) {
    const message = "Error al añadir el campus.\n\nYa existe un campus con el mismo nombre.";
    throw new Error(message);
  }
};

export const updateCampus = async (campus: Campus): Promise<string> => {
  const response = await axios.put<string>(`${API_URL}/update`, campus);
  return response.data;
};

export const deleteCampus = async (id: string): Promise<string> => {
  const response = await axios.delete<string>(`${API_URL}/delete/${id}`);
  return response.data;
};
