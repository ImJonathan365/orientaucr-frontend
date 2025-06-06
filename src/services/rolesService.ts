import axios from 'axios';
import { Roles } from '../types/rolesType';

const API_URL = 'http://localhost:9999/api/roles';

export const getAllRoles = async (): Promise<Roles[]> => {
    const response = await axios.get<Roles[]>(`${API_URL}/all`);
    return response.data;
};

export const getRolesById = async (id: string): Promise<Roles> => {
  const response = await axios.get<Roles>(`${API_URL}/${id}`);
  return response.data;
};

export const addRoles = async (test: Roles): Promise<string> => {
  const response = await axios.post<string>(`${API_URL}/add`, test);
  return response.data;
};

export const updateRoles = async (test: Roles): Promise<string> => {
  const response = await axios.put<string>(`${API_URL}/update`, test);
  return response.data;
};

export const deleteRoles = async (id: string): Promise<string> => {
  const response = await axios.delete<string>(`${API_URL}/delete/${id}`);
  return response.data;
};

/*export const submitRoles = async (answers: UserRoles[]): Promise<string> => {
  //const response = await axios.post<string>(`${API_URL}/submit-answers`, answers);
  //return response.data;
  console.log('Submitting answers: ', answers);
  return "200 OK";
};*/
export const getAllPermissions = async (): Promise<Permissions[]> => {
    const response = await axios.get<Permissions[]>(`${API_URL}/allPermissions`);
    return response.data;
}