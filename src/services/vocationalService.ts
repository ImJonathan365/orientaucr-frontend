import axios from '../utils/AxiosConfig';
import { UserTestAnswer } from '../types/testType';
import { VocationalRecommendationResponse } from '../types/vocationalType';

// baseURL = http://localhost:9999/api  (definido en AxiosConfig)
const ENDPOINT = '/vocational';

/**
 * Envia las respuestas del test vocacional al backend, que delega el calculo
 * al microservicio FastAPI y devuelve el ranking de carreras recomendadas.
 */
export const getRecommendation = async (
  answers: UserTestAnswer[],
  topN: number = 3
): Promise<VocationalRecommendationResponse> => {
  const response = await axios.post<VocationalRecommendationResponse>(
    `${ENDPOINT}/recommend`,
    { answers, topN }
  );
  return response.data;
};
