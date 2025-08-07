import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userService";
import { validateUserForm } from "../../validations/user/userFormValidation";
import Swal from "sweetalert2";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateUserForm({
      userName,
      userLastname: "",
      userEmail,
      userBirthdate: "",
      userPassword,
      userDiversifiedAverage: "",
    }, false);
    if (!validation.valid) {
      await Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: validation.message,
        confirmButtonText: "Aceptar",
      });
      return;
    }
    if (userPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        confirmButtonText: "Aceptar",
      });
    }
    setIsLoading(true);
    try {
      const user = {
        userName,
        userEmail,
        userPassword,
      };
      const message = await registerUser(user);
      setRegistrationSuccess(true);
      await Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.",
        confirmButtonText: "Aceptar",
      });

    } catch (err: any) {
      const backendMsg = err.response?.data || err.message || "Error al registrar usuario";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMsg,
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5">
      <div className="card shadow-sm w-100" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          {registrationSuccess ? (
            <div className="text-center">
              <h2 className="card-title text-success mb-4">¡Registro Exitoso!</h2>
              <div className="alert alert-info">
                <i className="bi bi-envelope-check fs-1 text-info d-block mb-3"></i>
                <p className="mb-3">
                  Te hemos enviado un correo de verificación a <strong>{userEmail}</strong>
                </p>
                <p className="text-muted">
                  Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
                </p>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => navigate("/login")}
              >
                Ir al Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="card-title text-center mb-4">Registro de Usuario</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">
                    Nombre:
                  </label>
                  <input
                    id="userName"
                    type="text"
                    className="form-control"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="Ej: Juan"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userEmail" className="form-label">
                    Correo electrónico:
                  </label>
                  <input
                    id="userEmail"
                    type="email"
                    className="form-control"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    placeholder="Ej: juan@email.com"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userPassword" className="form-label">
                    Contraseña:
                  </label>
                  <input
                    id="userPassword"
                    type="password"
                    className="form-control"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                    placeholder="********"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar contraseña:
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="********"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => navigate("/login")}
                >
                  Cancelar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
