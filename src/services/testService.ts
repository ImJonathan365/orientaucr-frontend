import axios from 'axios';
import { Test, UserTestAnswer } from '../types/testType';

const API_URL = 'http://localhost:9999/api/test';

export const getAllTests = async (): Promise<Test[]> => {
    const response = await axios.get<Test[]>(`${API_URL}/list`);
    return response.data;
};

export const getTestById = async (id: string): Promise<Test> => {
    const response = await axios.get<Test>(`${API_URL}/find/${id}`);
    return response.data;
};

export const addTest = async (test: Test): Promise<string> => {
    const response = await axios.post<string>(`${API_URL}/add`, test);
    return response.data;
};

export const updateTest = async (test: Test): Promise<string> => {
    const response = await axios.put<string>(`${API_URL}/update`, test);
    return response.data;
};

export const deleteTest = async (id: string): Promise<string> => {
    const response = await axios.delete<string>(`${API_URL}/delete/${id}`);
    return response.data;
};

export const submitTestAnswers = async (answers: UserTestAnswer[]): Promise<string> => {
    console.log('Submitting answers: ', answers);
    return "200 OK";
};