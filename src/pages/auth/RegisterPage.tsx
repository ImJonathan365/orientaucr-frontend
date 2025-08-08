import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userService";
import { validateUserForm } from "../../validations/user/userFormValidation";
import { showError, showSuccess } from "../../utils/Alert";
import { RegistrationForm, RegistrationSuccess } from "../../components/organisms";

interface RegistrationFormData {
  userName: string;
  userEmail: string;
  userPassword: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUserForm({
      userName: formData.userName,
      userLastname: "",
      userEmail: formData.userEmail,
      userBirthdate: "",
      userPassword: formData.userPassword,
      userDiversifiedAverage: "",
    }, false);
    if (!validation.valid) {
      await showError("Error de validación", validation.message || "Datos inválidos");
      return;
    }
    if (formData.userPassword !== formData.confirmPassword) {
      await showError("Error", "Las contraseñas no coinciden");
      return;
    }
    setIsLoading(true);
    try {
      const user = {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
      };
      const message = await registerUser(user);
      console.log("Registro exitoso:", message);
      setRegistrationSuccess(true);
      await showSuccess(
        "Registro exitoso",
        "Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada."
      );
    } catch (err: any) {
      const backendMsg = err.response?.data || err.message || "Error al registrar usuario";
      await showError("Error", backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5">
      <div className="card shadow-sm w-100" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          {registrationSuccess ? (
            <RegistrationSuccess
              userEmail={formData.userEmail}
              onGoToLogin={handleGoToLogin}
            />
          ) : (
            <RegistrationForm
              formData={formData}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};
