import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999/api/career'; // Reemplaza con tu URL real

export const getCareers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/list`);
  return response.data;
};

export const deleteCareer = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/careers/${id}`);
};

export const saveCareer = async (careerData: any) => {
  if (careerData.career_id) {
    // Actualización
    const response = await axios.put(
      `${API_BASE_URL}/careers/${careerData.career_id}`,
      careerData
    );
    return response.data;
  } else {
    // Creación
    const response = await axios.post(
      `${API_BASE_URL}/careers`,
      careerData
    );
    return response.data;
  }
};