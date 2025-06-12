import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/userService";
import { User } from "../../types/userType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../../utils/Auth";

type UserWithActions = User & { onDelete: (user: User) => void; onEdit: (user: User) => void };

const columns: TableColumn<UserWithActions>[] = [
  { key: "userName", label: "Nombre" },
  { key: "userLastname", label: "Apellido" },
  { key: "userEmail", label: "Correo" },
  { key: "userBirthdate", label: "Fecha de nacimiento" },
  { key: "userAdmissionAverage", label: "Promedio de admisión" },
  {
    key: "rolName",
    label: "Rol",
    render: (row) =>
      row.userRoles && row.userRoles.length > 0
        ? row.userRoles.map(r => r.rolName).join(", ")
        : "Sin rol"
  },
  {
    key: "acciones",
    label: "Acciones",
    render: (row) => (
      <>
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => row.onEdit(row)}
        >
          Editar
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => row.onDelete(row)}
        >
          Eliminar
        </button>
      </>
    ),
  },
];

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    setLoading(true);
    getAllUsers(getUserFromLocalStorage()?.userId || "")
      .then(setUsers)
      .catch(() => toast.error("Error al cargar usuarios"))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${user.userName}?`)) return;
    try {
      await deleteUser(user.userId!);
      toast.success("Usuario eliminado correctamente");
      cargarUsuarios();
    } catch {
      toast.error("Error al eliminar usuario");
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/usuarios/edit/${user.userId}`);
  };

  const handleCreate = () => {
    navigate("/usuarios/crear");
  };

  const usersWithActions: UserWithActions[] = users.map(u => ({
    ...u,
    onDelete: handleDelete,
    onEdit: handleEdit,
  }));

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Usuarios</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          Crear Usuario
        </button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table columns={columns} data={usersWithActions} />
      )}
    </div>
  );
};

export default UserListPage;