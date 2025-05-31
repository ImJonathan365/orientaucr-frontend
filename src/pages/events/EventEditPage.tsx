import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../services/eventService";
import { Event, EventModality } from "../../types/EventTypes";
import { Title } from "../../components/atoms/Title/Ttile";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";
import Swal from "sweetalert2";

export const EventsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id!);
        setEvent(data);
      } catch (error) {
        console.error("Error al obtener el evento", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!event) return;
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;

    // Validaciones simples
    if (!event.event_title || !event.event_description || !event.event_date || !event.event_time || !event.event_modality) {
      Swal.fire("Campos requeridos", "Por favor completa todos los campos obligatorios.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Deseas guardar los cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await updateEvent(event);
        Swal.fire("Actualizado", "Evento actualizado correctamente", "success");
        navigate("/events-list");
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al actualizar el evento", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <p>Cargando evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-4">
        <p>No se encontró el evento.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">Editar Evento</Title>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="event_title" className="form-label">Título del Evento</label>
          <Input
            type="text"
            id="event_title"
            name="event_title"
            className="form-control"
            value={event.event_title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="event_description" className="form-label">Descripción</label>
          <textarea
            id="event_description"
            name="event_description"
            className="form-control"
            rows={4}
            value={event.event_description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="event_date" className="form-label">Fecha</label>
          <Input
            type="date"
            id="event_date"
            name="event_date"
            className="form-control"
            value={event.event_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="event_time" className="form-label">Hora</label>
          <Input
            type="time"
            id="event_time"
            name="event_time"
            className="form-control"
            value={event.event_time}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="event_modality" className="form-label">Modalidad</label>
          <select
            id="event_modality"
            name="event_modality"
            className="form-select"
            value={event.event_modality}
            onChange={handleChange}
          >
            <option value="" disabled>Selecciona una modalidad</option>
            <option value="PRESENCIAL">Presencial</option>
            <option value="VIRTUAL">Virtual</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="event_image_path" className="form-label">URL Imagen (opcional)</label>
          <Input
            type="text"
            id="event_image_path"
            name="event_image_path"
            className="form-control"
            value={event.event_image_path || ""}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="btn btn-primary">Guardar Cambios</Button>
      </form>
    </div>
  );
};
