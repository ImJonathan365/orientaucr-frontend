import React, { useRef, useState } from "react";
import { User } from "../../types/userType";
import { updateUser, getCurrentUser } from "../../services/userService";
import Swal from "sweetalert2";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";
import { Title } from "../../components/atoms/Title/Ttile";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Form state for editing
  const [form, setForm] = useState({
    userName: user?.userName || "",
    userLastname: user?.userLastname || "",
    userEmail: user?.userEmail || "",
    userBirthdate: user?.userBirthdate || "",
    userPassword: user?.userPassword || "",
    userAdmissionAverage: user?.userAdmissionAverage?.toString() || "",
    userAllowEmailNotification: user?.userAllowEmailNotification || false,
    userProfilePicture: user?.userProfilePicture || "",
  });

  if (!user) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          No se encontró información del usuario.
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePictureFile(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!form.userName.trim()) {
        Swal.fire({ icon: "error", title: "Nombre requerido", text: "El nombre no puede estar vacío o solo espacios." });
        setIsSaving(false);
        return;
      }
      const avg = form.userAdmissionAverage === "" ? null : Number(form.userAdmissionAverage);
      if (avg !== null && (avg < 0 || avg > 800)) {
        Swal.fire({ icon: "error", title: "Promedio inválido", text: "El promedio debe estar entre 0 y 800." });
        setIsSaving(false);
        return;
      }
      if (form.userBirthdate && isFutureDate(form.userBirthdate)) {
        Swal.fire({
          icon: "error",
          title: "Fecha inválida",
          text: "La fecha de nacimiento no puede ser futura.",
        });
        setIsSaving(false);
        return;
      }
      if (form.userPassword && form.userPassword.length < 8) {
        Swal.fire({
          icon: "error",
          title: "Contraseña inválida",
          text: "Debe tener al menos 8 caracteres.",
        });
        setIsSaving(false);
        return;
      }

      const updatedUser: User = {
        ...user,
        userName: form.userName,
        userLastname: form.userLastname,
        userEmail: form.userEmail,
        userBirthdate: form.userBirthdate,
        userPassword: form.userPassword,
        userAdmissionAverage: form.userAdmissionAverage === "" ? null : Number(form.userAdmissionAverage),
        userAllowEmailNotification: form.userAllowEmailNotification,
        userProfilePicture: user.userProfilePicture
      };

      await updateUser(updatedUser, profilePictureFile || undefined);
      setUser(updatedUser);
      setIsEditing(false);
      await Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        confirmButtonText: "Aceptar",
      });
      setProfilePictureFile(null);
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Error al guardar los cambios",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isFutureDate = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr > today;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No proporcionado';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Mi Perfil</h2>
      <div className="row">
        {/* Mi Perfil: Imagen y botón editar */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <img
                src={
                  user.userProfilePicture
                    ? `http://localhost:9999/users/${user.userProfilePicture}`
                    : 'https://via.placeholder.com/150'
                }
                alt="Profile"
                className="rounded-circle img-fluid mb-3"
                style={{ width: '150px', objectFit: 'cover', cursor: isEditing ? 'pointer' : 'default' }}
                onClick={() => {
                  if (isEditing && fileInputRef.current) fileInputRef.current.click();
                }}
                title={isEditing ? "Cambiar foto de perfil" : ""}
              />
              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    disabled={isSaving}
                  />
                  <small className="text-muted d-block mb-2">Haz clic en la imagen para cambiarla</small>
                </div>
              )}
              <h5 className="card-title">{user.userName} {user.userLastname}</h5>
              <div className="d-flex justify-content-center mb-2">
                <Button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isSaving}
                >
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </Button>
                {isEditing && (
                  <Button
                    className="btn btn-success ms-2"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                )}
              </div>
              <Button
                className="btn btn-secondary mt-2"
                onClick={() => navigate("/home")}
              >
                Volver
              </Button>
            </div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <Title variant="h5" className="card-title">Información Personal</Title>

              {/* Nombre */}
              <div className="row">
                <div className="col-sm-4"><p className="mb-0">Nombre</p></div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="text"
                      className="form-control"
                      name="userName"
                      value={form.userName}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.userName}</p>
                  )}
                </div>
              </div>
              <hr />

              {/* Apellido */}
              <div className="row">
                <div className="col-sm-4"><p className="mb-0">Apellido</p></div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="text"
                      className="form-control"
                      name="userLastname"
                      value={form.userLastname}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.userLastname ? user.userLastname : 'No proporcionado'}</p>
                  )}
                </div>
              </div>
              <hr />
              {/* Email */}
              <div className="row">
                <div className="col-sm-4"><p className="mb-0">Correo</p></div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="email"
                      className="form-control"
                      name="userEmail"
                      value={form.userEmail}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.userEmail}</p>
                  )}
                </div>
              </div>
              <hr />

              {/* Cumpleaños */}
              <div className="row">
                <div className="col-sm-4"><p className="mb-0">Fecha de nacimiento</p></div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="date"
                      className="form-control"
                      name="userBirthdate"
                      value={form.userBirthdate?.substring(0, 10) || ''}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-muted mb-0">{formatDate(user.userBirthdate)}</p>
                  )}
                </div>
              </div>
              <hr />

              {/* Promedio */}
              <div className="row">
                <div className="col-sm-4"><p className="mb-0">Promedio de admisión</p></div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <Input
                      type="number"
                      className="form-control"
                      name="userAdmissionAverage"
                      value={form.userAdmissionAverage}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max="800"
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="text-muted mb-0">{user.userAdmissionAverage ?? 'No proporcionado'}</p>
                  )}
                </div>
              </div>
              <hr />

              {/* Notificaciones */}
              <div className="row">
                <div className="col-sm-4"><p className="mb-0">Recibe correos</p></div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        type="checkbox"
                        name="userAllowEmailNotification"
                        checked={form.userAllowEmailNotification}
                        onChange={handleInputChange}
                        disabled={isSaving}
                      />
                      <label className="form-check-label">Notificaciones por Email</label>
                    </div>
                  ) : (
                    <span className="text-muted mb-0">
                      {user.userAllowEmailNotification ? 'Sí' : 'No'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};