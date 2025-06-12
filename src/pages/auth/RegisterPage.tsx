import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenericForm, FormField } from "../../components/organisms/FormBar/GenericForm";
import { registerUser } from "../../services/userService";
import Swal from "sweetalert2";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    userName: "",
    userEmail: "",
    userPassword: ""
  };

  const formFields: FormField[] = [
    { name: "userName", label: "Nombre", type: "text", required: true, placeholder: "Ej: Juan" },
    { name: "userEmail", label: "Correo electrónico", type: "text", required: true, placeholder: "Ej: juan@email.com" },
    { name: "userPassword", label: "Contraseña", type: "text", required: true, placeholder: "********" }
  ];

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);

    try {
      const user = {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword
      };
      await registerUser(user);
      await Swal.fire({
        icon: 'success',
        title: '¡Usuario registrado exitosamente!',
        confirmButtonText: 'Ir a iniciar sesión'
      });
      navigate("/login");
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || "Error al registrar usuario",
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Registro de Usuario</h2>
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