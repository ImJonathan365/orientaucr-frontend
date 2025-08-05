import { useEffect, useState } from "react";
import { getAllRoles, deleteRoles } from "../../services/rolesService";
import { Roles } from "../../types/rolesType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate } from "react-router-dom";
import { Title } from "../../components/atoms/Title/Title";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";

export const RolesListPage = () => {
    const navigate = useNavigate();
    const [Roles, setRoles] = useState<Roles[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const data = await getAllRoles();
                setRoles(data);
            } catch {
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const handleEdit = async (roles: Roles) => {
  const result = await Swal.fire({
    title: "¿Editar rol?",
    text: `¿Deseas editar el rol: ${roles.rolName}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, editar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    navigate(`/roles-list/edit/${roles.rolId}`);
  }
};


  const handleDelete = async (roles: Roles) => {
  if (roles.rolName === "ROL_DEFAULT") {
    Swal.fire(
      "Acción no permitida",
      "El rol ROL_DEFAULT no se puede eliminar.",
      "warning"
    );
    return; // Salimos de la función sin continuar
  }

  const result = await Swal.fire({
    title: "¿Eliminar rol?",
    text: `¿Seguro que deseas eliminar el rol: ${roles.rolName}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await deleteRoles(roles.rolId);
      setRoles(Roles.filter((t) => t.rolId !== roles.rolId));
      Swal.fire("Eliminado", "El rol fue eliminado correctamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar el rol", "error");
    }
  }
};


 const columns: TableColumn<Roles>[] = [
    {
        key: "rolName",
        label: "Rol",
        render: (row) => row.rolName,
    },
    {
        key: "permissions",
        label: "Permisos",
        render: (row) => {
            return (
                <select className="form-select">
                    {row.permissions.some((c) => c.permissionName === "") ? (
                        <option disabled>No tiene permisos asignados</option>
                    ) : (
                        row.permissions.map((c) => (
                            <option key={c.permissionId}>{c.permissionName}</option>
                        ))
                    )}
                </select>
            );
        },
    },
];


    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mt-4">
                <Title variant="h2" className="mb-4">Listado de roles</Title>
                <div className="d-flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => navigate('/home')}
                          >
                            <Icon variant="home" className="me-2" />
                            Regresar
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => navigate('/roles-list/add')}
                          >
                            <Icon variant="add" className="me-2" />
                            Nuevo Rol
                          </Button>
                        </div>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Table
                    columns={columns}
                    data={Roles}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};