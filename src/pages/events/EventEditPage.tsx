import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getEventById, updateEvent } from "../../services/eventService";
import { Event } from "../../types/EventTypes";
import { Title } from "../../components/atoms/Title/Ttile";
import { Input } from "../../components/atoms/Input/Input";
import { Button } from "../../components/atoms/Button/Button";

export const EventsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const today = new Date().toISOString().split("T")[0];

  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [campusError, setCampusError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id!);
        setEventData(data);
      } catch (error) {
        console.error("Error al obtener el evento", error);
        setEventData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);
  
useEffect(() => {
  const fetchEventData = async () => {
    if (!id) {
      await Swal.fire({
        title: "Error",
        text: "No se proporcionó ID del evento.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      navigate("/events-list"); // Ajusta la ruta según tu app
      return;
    }

    try {
      const event = await getEventById(id);

      if (!event || !event.eventId) {
        await Swal.fire({
          title: "No encontrado",
          text: "No se pudo encontrar el evento solicitado.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        navigate("/events-list");
        return;
      }

      setEventData(event);
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar los datos del evento.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      navigate("/events-list");
    } finally {
      setLoading(false);
    }
  };

  fetchEventData();
}, [id, navigate]);

  // Validación campus/subcampus
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

    // Si se selecciona campus limpia subcampus y viceversa
    if (name === "campusId" && value) {
      setEventData({ ...eventData, campusId: value, subcampusId: "" });
    } else if (name === "subcampusId" && value) {
      setEventData({ ...eventData, subcampusId: value, campusId: "" });
    } else {
      setEventData({ ...eventData, [name]: value });
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

    if (!eventTitle || eventTitle.length < 4 || eventTitle.length > 25) {
      return "El título del evento debe tener entre 4 y 25 caracteres.";
    }

    if (
      !eventDescription ||
      eventDescription.length < 4 ||
      eventDescription.length > 500
    ) {
      return "La descripción debe tener entre 4 y 500 caracteres.";
    }

    if (!eventDate || eventDate < today) {
      return "La fecha no puede estar en el pasado.";
    }

    if (!eventTime) {
      return "La hora es obligatoria.";
    }

    if (!eventModality) {
      return "Debes seleccionar una modalidad.";
    }

    if (campusError) {
      return campusError;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventData) return;

    const error = validateForm();
    if (error) {
      return Swal.fire({
        icon: "warning",
        title: "Validación",
        text: error,
        confirmButtonText: "Aceptar",
      });
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
        await updateEvent(eventData);
        await Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Evento actualizado correctamente.",
          confirmButtonText: "Aceptar",
        });
        navigate("/events-list");
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Hubo un problema al actualizar el evento.",
        });
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

  if (!eventData) {
    return (
      <div className="container py-4">
        <p>No se encontró el evento.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">
        Editar Evento
      </Title>
      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="mb-3">
          <label htmlFor="eventTitle" className="form-label">
            Título del Evento
          </label>
          <Input
            type="text"
            id="eventTitle"
            name="eventTitle"
            className={`form-control ${
              eventData.eventTitle.length > 0 &&
              (eventData.eventTitle.length < 4 ||
                eventData.eventTitle.length > 25)
                ? "is-invalid"
                : ""
            }`}
            value={eventData.eventTitle}
            onChange={handleChange}
          />
          {eventData.eventTitle.length > 0 &&
            (eventData.eventTitle.length < 4 ||
              eventData.eventTitle.length > 25) && (
              <div className="invalid-feedback">
                Debe tener entre 4 y 25 caracteres.
              </div>
            )}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label htmlFor="eventDescription" className="form-label">
            Descripción
          </label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            className={`form-control ${
              eventData.eventDescription.length > 0 &&
              (eventData.eventDescription.length < 4 ||
                eventData.eventDescription.length > 500)
                ? "is-invalid"
                : ""
            }`}
            rows={4}
            value={eventData.eventDescription}
            onChange={handleChange}
          />
          {eventData.eventDescription.length > 0 &&
            (eventData.eventDescription.length < 4 ||
              eventData.eventDescription.length > 500) && (
              <div className="invalid-feedback">
                Debe tener entre 4 y 500 caracteres.
              </div>
            )}
        </div>

        {/* Fecha */}
        <div className="mb-3">
          <label htmlFor="eventDate" className="form-label">
            Fecha del Evento
          </label>
          <Input
            type="date"
            id="eventDate"
            name="eventDate"
            className="form-control"
            value={eventData.eventDate}
            onChange={handleChange}
            min={today}
          />
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label htmlFor="eventTime" className="form-label">
            Hora del Evento
          </label>
          <Input
            type="time"
            id="eventTime"
            name="eventTime"
            className="form-control"
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
            id="eventModality"
            name="eventModality"
            className="form-select"
            value={eventData.eventModality}
            onChange={handleChange}
          >
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
            id="campusId"
            name="campusId"
            className={`form-select ${campusError ? "is-invalid" : ""}`}
            value={eventData.campusId || ""}
            onChange={handleChange}
            disabled={!!eventData.subcampusId}
          >
            <option value="">Seleccione un campus</option>
            <option value="c2b6d8e1-1111-4abc-91f1-111111111111">
              Campus Occidente
            </option>
            <option value="c3c7e9f2-2222-4abc-92f2-222222222222">
              Campus Caribe
            </option>
            <option value="c4d8f0a3-3333-4abc-93f3-333333333333">
              Campus Central
            </option>
          </select>
        </div>

        {/* Subcampus */}
        <div className="mb-3">
          <label htmlFor="subcampusId" className="form-label">
            Subcampus
          </label>
          <select
            id="subcampusId"
            name="subcampusId"
            className={`form-select ${campusError ? "is-invalid" : ""}`}
            value={eventData.subcampusId || ""}
            onChange={handleChange}
            disabled={!!eventData.campusId}
          >
            <option value="">Seleccione un subcampus</option>
            <option value="s1e2f3g4-aaaa-4def-a8c9-aaaabbbbcccc">
              Subcampus 1
            </option>
            <option value="s2f3g4h5-bbbb-4def-a8c9-bbbbccccdddd">
              Subcampus 2
            </option>
            <option value="s3g4h5i6-cccc-4def-a8c9-ccccddddeeee">
              Subcampus 3
            </option>
          </select>
          {campusError && (
            <div className="invalid-feedback d-block">{campusError}</div>
          )}
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/events-list")}
          >
            <i className="bi bi-x me-2"></i>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            <i className="bi bi-check me-2"></i>
            Guardar cambios
          </Button>
          </div>
      </form>
    </div>
  );
};
