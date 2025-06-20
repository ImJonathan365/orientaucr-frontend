import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, deleteUser, getUserProfileImage } from "../../services/userService";
import { User } from "../../types/userType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useUser } from "../../contexts/UserContext";
import { DateTime } from "luxon";
import Swal from "sweetalert2";

type UserWithActions = User & { onDelete: (user: User) => void; onEdit: (user: User) => void };

const UserListPage: React.FC = () => {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUniquePermissions = (user: User) => {
    if (!user.userRoles) return [];
    const allPermissions = user.userRoles.flatMap(role => role.permissions || []);
    const unique = Array.from(new Set(allPermissions.map(p => p.permissionName)));
    return unique;
  };

  const handleShowProfilePicture = async (user: User) => {
    if (!user.userProfilePicture) {
      Swal.fire({
        icon: "info",
        title: "Sin foto de perfil",
        text: "Este usuario no tiene foto de perfil.",
      });
      return;
    }
    const imageUrl = await getUserProfileImage(user.userProfilePicture);
    if (imageUrl) {
      Swal.fire({
        title: "Foto de perfil",
        html: `<img src="${imageUrl}" alt="Foto de perfil" style="max-width: 100%; max-height: 300px;" />`,
        showCloseButton: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la foto de perfil.",
      });
    }
  };

  const columns: TableColumn<UserWithActions>[] = [
    { key: "userName", label: "Nombre" },
    { key: "userLastname", label: "Apellido" },
    { key: "userEmail", label: "Correo" },
    {
      key: "userBirthdate",
      label: "Fecha de nacimiento",
      render: (row) =>
        row.userBirthdate
          ? DateTime.fromISO(row.userBirthdate, { zone: "America/Costa_Rica" }).toFormat("dd/MM/yyyy")
          : "No especificada"
    }, { key: "userDiversifiedAverage", label: "Promedio de Educación Diversificada" },
    {
      key: "userAllowEmailNotification",
      label: "Permite notificaciones",
      render: (row) => row.userAllowEmailNotification ? "Sí" : "No"
    },
    {
      key: "userProfilePicture",
      label: "Foto de perfil",
      render: (row) => (
        <Button
          variant="info"
          size="small"
          onClick={() => handleShowProfilePicture(row)}
        >
          Ver foto
        </Button>
      )
    },
    {
      key: "permissions",
      label: "Permisos",
      render: (row) => (
        <select className="form-select">
          {getUniquePermissions(row).length > 0 ? (
            getUniquePermissions(row).map((perm, idx) => (
              <option key={idx}>{perm}</option>
            ))
          ) : (
            <option>Sin permisos</option>
          )}
        </select>
      )
    }
  ];

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

  const handleEdit = async (user: User) => {
    const result = await Swal.fire({
      title: `¿Seguro que deseas editar a ${user.userName}?`,
      text: "Podrás modificar los datos de este usuario.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      navigate(`/users/edit/${user.userId}`);
    }
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