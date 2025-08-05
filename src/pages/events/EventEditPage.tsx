import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getEventById, updateEvent } from "../../services/eventService";
import { getAllCampus } from "../../services/campusService";
import { getAllSubcampus } from "../../services/subcampusService";
import { getCurrentUser } from "../../services/userService";
import { Event } from "../../types/EventTypes";
import { Campus } from "../../types/campusType";
import { Subcampus } from "../../types/subcampusType";
import { User } from "../../types/userType";
import { Title } from "../../components/atoms/Title/Title";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";

export const EventsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

const getTodayInCostaRica = (): string => {
    const formatter = new Intl.DateTimeFormat("es-CR", {
      timeZone: "America/Costa_Rica",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    return `${year}-${month}-${day}`;
  };

  const getCostaRicaCurrentTotalMinutes = (): number => {
    const formatter = new Intl.DateTimeFormat("es-CR", {
      timeZone: "America/Costa_Rica",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);

    return hour * 60 + minute;
  };
  const today = getTodayInCostaRica();

  const [eventData, setEventData] = useState<Event | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [subcampuses, setSubcampuses] = useState<Subcampus[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [event, campusesData, user] = await Promise.all([
          getEventById(id!),
          getAllCampus(),
          getCurrentUser(),
        ]);

        if (!event) {
          Swal.fire("Error", "No se pudo cargar el evento.", "error");
          navigate("/events-list");
          return;
        }

        // 🔒 Validación de permisos
        const hasPermission = (permissionName: string): boolean => {
          return (
            user?.userRoles?.some(role =>
              role.permissions?.some(p => p.permissionName === permissionName)
            ) ?? false
          );
        };

        if (!hasPermission("MODIFICAR EVENTOS")) {
          await Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tienes permiso para editar eventos.",
            confirmButtonText: "Volver"
          });
          navigate("/home", { replace: true });
          return;
        }

        const subcampusList = event.campusId
          ? await getAllSubcampus(event.campusId)
          : [];

        setEventData(event);
        setCampuses(campusesData);
        setSubcampuses(subcampusList);
        setCurrentUser(user);
      } catch (error) {
        Swal.fire("Error", "No se pudo encontrar el evento solicitado.", "error");
        navigate("/events-list");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchSubcampus = async () => {
      if (eventData?.campusId) {
        try {
          const data = await getAllSubcampus(eventData.campusId);
          setSubcampuses(data);
        } catch {
          setSubcampuses([]);
        }
      } else {
        setSubcampuses([]);
        if (eventData) {
          setEventData((prev) => (prev ? { ...prev, subcampusId: "" } : null));
        }
      }
    };
    fetchSubcampus();
  }, [eventData?.campusId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!eventData) return;
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        Swal.fire("Error", "Solo se permiten imágenes JPEG, PNG, GIF o WEBP.", "error");
        e.target.value = "";
        setImagePreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "El tamaño máximo es 5MB.", "error");
        e.target.value = "";
        setImagePreview(null);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) setImagePreview(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): string | null => {
    if (!eventData) return "Datos del evento no cargados.";
    const {
      eventTitle,
      eventDescription,
      eventDate,
      eventTime,
      eventModality,
      campusId,
    } = eventData;

     const allowedPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s¿?()\/]+$/;

    if (!eventTitle || eventTitle.trim() === "")
      return "El título no puede estar vacío.";
    if (!allowedPattern.test(eventTitle))
      return "El título solo puede contener letras y espacios.";
    if (eventTitle.length < 4 || eventTitle.length > 200)
      return "El título debe tener entre 4 y 200 caracteres.";

    if (!eventDescription || eventDescription.trim() === "")
      return "La descripción no puede estar vacía.";
    if (!allowedPattern.test(eventDescription))
      return "La descripción solo puede contener letras y espacios.";
    if (eventDescription.length < 4 || eventDescription.length > 500)
      return "La descripción debe tener entre 4 y 500 caracteres.";

    if (!eventDate || eventDate < today) return "La fecha no puede estar en el pasado.";
    if (!eventTime) return "La hora es obligatoria.";
    else {
      const [hours, minutes] = eventTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
    
      if (eventDate === today) {
        const currentTotalMinutes = getCostaRicaCurrentTotalMinutes();
        if (totalMinutes < currentTotalMinutes) {
          Swal.fire({
            icon: "warning",
            title: "Hora inválida",
            text:
              "No puedes actualizar un evento a una hora que ya ha pasado para el día actual (hora local Costa Rica).",
          });
          return "Hora pasada para hoy.";
        }
      }
    }
    if (!eventModality) return "Debes seleccionar una modalidad.";
    if (!campusId) return "Debes seleccionar un campus.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventData) return;

    const error = validateForm();
    if (error) {
      if (error !== "Hora pasada para hoy.") {
        await Swal.fire("Validación", error, "warning");
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("eventId", eventData.eventId);
      formData.append("eventTitle", eventData.eventTitle);
      formData.append("eventDescription", eventData.eventDescription);
      formData.append("eventDate", eventData.eventDate);
      formData.append("eventTime", eventData.eventTime);
      formData.append("eventModality", eventData.eventModality);
      formData.append("createdBy", currentUser?.userId || "");

      if (eventData.campusId) formData.append("campusId", eventData.campusId);
      if (eventData.subcampusId)
        formData.append("subcampusId", eventData.subcampusId);
      if (selectedFile) formData.append("image", selectedFile);

      await updateEvent(formData);
      await Swal.fire("Actualizado", "Evento actualizado correctamente.", "success");
      navigate("/events-list");
    } catch (err: any) {
      Swal.fire("Error", err.message || "No se pudo actualizar el evento.", "error");
    }
  };

  if (loading)
    return (
      <div className="container py-4">
        <p>Cargando...</p>
      </div>
    );
  if (!eventData)
    return (
      <div className="container py-4">
        <p>Evento no encontrado.</p>
      </div>
    );

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">Editar Evento</Title>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="eventTitle" className="form-label">Título</label>
          <Input
            type="text"
            id="eventTitle"
            name="eventTitle"
            value={eventData.eventTitle}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Imagen</label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="img-thumbnail"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="eventDescription" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="eventDescription"
            name="eventDescription"
            rows={3}
            value={eventData.eventDescription}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventDate" className="form-label">Fecha</label>
          <Input
            type="date"
            className="form-control"
            id="eventDate"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            min={today}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventTime" className="form-label">Hora</label>
          <Input
            type="time"
            className="form-control"
            id="eventTime"
            name="eventTime"
            value={eventData.eventTime}
            onChange={handleChange}
            
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventModality" className="form-label">Modalidad</label>
          <select
            className="form-select"
            id="eventModality"
            name="eventModality"
            value={eventData.eventModality}
            onChange={handleChange}
          >
            <option value="">Selecciona la modalidad</option>
            <option value="inPerson">Presencial</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="campusId" className="form-label">Sedes</label>
          <select
            className="form-select"
            id="campusId"
            name="campusId"
            value={eventData.campusId || ""}
            onChange={handleChange}
          >
            <option value="">Selecciona una sede</option>
            {campuses.map((campus) => (
              <option key={campus.campusId} value={campus.campusId}>
                {campus.campusName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="subcampusId" className="form-label">Recintos</label>
          <select
            className="form-select"
            id="subcampusId"
            name="subcampusId"
            value={eventData.subcampusId || ""}
            onChange={handleChange}
            disabled={!eventData.campusId}
          >
            <option value="">Selecciona un recinto</option>
            {subcampuses.map((sub) => (
              <option key={sub.subcampusId} value={sub.subcampusId}>
                {sub.subcampusName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Button type="button" variant="secondary" onClick={() => navigate("/events-list")}>
            <i className="bi bi-x me-2"></i> Cancelar
          </Button>
          <Button type="submit" variant="primary">
            <i className="bi bi-check me-2"></i> Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
