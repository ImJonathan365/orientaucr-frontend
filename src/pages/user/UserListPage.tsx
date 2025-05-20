import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUser } from "../../services/userService";
import { User } from "../../types/user";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { toast } from "react-toastify";

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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});

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
    setEditingUser(user);
    setForm(user);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateUser({ ...editingUser, ...form } as User);
      toast.success("Usuario actualizado correctamente");
      setEditingUser(null);
      cargarUsuarios();
    } catch {
      toast.error("Error al actualizar usuario");
    }
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


      {editingUser && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEditingUser(null)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    className="form-control"
                    name="user_name"
                    value={form.user_name || ""}
                    onChange={handleFormChange}
                    placeholder="Nombre"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    className="form-control"
                    name="user_lastname"
                    value={form.user_lastname || ""}
                    onChange={handleFormChange}
                    placeholder="Apellido"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    className="form-control"
                    name="user_email"
                    value={form.user_email || ""}
                    onChange={handleFormChange}
                    placeholder="Correo"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    className="form-control"
                    name="user_phone_number"
                    value={form.user_phone_number || ""}
                    onChange={handleFormChange}
                    placeholder="Teléfono"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;