import axios from "../utils/AxiosConfig";
const API_URL = "http://localhost:9999/api/notifications";

export const getAllNotifications = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getNotificationById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createNotification = async (formData: FormData) => {
  Array.from(formData.entries()).forEach(pair => {
    if (pair[1] instanceof File) {
      console.log("FormData:", pair[0], (pair[1] as File).name);
    } else {
      console.log("FormData:", pair[0], pair[1]);
    }
  });
  const res = await axios.post(`${API_URL}/create`, formData);
  return res.data;
};
export const updateNotification = async (id: string, formData: FormData) => {
  Array.from(formData.entries()).forEach(pair => {
    if (pair[1] instanceof File) {
      console.log("FormData:", pair[0], (pair[1] as File).name);
    } else {
      console.log("FormData:", pair[0], pair[1]);
    }
  });
  const res = await axios.put(`${API_URL}/update/${id}`, formData); 
  return res.data;
};

export const deleteNotification = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};