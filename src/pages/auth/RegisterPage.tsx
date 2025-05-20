import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenericForm, FormField } from "../../components/organisms/FormBar/GenericForm";
import { addUser } from "../../services/userService";
import { Alert } from "react-bootstrap";


export const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  const initialValues = {
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_phone_number: "",
    user_birthdate: "",
    user_password: "",
    user_admission_average: "",
    user_allow_email_notification: "true",
    user_allow_whatsapp_notification: "true",
    userProfilePicture: ""
  };

  const formFields: FormField[] = [
    { name: "user_name", label: "Nombre", type: "text", required: true, placeholder: "Ej: Juan" },
    { name: "user_lastname", label: "Apellido", type: "text", required: true, placeholder: "Ej: Pérez" },
    { name: "user_email", label: "Correo electrónico", type: "text", required: true, placeholder: "Ej: juan@email.com" },
    { name: "user_phone_number", label: "Teléfono", type: "text", required: true, placeholder: "Ej: 88889999" },
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
      accept: "image/png, image/jpeg, image/jpg",
      placeholder: ""
    }
  ];

  const handleSubmit = async (formData: any) => {
  setError(null);
  setSuccess(null);
  setIsLoading(true);
  
  try {
    // 1. Crear objeto FormData para el envío
    const formDataToSend = new FormData();

    // 2. Agregar todos los campos del formulario al FormData
    Object.entries(formData).forEach(([key, value]) => {
      // Convertir booleanos a string ("true"/"false")
      if (key === 'user_allow_email_notification' || key === 'user_allow_whatsapp_notification') {
        formDataToSend.append(key, value === "true" ? "true" : "false");
      } else {
        formDataToSend.append(key, String(value));
      }
    });

    // 3. Agregar el archivo de imagen si existe
    if (profilePictureFile) {
      formDataToSend.append('userProfilePicture', profilePictureFile);
    }

    // 4. Llamar al servicio con el FormData
    await addUser(formDataToSend);
    
    setSuccess("¡Usuario registrado exitosamente!");
    setTimeout(() => navigate("/login"), 2000);
  } catch (err: any) {
    setError(err.message || "Error al registrar usuario");
  } finally {
    setIsLoading(false);
  }
};

  // Manejador especial para la imagen de perfil
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, sube solo imágenes en formato JPG o PNG');
        return;
      }

      // Validar tamaño (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe exceder los 2MB');
        return;
      }

      setProfilePictureFile(file);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Registro de Usuario</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {/* Formulario principal */}
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