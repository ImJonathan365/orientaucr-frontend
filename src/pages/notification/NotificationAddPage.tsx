import React, { useEffect, useState } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllEvents } from "../../services/eventService";
import { createNotification } from "../../services/notificationService";
import { Notification } from "../../types/Notification";
import { Event } from "../../types/EventTypes";

export const NotificationAddPage = () => {
  const [form, setForm] = useState<Omit<Notification, "notificationId" | "attachments"> & { eventId: string }>({
    notificationTitle: "",
    notificationMessage: "",
    notificationSendDate: "",
    notificationEvents: [],
    eventId: "",
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllEvents().then(setEvents);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "file" && "files" in e.target) {
      const inputFiles = (e.target as HTMLInputElement).files;
      const file = inputFiles && inputFiles.length > 0 ? inputFiles[0] : null;
      if (file && file.size > 200 * 1024 * 1024) {
        Swal.fire("Error", "El archivo no puede superar los 200 MB.", "warning");
        (e.target as HTMLInputElement).value = "";
        setFile(null);
        return;
      }
      setFile(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const sendDateLocal = new Date(form.notificationSendDate);

    if (sendDateLocal <= now) {
      Swal.fire("Error", "La fecha y hora de envío debe ser posterior a la actual.", "warning");
      return;
    }

    // Convertir la fecha local a UTC ISO string
    const notificationSendDateUTC = sendDateLocal.toISOString();

    const notification: Omit<Notification, "notificationId" | "attachments"> = {
      notificationTitle: form.notificationTitle,
      notificationMessage: form.notificationMessage,
      notificationSendDate: notificationSendDateUTC,
      notificationEvents: [
        {
          event: { eventId: form.eventId }
        }
      ]
    };
    const formData = new FormData();
    formData.append("notification", JSON.stringify(notification));
    if (file) {
      formData.append("file", file);
    }
    try {
      await createNotification(formData);
      await Swal.fire("Éxito", "Notificación creada correctamente", "success");
      navigate("/notifications");
    } catch {
      Swal.fire("Error", "No se pudo crear la notificación", "error");
    }
  };

  return (
    <div className="container py-4">
      <h2>Nueva Notificación</h2>
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
          <label className="form-label">Adjunto</label>
          <input className="form-control" type="file" name="file" onChange={handleChange} accept=".pdf,image/*" />
        </div>
        <div className="d-flex gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate("/notifications")}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Button>
          <Button type="submit" variant="primary">Guardar</Button>
        </div>
      </form>
    </div>
  );
};