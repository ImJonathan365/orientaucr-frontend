import axios from 'axios';
import { Career } from '../types/CareerTypes';
const API_BASE_URL = 'http://localhost:9999/api/career'; // Reemplaza con tu URL real

export const getCareers = async () => {
  const response = await axios.get(`${API_BASE_URL}/list`);
  return response.data;
};

export const deleteCareer = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/delete/${id}`);
};

export const getCareerById = async (id: string): Promise<Career> => {
  const response = await axios.get(`${API_BASE_URL}/searchCareer/${id}`);
  return response.data as Career;
};

export const addCareer = async (careerData: Career) => {
  const response = await axios.post(`${API_BASE_URL}/add`, careerData);
  return response.data;
};

export const updateCareer = async (careerData: Career) => {
  const response = await axios.post(`${API_BASE_URL}/update`, careerData);
  return response.data;
};