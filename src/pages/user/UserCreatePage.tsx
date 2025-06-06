import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/userType";
import { Roles } from "../../types/rolesType";
import { Permission } from "../../types/permissionType";
import { getAllRoles } from "../../services/rolesService";
import { Alert } from "react-bootstrap";
import { addUser } from "../../services/userService";

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Roles[]>([]);
  const [roleId, setRoleId] = useState<string>("");
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form, setForm] = useState<User>({
    userName: "",
    userLastname: "",
    userEmail: "",
    userBirthdate: "",
    userPassword: "",
    userAdmissionAverage: null,
    userAllowEmailNotification: true,
    userProfilePicture: "",
    userRoles: []
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllRoles().then(setRoles);
  }, []);

  useEffect(() => {
    if (roleId) {
      const role = roles.find(r => r.rolId === roleId);
      setRolePermissions(role?.permissions || []);
      setSelectedPermissions(role?.permissions?.map(p => p.permissionId) || []);
      setForm(prev => ({
        ...prev,
        userRoles: [
          {
            ...role!,
            permissions: role?.permissions || []
          }
        ]
      }));
    } else {
      setRolePermissions([]);
      setSelectedPermissions([]);
      setForm(prev => ({
        ...prev,
        userRoles: []
      }));
    }
    // eslint-disable-next-line
  }, [roleId, roles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === "number") val = value === "" ? null : Number(value);
    if (type === "checkbox") val = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handlePermissionChange = (permId: string, checked: boolean) => {
    setSelectedPermissions(prev =>
      checked ? [...prev, permId] : prev.filter(id => id !== permId)
    );
    setForm(prev => ({
      ...prev,
      userRoles: prev.userRoles && prev.userRoles.length > 0
        ? [
            {
              ...prev.userRoles[0],
              permissions: checked
                ? [...(prev.userRoles[0].permissions || []), rolePermissions.find(p => p.permissionId === permId)!]
                : (prev.userRoles[0].permissions || []).filter(p => p.permissionId !== permId)
            }
          ]
        : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      // El objeto user ya tiene el arreglo de roles y permisos correcto
      await addUser(form);
      navigate('/usuarios');
    } catch (err: any) {
      setError(err.message || "Error al crear usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Nuevo Usuario</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className="form-control" name="userName" value={form.userName} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input className="form-control" name="userLastname" value={form.userLastname} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input className="form-control" name="userEmail" value={form.userEmail} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input className="form-control" name="userBirthdate" type="date" value={form.userBirthdate ?? ""} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input className="form-control" name="userPassword" type="password" value={form.userPassword} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Promedio de admisión</label>
          <input className="form-control" name="userAdmissionAverage" type="number" value={form.userAdmissionAverage ?? ""} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Permitir notificaciones por correo</label>
          <select className="form-select" name="userAllowEmailNotification" value={form.userAllowEmailNotification ? "true" : "false"} onChange={e => setForm(prev => ({ ...prev, userAllowEmailNotification: e.target.value === "true" }))}>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select className="form-select" name="roleId" value={roleId} onChange={e => setRoleId(e.target.value)} required>
            <option value="">Seleccione un rol</option>
            {roles.map(role => (
              <option key={role.rolId} value={role.rolId}>
                {role.rolName}
              </option>
            ))}
          </select>
        </div>
        {rolePermissions.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Permisos</label>
            <div>
              {rolePermissions.map(perm => (
                <div key={perm.permissionId} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={perm.permissionId}
                    checked={selectedPermissions.includes(perm.permissionId)}
                    onChange={e => handlePermissionChange(perm.permissionId, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={perm.permissionId}>
                    {perm.permissionName}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
        <button className="btn btn-secondary ms-2" type="button" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};