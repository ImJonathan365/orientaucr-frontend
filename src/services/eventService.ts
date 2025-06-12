import axios from 'axios';
import { Event } from '../types/EventTypes';

const API_URL = 'http://localhost:9999/api/events';
export const getAllEvents = async (): Promise<Event[]> => {
  const response = await axios.get<Event[]>(`${API_URL}/allEvents`);
  
  // Procesar cada evento para agregarle la URL de imagen completa
  const eventsWithFullImagePath = response.data.map(event => ({
    ...event,
    eventImagePath: event.eventImagePath 
      ? `${API_URL}/images/${encodeURIComponent(event.eventImagePath)}` 
      : null
  }));

  return eventsWithFullImagePath;
};
export const getEventById = async (id: string): Promise<Event> => {
  const response = await axios.get<Event>(`${API_URL}/${id}`);
  return response.data;
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
