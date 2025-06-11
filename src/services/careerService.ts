import axios from 'axios';
import { Career, Course } from '../types/CareerTypes';
const API_BASE_URL = 'http://localhost:9999/api/career'; 

export const getCareers = async () => {
  const response = await axios.get(`${API_BASE_URL}/list`);
  return response.data;
};

export const deleteCareer = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/delete/${id}`);
};

export const deleteCourseFromCareer = async (curriculaId: string, courseId: string) => {
  await axios.delete(`${API_BASE_URL}/deleteCourse/${curriculaId}/${courseId}`);
}

export const getCareerById = async (id: string): Promise<Career> => {
  const response = await axios.get(`${API_BASE_URL}/searchCareer/${id}`);
  const career = response.data as Career;
  if (career.curricula && career.curricula.curriculaId) {
    const coursesResponse = await axios.get(`${API_BASE_URL}/listByCurricula/${career.curricula.curriculaId}`);
    career.curricula.courses = coursesResponse.data as Course[];
  }
  return career;
};

export const addCareer = async (careerData: Career) => {
  const response = await axios.post(`${API_BASE_URL}/add`, careerData);
  return response.data;
};

export const updateCareer = async (careerData: Career) => {
  const response = await axios.post(`${API_BASE_URL}/update`, careerData);
  return response.data;
};