import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../types/rolesType";
import { addRoles, getAllRoles, getAllPermissions } from "../../services/rolesService";
import { Permission } from "../../types/permissionType";
import { Input } from "../../components/atoms/Input/Input";
import { Title } from "../../components/atoms/Title/Ttile";
import { Button } from "../../components/atoms/Button/Button";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

export const RolesAddPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [Roles, setRoles] = useState<Roles>({
    rolId: "",
    rolName: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [Permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      try {
        const user = await getCurrentUser();
        const hasPermission = user?.userRoles?.some(role =>
          role.permissions?.some(p => p.permissionName === "CREAR ROLES")
        );

        if (!hasPermission) {
          await Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tienes permiso para crear roles.",
          });
          navigate("/home", { replace: true });
          return;
        }

        setCurrentUser(user);
      } catch {
        await Swal.fire("Error", "No se pudo validar tu sesión", "error");
        navigate("/home", { replace: true });
      }
    };

    fetchUserAndPermissions();
  }, [navigate]);

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const data = await getAllPermissions();
        setPermissions(data);
      } catch {
        setPermissions([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los permisos",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCharacteristics();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRoles({ ...Roles, [name]: value });
  };

  const handleAddRoles = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPermissionsId = e.target.value;
    const selectedPermissions = Permissions.find(
      (c) => c.permissionId === selectedPermissionsId
    );
    if (selectedPermissions) {
      setRoles({
        ...Roles,
        permissions: [...Roles.permissions, selectedPermissions],
      });
    }
  };

  const handleRemovePemissions = (PermissionId: string) => {
    setRoles({
      ...Roles,
      permissions: Roles.permissions.filter(
        (c) => c.permissionId !== PermissionId
      ),
    });
    Swal.fire({
      icon: "info",
      title: "Permiso eliminado",
      text: "Se eliminó el permiso de la lista.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

   const isValidRolName = (name: string): boolean => {
  const cleaned = name.trim();
  return (
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ_ ]{3,200}$/.test(cleaned) &&
    !/\s{2,}/.test(cleaned)
  );
};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidRolName(Roles.rolName)) {
      Swal.fire({
        icon: "warning",
        title: "Nombre de rol inválido",
        text: "El nombre debe contener solo letras (máx. 3 palabras, sin caracteres especiales y debe tener mínimo 3 a 25 caracteres).",
      });
      return;
    }

    if (!Roles.permissions || Roles.permissions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin permisos asignados",
        text: "El rol debe tener al menos un permiso asignado.",
      });
      return;
    }

    try {
      const existingRoles = await getAllRoles();

      const nameExists = existingRoles.some(
        (role) =>
          role.rolName.toLowerCase() === Roles.rolName.trim().toLowerCase()
      );
      if (nameExists) {
        return Swal.fire({
          icon: "error",
          title: "Nombre duplicado",
          text: "Ya existe un rol con ese nombre. Por favor elija otro.",
        });
      }

      const currentPermissionsIds = Roles.permissions
        .map((p) => p.permissionId)
        .sort();
      const duplicatePermissions = existingRoles.some((role) => {
        const rolePermissionsIds = role.permissions
          .map((p) => p.permissionId)
          .sort();
        if (rolePermissionsIds.length !== currentPermissionsIds.length)
          return false;
        return rolePermissionsIds.every(
          (id, index) => id === currentPermissionsIds[index]
        );
      });

      if (duplicatePermissions) {
        return Swal.fire({
          icon: "error",
          title: "Permisos duplicados",
          text: "Ya existe un rol con el mismo conjunto de permisos.",
        });
      }

      await addRoles(Roles);
      await Swal.fire({
        icon: "success",
        title: "Rol añadido",
        text: "El rol se añadió correctamente.",
        confirmButtonText: "Aceptar",
      });
      navigate("/roles-list");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo añadir el rol.",
      });
    }
  };

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">
        Añadir Rol
      </Title>
      {loading ? (
        <p>Cargando permisos...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="rolName" className="form-label">
              Nombre del Rol
            </label>
            <Input
              type="text"
              className={`form-control ${
                !isValidRolName(Roles.rolName) ? "is-invalid" : ""
              }`}
              id="rolName"
              name="rolName"
              value={Roles?.rolName}
              onChange={handleChange}
            />
            {!isValidRolName(Roles.rolName) && (
              <div className="invalid-feedback">
                El nombre debe tener solo letras, entre 1 y 3 palabras y de 3 a
                25 caracteres.
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="permissions" className="form-label">
              Permisos
            </label>
            <select
              className="form-select"
              id="permissions"
              onChange={handleAddRoles}
              defaultValue=""
            >
              <option value="" disabled>
                Seleccione un permiso
              </option>
              {Permissions.map((p) => (
                <option key={p.permissionId} value={p.permissionId}>
                  {p.permissionName}
                </option>
              ))}
            </select>
          </div>

          <ul className="list-group mb-3">
            {Roles.permissions.map((p) => (
              <li
                key={p.permissionId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {p.permissionName}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemovePemissions(p.permissionId)}
                >
                  Eliminar
                </button>
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
      )}
    </div>
  );
};
