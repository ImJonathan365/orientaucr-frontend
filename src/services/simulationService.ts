import axios from "axios";
import { SimulationQuestion } from "../types/SimulationQuestion";

const API_URL = "http://localhost:9999/api/questions";

export const getAllQuestions = async (): Promise<SimulationQuestion[]> => {
  const res = await axios.get<SimulationQuestion[]>(API_URL);
  return res.data;
};

export const getQuestionById = async (id: string): Promise<SimulationQuestion> => {
  const res = await axios.get<SimulationQuestion>(`${API_URL}/${id}`);
  return res.data;
};

export const createQuestion = async (question: SimulationQuestion) => {
  const res = await axios.post(`${API_URL}`, question, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
 
export const updateQuestion = async (question: SimulationQuestion) => {
  const res = await axios.put(`${API_URL}/${question.questionId}`, question, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteQuestion = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const getSimulationExam = async (): Promise<SimulationQuestion[]> => {
  const res = await axios.get<SimulationQuestion[]>(`${API_URL}/simulation-exam`);
  return res.data;
};

export const submitExamAttempt = async (attempt: {
  attemptScore: number;
  userId: string;
}) => {
  const res = await axios.post(`${API_URL}/submit-exam`, attempt, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};