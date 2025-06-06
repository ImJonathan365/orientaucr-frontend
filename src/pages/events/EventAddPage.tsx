import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Input } from "../../components/atoms/Input/Input";
import { Title } from "../../components/atoms/Title/Ttile";
import { useUser } from "../../contexts/UserContext";
import { Event } from "../../types/EventTypes";
import { addEvent } from "../../services/eventService";

export const EventAddPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const [eventData, setEventData] = useState<Event>({
    event_id: "",
    event_title: "",
    event_description: "",
    event_date: "",
    event_time: "",
    event_modality: "in-person", // valor por defecto
    event_image_path: null,
    created_by: user?.userId || null,
    campus_id: "1",
    subcampus_id: "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const validateForm = (): string | null => {
    const { event_title, event_description, event_date, event_time, event_modality } = eventData;

    if (!event_title || event_title.length < 4 || event_title.length > 15) {
      return "El título del evento debe tener entre 4 y 15 caracteres.";
    }

    if (!event_description || event_description.length < 4 || event_description.length > 50) {
      return "La descripción debe tener entre 4 y 50 caracteres.";
    }

    if (!event_date || event_date < today) {
      return "La fecha no puede estar en el pasado.";
    }

    if (!event_time) {
      return "La hora es obligatoria.";
    }

    if (!event_modality) {
      return "Debes seleccionar una modalidad.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: error,
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      await addEvent(eventData);
      await Swal.fire({
        icon: "success",
        title: "Evento creado",
        text: "El evento se añadió correctamente.",
        confirmButtonText: "Aceptar",
      });
      navigate("/events-list");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el evento. Inténtalo nuevamente.",
      });
    }
  };

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">Añadir Evento</Title>
      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="mb-3">
          <label htmlFor="event_title" className="form-label">Título del Evento</label>
          <Input
            type="text"
            id="event_title"
            name="event_title"
            value={eventData.event_title}
            onChange={handleChange}
            required
            minLength={4}
            maxLength={15}
          />
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label htmlFor="event_description" className="form-label">Descripción</label>
          <Input
            type="text"
            id="event_description"
            name="event_description"
            value={eventData.event_description}
            onChange={handleChange}
            required
            minLength={4}
            maxLength={50}
          />
        </div>

        {/* Fecha */}
        <div className="mb-3">
          <label htmlFor="event_date" className="form-label">Fecha</label>
          <Input
            type="date"
            id="event_date"
            name="event_date"
            value={eventData.event_date}
            onChange={handleChange}
            required
            min={today}
          />
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label htmlFor="event_time" className="form-label">Hora</label>
          <Input
            type="time"
            id="event_time"
            name="event_time"
            value={eventData.event_time}
            onChange={handleChange}
            required
          />
        </div>

        {/* Modalidad */}
        <div className="mb-3">
          <label htmlFor="event_modality" className="form-label">Modalidad</label>
          <select
            id="event_modality"
            name="event_modality"
            className="form-select"
            value={eventData.event_modality}
            onChange={handleChange}
            required
          >
            <option value="in-person">Presencial</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>

        {/* Campus */}
        <div className="mb-3">
          <label htmlFor="campus_id" className="form-label">Campus</label>
          <select
            id="campus_id"
            name="campus_id"
            className="form-select"
            value={eventData.campus_id || ""}
            onChange={handleChange}
            required
          >
            <option value="1">Campus Central</option>
            <option value="2">Campus Oeste</option>
          </select>
        </div>

        {/* Subcampus */}
        <div className="mb-3">
          <label htmlFor="subcampus_id" className="form-label">Subcampus</label>
          <select
            id="subcampus_id"
            name="subcampus_id"
            className="form-select"
            value={eventData.subcampus_id || ""}
            onChange={handleChange}
            required
          >
            <option value="1">Sub-Campus Norte</option>
            <option value="2">Sub-Campus Sur</option>
          </select>
        </div>

        {/* Botón */}
        <button type="submit" className="btn btn-primary">Guardar Evento</button>
      </form>
    </div>
  );
};
