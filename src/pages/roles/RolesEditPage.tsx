import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Roles } from "../../types/rolesType";
import { Permission } from "../../types/permissionType";
import {
  getRolesById,
  updateRoles,
  getAllRoles,
  getAllPermissions,
} from "../../services/rolesService";
import { Title } from "../../components/atoms/Title/Ttile";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";

export const RolesEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [roles, setRoles] = useState<Roles | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        await Swal.fire({
          title: "Error",
          text: "No se proporcionó ID de rol",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        navigate("/roles-list");
        return;
      }

      try {
        const [roleData, allPermissions] = await Promise.all([
          getRolesById(id),
          getAllPermissions(),
        ]);

        if (!roleData || !roleData.rolId) {
          await Swal.fire({
            title: "No encontrado",
            text: "No se pudo encontrar el rol solicitado.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          navigate("/roles-list");
          return;
        }

        setRoles(roleData);
        setPermissions(allPermissions);
      } catch {
        await Swal.fire({
          title: "Error",
          text: "No se pudo encontrar el rol solicitado.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        navigate("/roles-list");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!roles) return;
    const { name, value } = e.target;
    setRoles({ ...roles, [name]: value });
  };

  const handleAddPermission = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!roles) return;
    const selectedId = e.target.value;
    const selected = permissions.find((p) => p.permissionId === selectedId);

    if (
      selected &&
      !roles.permissions.some((p) => p.permissionId === selectedId)
    ) {
      setRoles({
        ...roles,
        permissions: [...roles.permissions, selected],
      });
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    if (!roles) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Este permiso será eliminado del rol.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setRoles({
        ...roles,
        permissions: roles.permissions.filter(
          (p) => p.permissionId !== permissionId
        ),
      });

      Swal.fire("Eliminado", "El permiso fue eliminado.", "success");
    }
  };

  const isValidRolName = (name: string): boolean => {
    const words = name.trim().split(/\s+/);
    if (words.length < 1 || words.length > 3) return false;
    return words.every((word) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ_]{3,25}$/.test(word));
  };

  const isDuplicateName = async (
    name: string,
    currentId: string
  ): Promise<boolean> => {
    const existingRoles = await getAllRoles();
    return existingRoles.some(
      (role) =>
        role.rolId !== currentId &&
        role.rolName.trim().toLowerCase() === name.trim().toLowerCase()
    );
  };

  const isDuplicatePermissions = async (
    currentRole: Roles
  ): Promise<boolean> => {
    const existingRoles = await getAllRoles();
    const currentIds = currentRole.permissions
      .map((p) => p.permissionId)
      .sort();
    return existingRoles.some((role) => {
      if (role.rolId === currentRole.rolId) return false;
      const roleIds = role.permissions.map((p) => p.permissionId).sort();
      return JSON.stringify(currentIds) === JSON.stringify(roleIds);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roles) return;

    if (!isValidRolName(roles.rolName)) {
      Swal.fire({
        icon: "warning",
        title: "Nombre de rol inválido",
        text: "El nombre debe contener solo letras (máx. 3 palabras, sin caracteres especiales).",
      });
      return;
    }

    if (!roles.permissions || roles.permissions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin permisos asignados",
        text: "El rol debe tener al menos un permiso asignado.",
      });
      return;
    }

    try {
      const nameExists = await isDuplicateName(roles.rolName, roles.rolId);
      if (nameExists) {
        Swal.fire({
          icon: "error",
          title: "Nombre duplicado",
          text: "Ya existe un rol con ese nombre.",
        });
        return;
      }

      const permissionsExist = await isDuplicatePermissions(roles);
      if (permissionsExist) {
        Swal.fire({
          icon: "error",
          title: "Permisos duplicados",
          text: "Ya existe un rol con el mismo conjunto de permisos.",
        });
        return;
      }

      const result = await Swal.fire({
        title: "¿Deseas guardar los cambios?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await updateRoles(roles);
        Swal.fire("Actualizado", "Rol actualizado correctamente", "success");
        navigate("/roles-list");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Hubo un problema al validar o actualizar el rol",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!roles) {
    return (
      <div className="container py-4">
        <p>No se encontró el rol.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">
        Editar Rol
      </Title>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="rolName" className="form-label">
            Rol
          </label>
          <Input
            type="text"
            className={`form-control ${
              !isValidRolName(roles.rolName) ? "is-invalid" : ""
            }`}
            id="rolName"
            name="rolName"
            value={roles.rolName}
            onChange={handleChange}
          />
          {!isValidRolName(roles.rolName) && (
            <div className="invalid-feedback">
              El nombre debe tener solo letras, entre 1 y 3 palabras y de 3 a 20
              caracteres.
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="Permissions" className="form-label">
            Agregar permisos
          </label>
          <select
            className="form-select"
            id="Permissions"
            onChange={handleAddPermission}
            value=""
          >
            <option value="" disabled>
              Seleccione un permiso
            </option>
            {permissions
              .filter(
                (p) =>
                  !roles.permissions.some(
                    (rp) => rp.permissionId === p.permissionId
                  )
              )
              .map((p) => (
                <option key={p.permissionId} value={p.permissionId}>
                  {p.permissionName}
                </option>
              ))}
          </select>
        </div>

        <ul className="list-group mb-3">
          {roles.permissions.map((p) => (
            <li key={p.permissionId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{p.permissionName}</strong>
                <Button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemovePermission(p.permissionId)}
                >
                  Eliminar
                </Button>
              </div>
              <textarea
                className="form-control"
                value={p.permissionDescription}
                readOnly
                onClick={() =>
                  Swal.fire({
                    icon: "info",
                    title: "Permiso no editable",
                    text: "Los permisos no son editables.",
                    confirmButtonText: "Entendido",
                  })
                }
                style={{ cursor: "not-allowed", backgroundColor: "#f8f9fa" }}
                title="Los permisos no son editables"
              />
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/roles-list")}
          >
            <i className="bi bi-x me-2"></i>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            <i className="bi bi-check me-2"></i>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
