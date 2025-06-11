import { Characteristic } from './careerTypes';

export interface Test {
  question_id: string;
  question_text: string;
  characteristics: Characteristic[];
}

export interface UserTestAnswer {
  question_id: string;
  selected_characteristics: string[]; // IDs de las características seleccionadas
}
