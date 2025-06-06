import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Roles } from "../../types/rolesType";

/*
import { Permissions } from "../../types/permissionType";
import { getRolesById, updateRoles } from "../../services/RolesService";
import { getAllPermissions } from "../../services/RolesService";
import { Title } from "../../components/atoms/Title/Ttile";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";
import Swal from "sweetalert2";
export const RolesEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [Roles, setRoles] = useState<Roles | null>(null);
  const [loading, setLoading] = useState(true);
  const [Permissions, setPermissions] = useState<Permissions[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [RolesData, allPemissions] = await Promise.all([
          getRolesById(id!),
          getAllPermissions(),
        ]);
        setRoles(RolesData);
        setPermissions(allPemissions);
      } catch {
        setRoles(null);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!Roles) return;
    const { name, value } = e.target;
    setRoles({ ...Roles, [name]: value });
  };

  const handleAddPermissions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!Roles) return;
    const selectedPermissionsId = e.target.value;
    const selectedPermissions = Permissions.find(
      (c) => c.permission_id === selectedPermissionsId
    );
    if (
      selectedPermissions &&
      !Roles.permissions.some((c) => c.permission_id === selectedPermissionsId)
    ) {
      setRoles({
        ...Roles,
        permissions: [...Roles.permissions, selectedPermissions],
      });
    }
  };

  const handleRemovePermissions = async (PermissionId: string) => {
  if (!Roles) return;

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
      ...Roles,
      permissions: Roles.permissions.filter(
        (c) => c.permission_id !== PermissionId
      ),
    });

    Swal.fire("Eliminado", "El permiso fue eliminado.", "success");
  }
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!Roles) return;

  const result = await Swal.fire({
    title: "¿Deseas guardar los cambios?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await updateRoles(Roles);
      Swal.fire("Actualizado", "Rol actualizado correctamente", "success");
      navigate("/roles-list");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al actualizar el rol", "error");
    }
  }
};


  if (loading) {
    return (
      <div className="container py-4">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!Roles) {
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
          <label htmlFor="rol_name" className="form-label">
            Rol
          </label>
          <Input
            type="text"
            className="form-control"
            id="rol_name"
            name="rol_name"
            value={Roles?.rol_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Permissions" className="form-label">
            Agregar permisos
          </label>
          <select
            className="form-select"
            id="Permissions"
            onChange={handleAddPermissions}
            value=""
          >
            <option value="" disabled>
              Seleccione un permiso
            </option>
            {Permissions.filter(
              (c) =>
                !Roles?.permissions.some(
                  (tc) => tc.permission_id === c.permission_id
                )
            ).map((c) => (
              <option key={c.permission_id} value={c.permission_id}>
                {c.permission_name}
              </option>
            ))}
          </select>
        </div>
        <ul className="list-group mb-3">
          {Roles?.permissions.map((c) => (
            <li key={c.permission_id} className="list-group-item">
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <strong>{c.permission_name}</strong>
                <Button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemovePermissions(c.permission_id)}
                >
                  Eliminar
                </Button>
              </div>
              <textarea
                className="form-control"
                value={c.permission_description}
                readOnly
                onClick={() => alert("Los permisos no son editables")}
                style={{ cursor: "not-allowed", backgroundColor: "#f8f9fa" }}
                title="Los permisos no son editables"
              />
            </li>
          ))}
        </ul>

        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};
*/