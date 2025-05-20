import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/userService";
import { User } from "../../types/user";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type UserWithActions = User & { onDelete: (user: User) => void; onEdit: (user: User) => void };

const columns: TableColumn<UserWithActions>[] = [
  { key: "user_name", label: "Nombre" },
  { key: "user_lastname", label: "Apellido" },
  { key: "user_email", label: "Correo" },
  { key: "user_phone_number", label: "Teléfono" },
  { key: "user_role", label: "Rol" },
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
    getAllUsers()
      .then(setUsers)
      .catch(() => toast.error("Error al cargar usuarios"))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${user.user_name}?`)) return;
    try {
      await deleteUser(user.user_id!);
      toast.success("Usuario eliminado correctamente");
      cargarUsuarios();
    } catch {
      toast.error("Error al eliminar usuario");
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/usuarios/edit/${user.user_id}`);
  };

  const usersWithActions: UserWithActions[] = users.map(u => ({
    ...u,
    onDelete: handleDelete,
    onEdit: handleEdit,
  }));

  return (
    <div className="container mt-4">
      <h2>Lista de Usuarios</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table columns={columns} data={usersWithActions} />
      )}
    </div>
  );
};

export default UserListPage;