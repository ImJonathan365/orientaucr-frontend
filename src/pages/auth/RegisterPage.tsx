import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenericForm, FormField } from "../../components/organisms/FormBar/GenericForm";
import { registerUser } from "../../services/userService";
import { Alert } from "react-bootstrap";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_phone_number: "",
    user_birthdate: "",
    user_password: "",
    user_admission_average: "",
    user_allow_email_notification: false,
    user_allow_whatsapp_notification: false,
    userProfilePicture: ""
  };

  // ...existing code...
  const formFields: FormField[] = [
    { name: "user_name", label: "Nombre", type: "text", required: true, placeholder: "Ej: Juan" },
    { name: "user_lastname", label: "Apellido", type: "text", required: true, placeholder: "Ej: Pérez" },
    { name: "user_email", label: "Correo electrónico", type: "text", required: true, placeholder: "Ej: juan@email.com" },
    { name: "user_phone_number", label: "Teléfono", type: "text", required: false, placeholder: "Ej: 88889999" },
    { name: "user_birthdate", label: "Fecha de nacimiento", type: "date", required: false },
    { name: "user_password", label: "Contraseña", type: "text", required: true, placeholder: "********" },
    { name: "user_admission_average", label: "Promedio de admisión", type: "number", required: false, placeholder: "Ej: 800" },
    {
      name: "user_allow_email_notification",
      label: "Permitir notificaciones por correo",
      type: "select",
      required: true,
      options: [
        { value: "true", label: "Sí" },
        { value: "false", label: "No" }
      ]
    },
    {
      name: "user_allow_whatsapp_notification",
      label: "Permitir notificaciones por WhatsApp",
      type: "select",
      required: true,
      options: [
        { value: "true", label: "Sí" },
        { value: "false", label: "No" }
      ]
    },
    {
      name: "userProfilePicture",
      label: "Foto de perfil",
      type: "file",
      required: false,
      //accept: ".png,.jpg,.jpeg", // <-- permite solo png y jpg
      placeholder: ""
    }
  ];
  // ...existing code...

  const handleSubmit = async (formData: any) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      // Convierte los campos select a booleanos
      formData.user_allow_email_notification = formData.user_allow_email_notification === "true";
      formData.user_allow_whatsapp_notification = formData.user_allow_whatsapp_notification === "true";
      await registerUser(formData);
      setSuccess("¡Usuario registrado exitosamente!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Registro de Usuario</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <GenericForm
        title=""
        initialValues={initialValues}
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/login")}
        submitText={isLoading ? "Registrando..." : "Registrarse"}
        cancelText="Cancelar"
      />
    </div>
  );
};