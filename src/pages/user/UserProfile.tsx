import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { getUserProfileImage } from "../../services/userService";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

export const UserProfile = () => {
  const { user: currentUser } = useUser();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.userProfilePicture) {
      getUserProfileImage(currentUser.userProfilePicture).then(setProfileImageUrl);
    } else {
      setProfileImageUrl(null);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          No se encontró información del usuario.
        </div>
      </div>
    );
  }

  const formattedBirthdate = currentUser.userBirthdate
    ? DateTime.fromISO(currentUser.userBirthdate, { zone: "America/Costa_Rica" }).toFormat("dd/MM/yyyy")
    : "No especificada";

  return (
    <div className="container py-4 d-flex justify-content-center align-items-center min-vh-100">
      {/* Botón Volver al Home */}
      <div className="position-absolute" style={{ left: 32, top: 32 }}>
        <Button
          variant="secondary"
          onClick={() => navigate("/home")}
        >
          <Icon variant="home" className="me-1" />
          Regresar
        </Button>
      </div>
      <div className="card shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-body">
          <h2 className="mb-4 text-center">Mi Perfil</h2>
          <div className="mb-4 text-center">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Foto de perfil"
                className="mb-2"
                style={{
                  width: 128,
                  height: 128,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #ccc"
                }}
              />
            ) : (
              <span
                className="mb-2"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 128,
                  height: 128,
                  borderRadius: "50%",
                  border: "2px solid #ccc",
                  background: "#eee"
                }}
              >
                <Icon variant="user" size="xl" color="#888" />
              </span>
            )}
          </div>
          <div className="mb-3">
            <strong>Nombre:</strong> {currentUser.userName}
          </div>
          <div className="mb-3">
            <strong>Apellido:</strong> {currentUser.userLastname}
          </div>
          <div className="mb-3">
            <strong>Correo electrónico:</strong> {currentUser.userEmail}
          </div>
          <div className="mb-3">
            <strong>Fecha de nacimiento:</strong> {formattedBirthdate}
          </div>
          <div className="mb-3">
            <strong>Promedio de Educación Diversificada:</strong>{" "}
            {currentUser.userDiversifiedAverage ?? "No especificado"}
          </div>
          <div className="mb-3">
            <strong>Permitir notificaciones por correo:</strong>{" "}
            {currentUser.userAllowEmailNotification ? "Sí" : "No"}
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/profile/edit")}
            >
              Editar Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};