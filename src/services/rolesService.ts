import axios from 'axios';
import { Roles } from '../types/rolesType';

const API_BASE_URL = 'http://localhost:9999/api/roles';

export const getAllRoles = async (): Promise<Roles[]> => {
  const response = await axios.get<Roles[]>(`${API_BASE_URL}/list`);
  return response.data;
};