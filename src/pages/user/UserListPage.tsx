import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, deleteUser } from "../../services/userService";
import { User } from "../../types/userType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useUser } from "../../contexts/UserContext";

type UserWithActions = User & { onDelete: (user: User) => void; onEdit: (user: User) => void };

const columns: TableColumn<UserWithActions>[] = [
  { key: "userName", label: "Nombre" },
  { key: "userLastname", label: "Apellido" },
  { key: "userEmail", label: "Correo" },
  { key: "userBirthdate", label: "Fecha de nacimiento" },
  { key: "userAdmissionAverage", label: "Promedio de admisión" },
  {
    key: "userRoles",
    label: "Roles",
    render: (row) => (
      <select className="form-select" >
        {row.userRoles && row.userRoles.length > 0 ? (
          row.userRoles.map((r, idx) => (
            <option key={r.rolId || idx}>{r.rolName}</option>
          ))
        ) : (
          <option>Sin roles</option>
        )}
      </select>
    )
  }
];

const UserListPage: React.FC = () => {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      if (currentUser?.userId) {
        const usersList = await getAllUsers(currentUser.userId);
        setUsers(usersList);
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar usuarios",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: `¿Seguro que deseas eliminar a ${user.userName}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteUser(user.userId!);
      await cargarUsuarios();
      await Swal.fire({
        icon: "success",
        title: "Usuario eliminado correctamente",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar usuario",
      });
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/users/edit/${user.userId}`);
  };

  const handleCreate = () => {
    navigate("/users/add");
  };

  const handleBack = () => {
    navigate("/home");
  };

  const usersWithActions: UserWithActions[] = users.map(u => ({
    ...u,
    onDelete: handleDelete,
    onEdit: handleEdit,
  }));

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            variant="secondary"
            onClick={handleBack}
          >
            <Icon variant="home" className="me-2" />
            Regresar
          </Button>
          <h2>Lista de Usuarios</h2>
          <Button className="btn btn-primary" onClick={handleCreate}>
            <Icon variant="add" className="me-2" />
            Nuevo Usuario
          </Button>
        </div>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table
            columns={columns}
            data={usersWithActions}
            onEdit={handleEdit}
            onDelete={handleDelete} />
        )}
      </div>
    </>
  );
};

export default UserListPage;