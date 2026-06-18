import { UserTestAnswer } from './testType';

// Una carrera recomendada (nombres en snake_case: coinciden con la respuesta
// del backend Spring, que a su vez la recibe del microservicio FastAPI).
export interface CareerRecommendation {
  career_id: string;
  career_name: string;
  score: number; // probabilidad 0..1
}

export interface VocationalRecommendationResponse {
  recommendations: CareerRecommendation[];
  explanation: string[];
  profile_vector: Record<string, number>;
}

export interface VocationalRecommendationRequest {
  answers: UserTestAnswer[];
  topN: number;
}
