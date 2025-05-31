

import axios from 'axios';
import { Event } from '../types/EventTypes';

const API_URL = 'http://localhost:9999/api/events';

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await axios.get<Event[]>(`${API_URL}/allEvents`);
  return response.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const response = await axios.get<Event>(`${API_URL}/${id}`);
  return response.data;
};

export const addEvent = async (event: Event): Promise<string> => {
  const response = await axios.post<string>(`${API_URL}/add`, event);
  return response.data;
};

export const updateEvent = async (event: Event): Promise<string> => {
  const response = await axios.put<string>(`${API_URL}/update`, event);
  return response.data;
};

export const deleteEvent = async (id: string): Promise<string> => {
  const response = await axios.delete<string>(`${API_URL}/delete/${id}`);
  return response.data;
};
