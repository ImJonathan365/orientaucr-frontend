import axios from 'axios';
import { Event } from '../types/EventTypes';

const API_URL = 'http://localhost:9999/api/events';
export const getAllEvents = async (): Promise<Event[]> => {
  const response = await axios.get<Event[]>(`${API_URL}/allEvents`);

  return response.data;;
};
export const getEventById = async (id: string): Promise<Event> => {
  const response = await axios.get<Event>(`${API_URL}/${id}`);
  return response.data;
};
export const getUserInterestedEvents = async (userId: string): Promise<string[]> => {
  const response = await axios.get<string[]>(`${API_URL}/user/${userId}/interested-events`);
  return response.data;
};

export const getImage = async (eventImagePath: string): Promise<string> => {
  const response = await axios.get(`${API_URL}/images/${encodeURIComponent(eventImagePath)}`, {
    responseType: "blob", 
  });
  return URL.createObjectURL(response.data as Blob);
};

export const addEvent = async (formData: FormData): Promise<string> => {
  const response = await axios.post<string>(`${API_URL}/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const updateEvent = async (formData: FormData): Promise<string> => {
  const response = await axios.put<string>(`${API_URL}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const deleteEvent = async (id: string): Promise<string> => {
  const response = await axios.delete<string>(`${API_URL}/delete/${id}`);
  return response.data;
};
export const insertUserInterestedEvent = async (
  eventId: string,
  userId: string
): Promise<string> => {
  const response = await axios.post<string>(
    `${API_URL}/interested/${eventId}/${userId}`
  );
  return response.data;
};
export const removeUserInterestedEvent = async (
  eventId: string,
  userId: string
): Promise<string> => {
  const response = await axios.post<string>(
    `${API_URL}/remove/${eventId}/${userId}`
  );
  return response.data;
};