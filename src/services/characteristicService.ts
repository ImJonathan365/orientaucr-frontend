import axios from 'axios';
import { Characteristic } from '../types/carrerTypes';
const API_URL = 'http://localhost:9999/api/characteristic';

export const getAllCharacteristics = async (): Promise<Characteristic[]> => {
    const response = await axios.get<any[]>(`${API_URL}/all`);
    return Array.isArray(response.data) ? response.data : [];
}