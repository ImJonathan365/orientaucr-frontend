import React, { useEffect, useState } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllEvents } from "../../services/eventService";
import { getNotificationById, updateNotification } from "../../services/notificationService";

export const NotificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllEvents().then(setEvents);
    if (id) {
      getNotificationById(id).then((data) => {
        if (
          data &&
          typeof data === "object" &&
          "notificationEvents" in data &&
          Array.isArray((data as any).notificationEvents)
        ) {
          setForm({
            ...data,
            eventId: (data as any).notificationEvents?.[0]?.event?.eventId || ""
          });
        } else {
          setForm({
            eventId: ""
          });
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (form?.sent) {
      Swal.fire("No permitido", "No se puede editar una notificación ya enviada.", "info");
      navigate("/notifications");
    }
  }, [form, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files: inputFiles } = e.target as any;
    if (name === "attachments") {
      setFiles(inputFiles);
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    // Validación de fecha futura
    const now = new Date();
    const sendDate = new Date(form.notificationSendDate);
    if (sendDate <= now) {
      Swal.fire("Error", "La fecha y hora de envío debe ser posterior a la actual.", "warning");
      return;
    }
    const notification = {
      notificationId: form.notificationId,
      notificationTitle: form.notificationTitle,
      notificationMessage: form.notificationMessage,
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

  if (!form) return <div className="container py-4">Cargando...</div>;

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