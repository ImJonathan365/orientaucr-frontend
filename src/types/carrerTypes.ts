export interface Characteristic {
  characteristicsId: string;
  characteristicsName: string;
  characteristicsDescription: string;
}

export interface Course {
  courseId: string;
  courseCode: string;
  courseCredits: number;
  courseName: string;
  courseDescription: string;
  courseSemester: number;
  prerequisites: string[];
}

export interface Curricula {
  curriculaId: string;
  courses?: Course[];
}

export interface Career {
  careerId: string;
  careerName: string;
  careerDescription: string;
  careerDurationYears: number;
  characteristics?: Characteristic[];
  curricula?: Curricula;
}

// Tipo para la respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}