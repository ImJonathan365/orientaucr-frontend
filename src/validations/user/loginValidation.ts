export function loginValidation(email: string, password: string) {
  if (!email.trim()) {
    return { valid: false, message: "El correo es obligatorio." };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return { valid: false, message: "El correo no tiene un formato válido." };
  }
  if (password.trim().length === 0) {
    return { valid: false, message: "Debes ingresar una contraseña." };
  }
  return { valid: true, message: "" };
}