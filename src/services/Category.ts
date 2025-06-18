 import axios from "axios";
import { Category } from "../types/Category";

const API_URL = "http://localhost:9999/api/categories";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await axios.get<Category[]>(API_URL);
  return res.data;
};

export const createCategory = async (category: Omit<Category, "categoryId">) => {
  const res = await axios.post<Category>(API_URL, category, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateCategory = async (category: Category) => {
  const res = await axios.put<Category>(`${API_URL}/${category.categoryId}`, category, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteCategory = async (categoryId: string) => {
  const res = await axios.delete(`${API_URL}/${categoryId}`);
  return res.data;
};