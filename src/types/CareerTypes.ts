export interface Characteristic {
  characteristics_id: string;
  characteristics_name: string;
  characteristics_description: string;
}

export interface Career {
  career_id?: string; 
  career_name: string;
  career_description: string;
  career_duration_years: number;
  characteristicList?: Characteristic[];
}

// Tipo para la respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}