import { DateTime } from "luxon";

export interface UserFormValidationResult {
    valid: boolean;
    message?: string;
}

export function validateUserForm(
    form: {
        userName: string;
        userLastname: string;
        userEmail: string;
        userBirthdate: string;
        userPassword: string;
        userDiversifiedAverage: string;
    },
    isEdit: boolean = false
): UserFormValidationResult {
    // Name
    if (!form.userName.trim()) {
        return { valid: false, message: "El nombre es obligatorio." };
    }
    if (!/^[A-Za-z0-9]{1,100}$/.test(form.userName)) {
        return { valid: false, message: "El nombre solo puede contener letras y números, sin espacios ni caracteres especiales, máximo 100 caracteres." };
    }
    // Lastname
    if (form.userLastname && !/^[A-Za-z0-9 ]{1,100}$/.test(form.userLastname)) {
        return { valid: false, message: "El apellido solo puede contener letras, números y espacios, máximo 100 caracteres." };
    }
    // Email
    if (!form.userEmail.trim()) {
        return { valid: false, message: "El correo es obligatorio." };
    }
    if (form.userEmail.length > 255) {
        return { valid: false, message: "El correo no puede tener más de 255 caracteres." };
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.userEmail)) {
        return { valid: false, message: "El correo no tiene un formato válido." };
    }
    // Birthdate
    if (form.userBirthdate) {
        const nowCR = DateTime.now().setZone("America/Costa_Rica");
        const birth = DateTime.fromISO(form.userBirthdate, { zone: "America/Costa_Rica" });
        const age = nowCR.diff(birth, "years").years;
        if (birth > nowCR) {
            return { valid: false, message: "La fecha de nacimiento no puede ser futura." };
        }
        if (age < 12) {
            return { valid: false, message: "El usuario debe tener al menos 12 años." };
        }
        if (age > 65) {
            return { valid: false, message: "El usuario no puede tener más de 65 años." };
        }
    }
    // Password
    if (!isEdit || (isEdit && form.userPassword)) {
        if (!form.userPassword) {
            return { valid: false, message: "La contraseña es obligatoria." };
        }
        if (form.userPassword.length < 8 || form.userPassword.length > 255) {
            return { valid: false, message: "La contraseña debe tener entre 8 y 255 caracteres." };
        }
        if (!/^[A-Za-z0-9!@#$%^&*()_\-+=]+$/.test(form.userPassword)) {
            return { valid: false, message: "La contraseña solo puede contener letras, números y !@#$%^&*()-_+= (sin espacios ni caracteres raros)." };
        }
    }
    //  Diversified Average
    if (form.userDiversifiedAverage) {
        const value = form.userDiversifiedAverage;
        if (!/^\d{1,2}(\.\d{1,2}|,\d{1,2})?$|^100(\.\d{1,2}|,\d{1,2})?$/.test(value)) {
            return { valid: false, message: "El promedio debe ser un número entre 0 y 100 con hasta dos decimales (ej: 85.50 o 85,50)." };
        }
        if (/^[.,]/.test(value) || /[.,]$/.test(value)) {
            return { valid: false, message: "El promedio no puede empezar ni terminar con punto o coma." };
        }
        if ((value.match(/[.,]/g) || []).length > 1) {
            return { valid: false, message: "El promedio solo puede tener un punto o coma como separador decimal." };
        }
        const avg = Number(value.replace(",", "."));
        if (isNaN(avg) || avg < 0 || avg > 100) {
            return { valid: false, message: "El promedio de Educación Diversificada debe ser un número entre 0 y 100." };
        }
    }

    return { valid: true };
}