import { SimulationQuestion } from "../types/SimulationQuestion";

const API_URL = 'http://localhost:9999/api/questions';

export const getAllQuestions = async (): Promise<SimulationQuestion[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getQuestionById = async (id: string): Promise<SimulationQuestion> => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const createQuestion = async (question: SimulationQuestion) => {
  const response = await fetch("http://localhost:9999/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    // Intenta leer el mensaje de error del backend
    const errorText = await response.text();
    throw new Error(errorText || "Error al crear la pregunta");
  }
  // No intentes hacer response.json() si el backend responde texto plano
  return await response.text();
};

export const updateQuestion = async (question: SimulationQuestion) => {
  const res = await fetch(`${API_URL}/${question.questionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al actualizar la pregunta");
  }
  return await res.text();
};

export const deleteQuestion = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al eliminar la pregunta");
  }
  return await res.text();
};