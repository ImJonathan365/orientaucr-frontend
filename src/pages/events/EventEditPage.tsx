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
import { Title } from "../../components/atoms/Title/Ttile";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";

export const EventsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Obtener fecha actual en Costa Rica (YYYY-MM-DD)
  const getTodayInCostaRica = (): string => {
    const today = new Date();
    const costaRicaOffset = -6 * 60; // UTC-6 en minutos
    const localTime = new Date(
      today.getTime() - (today.getTimezoneOffset() - costaRicaOffset) * 60000
    );
    return localTime.toISOString().split("T")[0];
  };

  // Obtener minutos totales desde medianoche para la hora actual en Costa Rica
  const getCostaRicaCurrentTotalMinutes = (): number => {
    const now = new Date();
    let costaRicaHours = now.getUTCHours() - 6;
    if (costaRicaHours < 0) costaRicaHours += 24;
    const costaRicaMinutes = now.getUTCMinutes();
    return costaRicaHours * 60 + costaRicaMinutes;
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

        const subcampusList = event.campusId
          ? await getAllSubcampus(event.campusId)
          : [];

        setEventData(event);
        setCampuses(campusesData);
        setSubcampuses(subcampusList);
        setCurrentUser(user);
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar la información.", "error");
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
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        Swal.fire(
          "Error",
          "Solo se permiten imágenes JPEG, PNG, GIF o WEBP.",
          "error"
        );
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

    if (!eventTitle || eventTitle.length < 4 || eventTitle.length > 200)
      return "El título debe tener entre 4 y 200 caracteres.";
    if (!eventDescription || eventDescription.length < 4 || eventDescription.length > 500)
      return "La descripción debe tener entre 4 y 500 caracteres.";
    if (!eventDate || eventDate < today) return "La fecha no puede estar en el pasado.";
    if (!eventTime) return "La hora es obligatoria.";
    else {
      const [hours, minutes] = eventTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes < 360 || totalMinutes > 1260) {
        return "La hora del evento debe estar entre 6:00 AM y 9:00 PM.";
      }
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
      <Title variant="h2" className="mb-4">
        Editar Evento
      </Title>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Título */}
        <div className="mb-3">
          <label htmlFor="eventTitle" className="form-label">
            Título
          </label>
          <Input
            type="text"
            id="eventTitle"
            name="eventTitle"
            value={eventData.eventTitle}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Imagen */}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Imagen
          </label>
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

        {/* Descripción */}
        <div className="mb-3">
          <label htmlFor="eventDescription" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="eventDescription"
            name="eventDescription"
            rows={3}
            value={eventData.eventDescription}
            onChange={handleChange}
          />
        </div>

        {/* Fecha */}
        <div className="mb-3">
          <label htmlFor="eventDate" className="form-label">
            Fecha
          </label>
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

        {/* Hora */}
        <div className="mb-3">
          <label htmlFor="eventTime" className="form-label">
            Hora
          </label>
          <Input
            type="time"
            className="form-control"
            id="eventTime"
            name="eventTime"
            value={eventData.eventTime}
            onChange={handleChange}
            min="06:00"
            max="21:00"
          />
        </div>

        {/* Modalidad */}
        <div className="mb-3">
          <label htmlFor="eventModality" className="form-label">
            Modalidad
          </label>
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

        {/* Campus */}
        <div className="mb-3">
          <label htmlFor="campusId" className="form-label">
            Campus
          </label>
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

        {/* Subcampus */}
        <div className="mb-3">
          <label htmlFor="subcampusId" className="form-label">
            Subcampus
          </label>
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
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/events-list")}
          >
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
