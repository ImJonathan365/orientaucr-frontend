import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getEventById, updateEvent } from "../../services/eventService";
import { getAllCampus } from "../../services/campusService";
import { getAllSubcampus } from "../../services/subcampusService";
import { Event } from "../../types/EventTypes";
import { Campus } from "../../types/campusType";
import { Subcampus } from "../../types/subcampusType";
import { Title } from "../../components/atoms/Title/Ttile";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";

export const EventsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const today = new Date().toISOString().split("T")[0];

  const [eventData, setEventData] = useState<Event | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [subcampuses, setSubcampuses] = useState<Subcampus[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [campusError, setCampusError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [event, campusesData, subcampusesData] = await Promise.all([
          getEventById(id!),
          getAllCampus(),
          getAllSubcampus(),
        ]);

        if (!event) {
          Swal.fire("Error", "No se pudo cargar el evento.", "error");
          navigate("/events-list");
          return;
        }

        setEventData(event);
        setCampuses(campusesData);
        setSubcampuses(subcampusesData);
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
    if (!eventData) return;
    const campusSelected = !!eventData.campusId;
    const subcampusSelected = !!eventData.subcampusId;

    if (campusSelected && subcampusSelected) {
      setCampusError(
        "Debe seleccionar únicamente un campus o un subcampus, pero no ambos."
      );
    } else if (!campusSelected && !subcampusSelected) {
      setCampusError("Debe seleccionar al menos un campus o subcampus.");
    } else {
      setCampusError(null);
    }
  }, [eventData?.campusId, eventData?.subcampusId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!eventData) return;
    const { name, value } = e.target;

    if (name === "campusId" && value) {
      setEventData({ ...eventData, campusId: value, subcampusId: "" });
    } else if (name === "subcampusId" && value) {
      setEventData({ ...eventData, subcampusId: value, campusId: "" });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
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
    } = eventData;

    if (!eventTitle || eventTitle.length < 4 || eventTitle.length > 25)
      return "El título debe tener entre 4 y 25 caracteres.";
    if (
      !eventDescription ||
      eventDescription.length < 4 ||
      eventDescription.length > 500
    )
      return "La descripción debe tener entre 4 y 500 caracteres.";
    if (!eventDate || eventDate < today)
      return "La fecha no puede estar en el pasado.";
    if (!eventTime) return "La hora es obligatoria.";
    if (!eventModality) return "Debes seleccionar una modalidad.";
    if (campusError) return campusError;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventData) return;

    const error = validateForm();
    if (error) {
      Swal.fire("Validación", error, "warning");
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
      formData.append("createdBy", eventData.createdBy || "");

      if (eventData.campusId) formData.append("campusId", eventData.campusId);
      if (eventData.subcampusId)
        formData.append("subcampusId", eventData.subcampusId);
      if (selectedFile) formData.append("image", selectedFile);

      await updateEvent(formData);
      await Swal.fire(
        "Actualizado",
        "Evento actualizado correctamente.",
        "success"
      );
      navigate("/events-list");
    } catch (err: any) {
      Swal.fire(
        "Error",
        err.message || "No se pudo actualizar el evento.",
        "error"
      );
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
            className={`form-control ${
              eventData.eventTitle.length < 4 ||
              eventData.eventTitle.length > 25
                ? "is-invalid"
                : ""
            }`}
          />
          {(eventData.eventTitle.length < 4 ||
            eventData.eventTitle.length > 25) && (
            <div className="invalid-feedback">
              Debe tener entre 4 y 25 caracteres.
            </div>
          )}
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
          <div className="form-text">
            Formatos permitidos: JPEG, PNG, GIF, WEBP. Máx 5MB.
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label htmlFor="eventDescription" className="form-label">
            Descripción
          </label>
          <textarea
            className={`form-control ${
              eventData.eventDescription.length < 4 ||
              eventData.eventDescription.length > 500
                ? "is-invalid"
                : ""
            }`}
            id="eventDescription"
            name="eventDescription"
            rows={3}
            value={eventData.eventDescription}
            onChange={handleChange}
          />
          {(eventData.eventDescription.length < 4 ||
            eventData.eventDescription.length > 500) && (
            <div className="invalid-feedback">
              Debe tener entre 4 y 500 caracteres.
            </div>
          )}
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
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
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
              disabled={!!eventData.subcampusId} 
          >
            <option value="">Selecciona un campus</option>
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
             disabled={!!eventData.campusId} 
          >
            <option value="">Selecciona un subcampus</option>
            {subcampuses.map((subcampus) => (
              <option key={subcampus.subcampusId} value={subcampus.subcampusId}>
                {subcampus.subcampusName}
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
