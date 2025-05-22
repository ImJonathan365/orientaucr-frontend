import { useEffect, useState } from "react";
import { getAllRoles, deleteRoles } from "../../services/RolesService";
import { Roles } from "../../types/rolesType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate, Link } from "react-router-dom";
import { Title } from "../../components/atoms/Title/Ttile";
import Swal from "sweetalert2";

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
    text: `¿Deseas editar el rol: ${roles.rol_name}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, editar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    navigate(`/roles-list/edit/${roles.rol_id}`);
  }
};


  const handleDelete = async (roles: Roles) => {
  const result = await Swal.fire({
    title: "¿Eliminar rol?",
    text: `¿Seguro que deseas eliminar el rol: ${roles.rol_name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await deleteRoles(roles.rol_id);
      setRoles(Roles.filter((t) => t.rol_id !== roles.rol_id));
      Swal.fire("Eliminado", "El rol fue eliminado correctamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar el rol", "error");
    }
  }
};


 const columns: TableColumn<Roles>[] = [
    {
        key: "rol_name",
        label: "Rol",
        render: (row) => row.rol_name,
    },
    {
        key: "permissions",
        label: "Permisos",
        render: (row) => {
            return (
                <select className="form-select">
                    {row.permissions.some((c) => c.permission_name === "") ? (
                        <option disabled>No tiene permisos asignados</option>
                    ) : (
                        row.permissions.map((c) => (
                            <option key={c.permission_id}>{c.permission_name}</option>
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
                <Title variant="h2" className="mb-4">roles</Title>
                <Link to="/roles-list/add" className="btn btn-primary mb-4">
                    Añadir Rol
                </Link>
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