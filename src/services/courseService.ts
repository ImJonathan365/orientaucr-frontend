import axios from 'axios';
import { Course } from '../types/carrerTypes';
const API_BASE_URL = 'http://localhost:9999/api/course'; 

export interface CourseCreate {
  courseCode: string;
  courseName: string;
  courseDescription: string;
  courseCredits: number;
  prerequisites: string[];
}

export const getCourses = async (): Promise<Course[]> => {
  const response = await axios.get(`${API_BASE_URL}/list`);
  const courses = response.data as Course[];
  return courses;
};

export const deleteCourse = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/delete/${id}`);
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await axios.get(`${API_BASE_URL}/searchCourse/${id}`);
  return response.data as Course;
};

export const addCourse = async (course: CourseCreate): Promise<Course> => {
    console.log("Curso a guardar", JSON.stringify(course, null, 2));
  const response = await axios.post(`${API_BASE_URL}/add`, course);
  return response.data as Course;
};

export const updateCourse = async (course: Course)=> {
  await axios.post(`${API_BASE_URL}/update`, course);
};
