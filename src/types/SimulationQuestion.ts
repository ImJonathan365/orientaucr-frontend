export type Difficulty = "easy" | "medium" | "hard";

export interface SimulationOption {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface SimulationQuestion {
  questionId: string;
  questionText: string;
  questionCategory?: string;
  options: SimulationOption[];
  difficulty?: Difficulty;
}