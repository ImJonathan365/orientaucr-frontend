import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { updateUser, getUserProfileImage } from "../../services/userService";
import { validateUserForm } from "../../validations/userFormValidation";
import { validateProfileImage } from "../../validations/profileImageValidation";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useNavigate } from "react-router-dom";

export const UserProfileEdit = () => {
  const { user: currentUser, refreshUser } = useUser();
  const [form, setForm] = useState({
    userName: "",
    userLastname: "",
    userEmail: "",
    userBirthdate: "",
    userPassword: "",
    userDiversifiedAverage: "",
    userAllowEmailNotification: true,
    userProfilePicture: "",
  });
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setForm({
        userName: currentUser.userName || "",
        userLastname: currentUser.userLastname || "",
        userEmail: currentUser.userEmail || "",
        userBirthdate: currentUser.userBirthdate || "",
        userPassword: "",
        userDiversifiedAverage: currentUser.userDiversifiedAverage?.toString() || "",
        userAllowEmailNotification: currentUser.userAllowEmailNotification ?? true,
        userProfilePicture: currentUser.userProfilePicture || "",
      });
      if (currentUser.userProfilePicture) {
        getUserProfileImage(currentUser.userProfilePicture).then(setProfileImageUrl);
      } else {
        setProfileImageUrl(null);
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === "userDiversifiedAverage") {
      let filteredValue = value.replace(/[^0-9.,]/g, '');
      const firstSeparatorMatch = filteredValue.match(/[.,]/);
      if (firstSeparatorMatch) {
        const separator = firstSeparatorMatch[0];
        const [intPart, ...rest] = filteredValue.split(separator);
        filteredValue = intPart + (rest.length > 0 ? separator + rest.join('').replace(/[.,]/g, '') : '');
      }
      setForm(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validation = await validateProfileImage(file);
      if (!validation.valid) {
        Swal.fire({
          icon: "error",
          title: "Archivo no válido",
          text: validation.message,
          confirmButtonText: "Aceptar"
        });
        e.target.value = "";
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const changedFields: Record<string, string | boolean> = {};
    Object.keys(form).forEach(key => {
      if (
        key === "userPassword"
          ? form.userPassword
          : form[key as keyof typeof form] !== (currentUser as any)[key]
      ) {
        changedFields[key as keyof typeof form] = form[key as keyof typeof form];
      }
    });

    if (
      Object.keys(changedFields).length === 0 &&
      !imageFile
    ) {
      Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No has realizado ningún cambio.",
        confirmButtonText: "Aceptar"
      });
      setIsSaving(false);
      return;
    }
    if (changedFields.userName || changedFields.userLastname || changedFields.userEmail ||
      changedFields.userBirthdate || changedFields.userPassword || changedFields.userDiversifiedAverage) {
      const validation = validateUserForm(
        {
          userName: form.userName,
          userLastname: form.userLastname,
          userEmail: form.userEmail,
          userBirthdate: form.userBirthdate,
          userPassword: form.userPassword,
          userDiversifiedAverage: form.userDiversifiedAverage,
        },
        true
      );
      if (!validation.valid) {
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: validation.message,
          confirmButtonText: "Aceptar"
        });
        setIsSaving(false);
        return;
      }
    }
    try {
      const updatedUser = {
        ...currentUser,
        userName: form.userName,
        userLastname: form.userLastname,
        userEmail: form.userEmail,
        userBirthdate: form.userBirthdate,
        userPassword: form.userPassword ? form.userPassword : "",
        userDiversifiedAverage: form.userDiversifiedAverage === "" ? null : Number(form.userDiversifiedAverage.replace(",", ".")),
        userAllowEmailNotification: form.userAllowEmailNotification,
        userProfilePicture: currentUser.userProfilePicture,
      };
      await updateUser(updatedUser, imageFile || undefined);
      await refreshUser();
      Swal.fire({
        icon: "success",
        title: "Perfil actualizado correctamente",
        confirmButtonText: "Aceptar"
      });
      navigate("/profile");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Error al actualizar el perfil",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow" style={{ maxWidth: "50%", width: "100%" }}>
        <div className="card-body">
          <h2 className="mb-4 text-center">Editar Perfil</h2>
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
                  border: "2px solid #ccc",
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                title="Haz clic para cambiar la foto de perfil"
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
                  background: "#eee",
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                title="Haz clic para cambiar la foto de perfil"
              >
                <Icon variant="user" size="xl" color="#888" />
              </span>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif, image/webp"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isSaving}
            />
            <small className="text-muted d-block mb-2">Haz clic en la imagen para cambiarla</small>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Nombre</label>
              <input
                type="text"
                className="form-control shadow-sm rounded-3"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Ejm: Juan"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Apellido</label>
              <input
                type="text"
                className="form-control shadow-sm rounded-3"
                name="userLastname"
                value={form.userLastname}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Ejm: Pérez"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Correo electrónico</label>
              <input
                type="email"
                className="form-control shadow-sm rounded-3"
                name="userEmail"
                value={form.userEmail}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-control shadow-sm rounded-3"
                name="userBirthdate"
                value={form.userBirthdate}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Contraseña (dejar en blanco para no cambiarla)</label>
              <input
                type="password"
                className="form-control shadow-sm rounded-3"
                name="userPassword"
                value={form.userPassword}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Nueva contraseña"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Promedio de Educación Diversificada</label>
              <input
                type="text"
                className="form-control shadow-sm rounded-3"
                name="userDiversifiedAverage"
                value={form.userDiversifiedAverage ?? ""}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Ej: 85.50"
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="userAllowEmailNotification"
                name="userAllowEmailNotification"
                checked={form.userAllowEmailNotification}
                onChange={handleChange}
                disabled={isSaving}
              />
              <label className="form-check-label fw-semibold" htmlFor="userAllowEmailNotification">
                Permitir notificaciones por correo
              </label>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSaving}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};