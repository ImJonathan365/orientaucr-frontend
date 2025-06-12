import axios from 'axios';
import { Career, Course } from '../types/carrerTypes';
const API_BASE_URL = 'http://localhost:9999/api/career'; 

interface AddCareerResponse {
  curriculaId: string;
}

export const getCareers = async (): Promise<Career[]> => {
  const response = await axios.get(`${API_BASE_URL}/list`);
  const careers = response.data as Career[];
  return careers;
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

export const addCourseToCareer = async (curriculaId: string, courseId: string, semester: number) => {
  const response = await axios.post(`${API_BASE_URL}/addCourse`, {
    curriculaId,
    courseId,
    semester
  });
  return response.data;
}

export const getCoursesForCurricula = async (curricula_id: string) => {
  const response = await axios.get(`${API_BASE_URL}/listCoursesForCurricula/${curricula_id}`);
  return response.data;
}

export const addCareer = async (careerData: any): Promise<string> => {
  const response = await axios.post<AddCareerResponse>(`${API_BASE_URL}/addCareer`, careerData);
  return response.data.curriculaId;
}

export const updateCareer = async (careerData: Career) => {
  const response = await axios.post(`${API_BASE_URL}/update`, careerData);
  return response.data;
};