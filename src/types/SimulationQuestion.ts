import { Category } from "./Category";

export type Difficulty = "easy" | "medium" | "hard";

export interface SimulationOption {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface SimulationQuestion {
  questionId: string;
  questionText: string;
  categories: Category[]; 
  options: SimulationOption[];
  difficulty?: Difficulty;
}