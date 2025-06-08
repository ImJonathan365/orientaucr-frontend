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
}