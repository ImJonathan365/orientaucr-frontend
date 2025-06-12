import { Characteristic } from './carrerTypes';

export interface Test {
  questionId: string;
  questionText: string;
  questionHelpText?: string;
  isActive: boolean;
  isMultipleSelection: boolean;
  characteristics: Characteristic[];
}

export interface UserTestAnswer {
  questionId: string;
  selectedCharacteristics: string[];
}