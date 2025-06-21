export interface TestFormValidationResult {
  valid: boolean;
  message?: string;
}

export function validateTestForm(test: {
  questionText: string;
  questionHelpText: string;
  characteristics: any[];
}): TestFormValidationResult {
  const allowedRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:¡!¿?\-_'"/()]+$/;

  if (!test.questionText.trim()) {
    return { valid: false, message: "La pregunta es obligatoria." };
  }
  if (!allowedRegex.test(test.questionText)) {
    return { valid: false, message: "La pregunta solo puede contener letras, tildes, números y signos de puntuación." };
  }
  if (test.questionText.length > 400) {
    return { valid: false, message: "La pregunta no puede tener más de 400 caracteres." };
  }

  if (test.questionHelpText && !allowedRegex.test(test.questionHelpText)) {
    return { valid: false, message: "El texto de ayuda solo puede contener letras, tildes, números y signos de puntuación." };
  }
  if (test.questionHelpText && test.questionHelpText.length > 400) {
    return { valid: false, message: "El texto de ayuda no puede tener más de 400 caracteres." };
  }

  if (!test.characteristics || test.characteristics.length === 0) {
    return { valid: false, message: "Debe agregar al menos una característica." };
  }

  return { valid: true };
}