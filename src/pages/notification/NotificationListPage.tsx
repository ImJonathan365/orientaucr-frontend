import React, { useEffect, useState } from "react";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllNotifications, deleteNotification } from "../../services/notificationService";

export interface Notification {
  notificationId: string;
  notificationTitle: string;
  notificationMessage: string;
  notificationSendDate: string;
  sent: boolean;
}

export const NotificationListPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let data = await getAllNotifications();
      data = (data as Notification[]).sort(
        (a, b) => new Date(b.notificationSendDate).getTime() - new Date(a.notificationSendDate).getTime()
      );
      setNotifications(data as Notification[]);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notification: Notification) => {
    navigate(`/notifications/edit/${notification.notificationId}`);
  };

  const handleDelete = async (notification: Notification) => {
    const result = await Swal.fire({
      title: "¿Eliminar notificación?",
      text: `¿Seguro que deseas eliminar la notificación: ${notification.notificationTitle}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await deleteNotification(notification.notificationId);
        await Swal.fire("Eliminado", "La notificación fue eliminada correctamente", "success");
        fetchNotifications();
      } catch {
        Swal.fire("Error", "No se pudo eliminar la notificación", "error");
      }
    }
  };

  const columns: TableColumn<Notification>[] = [
    { key: "notificationTitle", label: "Título" },
    { key: "notificationMessage", label: "Mensaje" },
    {
      key: "notificationSendDate",
      label: "Fecha de envío",
      render: (row) =>
        new Date(row.notificationSendDate).toLocaleString("es-CR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    { key: "sent", label: "¿Enviada?", render: (row) => row.sent ? "Sí" : "No" },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Listado de Notificaciones</h2>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/home")}>
            <Icon variant="home" className="me-2" />
            Volver
          </Button>
          <Button variant="primary" onClick={() => navigate("/notifications/add")}>
            <Icon variant="add" className="me-2" />
            Nueva Notificación
          </Button>
        </div>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table columns={columns} data={notifications} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};