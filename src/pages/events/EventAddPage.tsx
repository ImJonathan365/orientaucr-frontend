import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Input } from "../../components/atoms/Input/Input";
import { Title } from "../../components/atoms/Title/Ttile";
import { Button } from "../../components/atoms/Button/Button";
import { Event } from "../../types/EventTypes";
import { addEvent } from "../../services/eventService";
import { getAllCampus } from "../../services/campusService";
import { Campus } from "../../types/campusType";
import { Subcampus } from "../../types/subcampusType";
import { getAllSubcampus } from "../../services/subcampusService";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

export const EventAddPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Obtener fecha actual en Costa Rica (YYYY-MM-DD)
  const getTodayInCostaRica = (): string => {
    const today = new Date();
    const costaRicaOffset = -6 * 60; // UTC-6 en minutos
    const localTime = new Date(
      today.getTime() - (today.getTimezoneOffset() - costaRicaOffset) * 60000
    );
    return localTime.toISOString().split("T")[0];
  };

  const today = getTodayInCostaRica();

  // Obtener minutos totales desde medianoche para la hora actual en Costa Rica
  const getCostaRicaCurrentTotalMinutes = (): number => {
    const now = new Date();

    // Hora UTC
    let costaRicaHours = now.getUTCHours() - 6;
    if (costaRicaHours < 0) costaRicaHours += 24;
    const costaRicaMinutes = now.getUTCMinutes();

    return costaRicaHours * 60 + costaRicaMinutes;
  };

  const [eventData, setEventData] = useState<Event>({
    eventId: "",
    eventTitle: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    eventModality: "virtual",
    eventImagePath: null,
    campusId: "",
    subcampusId: "",
  });

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [subcampuses, setSubcampuses] = useState<Subcampus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const campusesData = await getAllCampus();
        setCampuses(campusesData);
      } catch (error) {
        setCampuses([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los campus",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCampus();
  }, []);

  useEffect(() => {
    const fetchSubcampus = async () => {
      if (eventData.campusId) {
        try {
          const subcampusData = await getAllSubcampus(eventData.campusId);
          setSubcampuses(subcampusData);
        } catch (error) {
          setSubcampuses([]);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los subcampus del campus seleccionado",
          });
        }
      } else {
        setSubcampuses([]);
        setEventData((prev) => ({ ...prev, subcampusId: "" }));
      }
    };

    fetchSubcampus();
  }, [eventData.campusId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        Swal.fire({
          icon: "error",
          title: "Tipo de archivo no válido",
          text: "Por favor, sube solo imágenes (JPEG, PNG, GIF, WEBP).",
        });
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "Archivo demasiado grande",
          text: "La imagen no puede superar los 5MB.",
        });
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): string | null => {
    const {
      eventTitle,
      eventDescription,
      eventDate,
      eventTime,
      eventModality,
    } = eventData;

    if (!eventTitle || eventTitle.length < 4 || eventTitle.length > 200) {
      return "El título del evento debe tener entre 4 y 200 caracteres.";
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
    } else {
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
              "No puedes crear un evento en una hora que ya ha pasado para el día actual (hora local Costa Rica).",
          });
          return "Hora pasada para hoy.";
        }
      }
    }

    if (!eventModality) {
      return "Debes seleccionar una modalidad.";
    }

    if (!eventData.campusId) {
      return "Debes seleccionar un campus.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      if (error !== "Hora pasada para hoy.") {
        // Mostrar Swal solo si no fue mostrado ya en validación
        await Swal.fire({
          icon: "warning",
          title: "Validación",
          text: error,
        });
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("eventTitle", eventData.eventTitle);
      formData.append("eventDescription", eventData.eventDescription);

      // Ajuste de fecha para evitar problemas de zona horaria
      const eventDateLocal = new Date(eventData.eventDate + "T00:00:00");
      const eventDateAdjusted = new Date(
        eventDateLocal.getTime() - eventDateLocal.getTimezoneOffset() * 60000
      );
      const localDateString = eventDateAdjusted.toISOString().split("T")[0];
      formData.append("eventDate", localDateString);

      formData.append("eventTime", eventData.eventTime);
      formData.append("eventModality", eventData.eventModality);
      formData.append("createdBy", currentUser?.userId || "");

      if (eventData.campusId) formData.append("campusId", eventData.campusId);
      if (eventData.subcampusId)
        formData.append("subcampusId", eventData.subcampusId);
      if (selectedFile) formData.append("image", selectedFile);

      await addEvent(formData);

      await Swal.fire({
        icon: "success",
        title: "Evento creado",
        text: "El evento se añadió correctamente.",
      });

      navigate("/events-list");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo añadir el evento.",
      });
    }
  };

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">
        Añadir Evento
      </Title>

      {loading ? (
        <p>Cargando campus...</p>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Título */}
          <div className="mb-3">
            <label htmlFor="eventTitle" className="form-label">
              Título del Evento
            </label>
            <Input
              type="text"
              className="form-control"
              id="eventTitle"
              name="eventTitle"
              value={eventData.eventTitle}
              onChange={handleChange}
            />
          </div>

          {/* Imagen */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Imagen del evento
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
              Fecha del Evento
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
              Hora (6:00 AM - 9:00 PM)
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
              value={eventData.campusId ?? ""}
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
              value={eventData.subcampusId ?? ""}
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

          {/* Botones */}
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
      )}
    </div>
  );
};
