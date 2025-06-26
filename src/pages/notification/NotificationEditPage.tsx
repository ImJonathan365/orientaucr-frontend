import React, { useEffect, useState } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllEvents } from "../../services/eventService";
import { getNotificationById, updateNotification } from "../../services/notificationService";
import { Notification } from "../../types/Notification";
import { Event } from "../../types/EventTypes";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

export const NotificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<(Notification & { eventId: string }) | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const user: User = await getCurrentUser();
        const hasPermission = user?.userRoles?.some(role =>
          role.permissions?.some(p => p.permissionName === "MODIFICAR NOTIFICACIONES")
        );
        if (!hasPermission) {
          await Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tienes permiso para editar notificaciones.",
          });
          navigate("/notifications", { replace: true });
          return;
        }
      
        const [eventsData, notificationData] = await Promise.all([
          getAllEvents(),
          id ? getNotificationById(id) : Promise.resolve(null)
        ]);
        setEvents(eventsData);
        if (notificationData) {
          const notification = notificationData as Notification;
          setForm({
            ...notification,
            eventId: notification.notificationEvents?.[0]?.event?.eventId || ""
          });
        }
      } catch {
        await Swal.fire("Error", "No se pudo validar tu sesión", "error");
        navigate("/notifications", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "attachments" && "files" in e.target) {
      setFiles((e.target as HTMLInputElement).files);
    } else {
      setForm((prev) => prev ? { ...prev, [name]: value } : prev);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (!form.notificationTitle.trim()) {
      Swal.fire("Error", "El asunto no puede estar vacío ni ser solo espacios.", "warning");
      return;
    }
    if (!form.notificationMessage.trim()) {
      Swal.fire("Error", "El mensaje no puede estar vacío ni ser solo espacios.", "warning");
      return;
    }

    const now = new Date();
    const sendDate = new Date(form.notificationSendDate);
    if (sendDate <= now) {
      Swal.fire("Error", "La fecha y hora de envío debe ser posterior a la actual.", "warning");
      return;
    }
    const notification: Notification = {
      notificationId: form.notificationId,
      notificationTitle: form.notificationTitle.trim(),
      notificationMessage: form.notificationMessage.trim(),
      notificationSendDate: form.notificationSendDate,
      notificationEvents: [
        {
          event: { eventId: form.eventId }
        }
      ]
    };
    const formData = new FormData();
    formData.append("notification", JSON.stringify(notification));
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("attachments", file);
      });
    }
    try {
      await updateNotification(id!, formData);
      await Swal.fire("Éxito", "Notificación actualizada correctamente", "success");
      navigate("/notifications");
    } catch {
      Swal.fire("Error", "No se pudo actualizar la notificación", "error");
    }
  };

  if (loading || !form) return <div className="container py-4">Cargando...</div>;

  return (
    <div className="container py-4">
      <h2>Editar Notificación</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <Input label="Título" name="notificationTitle" value={form.notificationTitle} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <Input label="Mensaje" name="notificationMessage" variant="textarea" value={form.notificationMessage} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <Input label="Fecha de envío" name="notificationSendDate" type="datetime-local" value={form.notificationSendDate} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Evento</label>
          <select className="form-select" name="eventId" value={form.eventId} onChange={handleChange} required>
            <option value="">Seleccione un evento</option>
            {events.map((event) => (
              <option key={event.eventId} value={event.eventId}>
                {event.eventTitle}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Adjuntos</label>
          <input className="form-control" type="file" name="attachments" multiple onChange={handleChange} accept=".pdf,image/*" />
        </div>
        <Button type="submit" variant="primary">Guardar</Button>
        <Button type="button" variant="secondary" className="ms-2" onClick={() => navigate("/notifications")}>Cancelar</Button>
      </form>
    </div>
  );
};