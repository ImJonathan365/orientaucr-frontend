import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/userType";
import { Roles } from "../../types/rolesType";
import { getAllRoles } from "../../services/rolesService";
import { addUser } from "../../services/userService";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { validateUserForm } from "../../validations/userFormValidation";
import { validateProfileImage } from "../../validations/profileImageValidation";
import Swal from "sweetalert2";

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Roles[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
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

  useEffect(() => {
    getAllRoles().then(setRoles);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
      return;
    }
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

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedRoleIds.includes(value)) {
      setSelectedRoleIds(prev => [...prev, value]);
    }
  };

  const handleRemoveRole = (rolId: string) => {
    setSelectedRoleIds(prev => prev.filter(id => id !== rolId));
  };

  const handleShowPermissions = (rolId: string) => {
    const role = roles.find(r => r.rolId === rolId);
    if (role) {
      const perms = role.permissions.map(p => p.permissionName).join(' - ');
      Swal.fire({
        title: `Permisos de ${role.rolName}`,
        text: perms || "Sin permisos",
        icon: "info",
        confirmButtonText: "Cerrar"
      });
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validation = validateUserForm({
      userName: form.userName,
      userLastname: form.userLastname,
      userEmail: form.userEmail,
      userBirthdate: form.userBirthdate,
      userPassword: form.userPassword,
      userDiversifiedAverage: form.userDiversifiedAverage,
    }, false);
    if (!validation.valid) {
      await Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: validation.message,
        confirmButtonText: "Aceptar"
      });
      setIsLoading(false);
      return;
    }
    if (form.userPassword !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        confirmButtonText: "Aceptar"
      });
      setIsLoading(false);
      return;
    }
    try {
      const selectedRoles = roles.filter(r => selectedRoleIds.includes(r.rolId));
      const user: User = {
        userName: form.userName,
        userLastname: form.userLastname,
        userEmail: form.userEmail,
        userBirthdate: form.userBirthdate,
        userPassword: form.userPassword,
        userDiversifiedAverage: form.userDiversifiedAverage === "" ? null : Number(form.userDiversifiedAverage.replace(",", ".")),
        userAllowEmailNotification: form.userAllowEmailNotification,
        userProfilePicture: "",
        userRoles: selectedRoles.map(role => ({
          rolId: role.rolId,
          rolName: role.rolName,
          permissions: role.permissions
        }))
      };

      await addUser(user, imageFile || undefined);
      await Swal.fire({
        icon: "success",
        title: "Usuario creado correctamente",
        confirmButtonText: "Aceptar"
      });
      navigate('/users');
    } catch (err: any) {
      const backendMsg = err.response?.data || err.message || "Error al actualizar usuario";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMsg,
        confirmButtonText: "Aceptar"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow" style={{ maxWidth: "50%", width: "100%" }}>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <Button
              variant="secondary"
              className="me-2 position-absolute"
              onClick={() => navigate('/users')}
            >
              <Icon variant="arrow-left" className="me-1" />
              Volver
            </Button>
            <h2 className="mb-0 flex-grow-1 text-center w-100">Nuevo Usuario</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-center">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Foto de perfil"
                  className="mb-2"
                  style={{
                    width: 128,
                    height: 128,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #ccc",
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
                    background: "#eee",
                  }}
                >
                  <Icon variant="user" size="xl" color="#888" />
                </span>
              )}
              <div>
                <input
                  type="file"
                  className="form-control mt-2 shadow-sm rounded-3"
                  style={{ maxWidth: 300, margin: "0 auto" }}
                  name="userProfilePicture"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Nombre</label>
              <input
                type="text"
                className="form-control shadow-sm rounded-3"
                name="userName"
                value={form.userName}
                onChange={handleChange}
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
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Contraseña</label>
              <input
                type="password"
                className="form-control shadow-sm rounded-3"
                name="userPassword"
                value={form.userPassword}
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control shadow-sm rounded-3"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="********"
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
              />
              <label className="form-check-label fw-semibold" htmlFor="userAllowEmailNotification">
                Permitir notificaciones por correo
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold mb-1">Agregar rol</label>
              <select
                className="form-select shadow-sm rounded-3"
                onChange={handleRoleSelect}
                value=""
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                {roles
                  .filter(role => !selectedRoleIds.includes(role.rolId))
                  .map(role => (
                    <option key={role.rolId} value={role.rolId}>
                      {role.rolName}
                    </option>
                  ))}
              </select>
            </div>
            {selectedRoleIds.length > 0 && (
              <div className="mb-3">
                <label className="form-label fw-semibold mb-1">Roles seleccionados:</label>
                <ul className="list-group mb-3">
                  {selectedRoleIds.map(rolId => {
                    const role = roles.find(r => r.rolId === rolId);
                    return (
                      <li key={rolId} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{role?.rolName || rolId}</span>
                        <div>
                          <Button
                            type="button"
                            variant="info"
                            className="me-2"
                            onClick={() => handleShowPermissions(rolId)}
                          >
                            Ver permisos
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => handleRemoveRole(rolId)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="d-flex gap-2 justify-content-end">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/users')}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}