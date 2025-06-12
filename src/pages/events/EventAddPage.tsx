import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Input } from "../../components/atoms/Input/Input";
import { Title } from "../../components/atoms/Title/Ttile";
import { Button } from "../../components/atoms/Button/Button";
import { useUser } from "../../contexts/UserContext";
import { Event } from "../../types/EventTypes";
import { addEvent } from "../../services/eventService";
import { getAllCampus } from "../../services/campusService";
import { Campus } from "../../types/campusType";
import { Subcampus } from "../../types/subcampusType";
import { getAllSubcampus } from "../../services/subcampusService";

export const EventAddPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const today = new Date().toISOString().split("T")[0];

  const [eventData, setEventData] = useState<Event>({
    eventId: "",
    eventTitle: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    eventModality: "virtual",
    eventImagePath: null,
    createdBy: user?.userId || "",
    campusId: "",
    subcampusId: "",
  });

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [subcampuses, setSubcampuses] = useState<Subcampus[]>([]);
  const [loading, setLoading] = useState(true);
  const [campusError, setCampusError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campusesData = await getAllCampus();
        const subcampusesData = await getAllSubcampus();
        setCampuses(campusesData);
        setSubcampuses(subcampusesData);
      } catch (error) {
        setCampuses([]);
        setSubcampuses([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los campus o subcampus",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const campusSelected = !!eventData.campusId;
    const subcampusSelected = !!eventData.subcampusId;

    if (campusSelected && subcampusSelected) {
      setCampusError("Debe seleccionar únicamente un campus o un subcampus, pero no ambos.");
    } else if (!campusSelected && !subcampusSelected) {
      setCampusError("Debe seleccionar al menos un campus o subcampus.");
    } else {
      setCampusError(null);
    }
  }, [eventData.campusId, eventData.subcampusId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

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
    const { eventTitle, eventDescription, eventDate, eventTime, eventModality } = eventData;

    if (!eventTitle || eventTitle.length < 4 || eventTitle.length > 25) {
      return "El título del evento debe tener entre 4 y 25 caracteres.";
    }
    if (!eventDescription || eventDescription.length < 4 || eventDescription.length > 500) {
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

    const error = validateForm();
    if (error) {
      return Swal.fire({
        icon: "warning",
        title: "Validación",
        text: error,
      });
    }

    try {
      const formData = new FormData();
      formData.append("eventTitle", eventData.eventTitle);
      formData.append("eventDescription", eventData.eventDescription);
      formData.append("eventDate", eventData.eventDate);
      formData.append("eventTime", eventData.eventTime);
      formData.append("eventModality", eventData.eventModality);
      formData.append("createdBy", eventData.createdBy || "");

      if (eventData.campusId) formData.append("campusId", eventData.campusId);
      if (eventData.subcampusId) formData.append("subcampusId", eventData.subcampusId);
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
        <p>Cargando campus y subcampus...</p>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Título */}
          <div className="mb-3">
            <label htmlFor="eventTitle" className="form-label">Título del Evento</label>
            <Input
              type="text"
              className={`form-control ${
                eventData.eventTitle.length > 0 &&
                (eventData.eventTitle.length < 4 || eventData.eventTitle.length > 25)
                  ? "is-invalid"
                  : ""
              }`}
              id="eventTitle"
              name="eventTitle"
              value={eventData.eventTitle}
              onChange={handleChange}
            />
            {eventData.eventTitle.length > 0 &&
              (eventData.eventTitle.length < 4 || eventData.eventTitle.length > 25) && (
                <div className="invalid-feedback">
                  Debe tener entre 4 y 25 caracteres.
                </div>
              )}
          </div>

          {/* Imagen */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Imagen del evento</label>
            <input type="file" className="form-control" id="image" name="image" onChange={handleFileChange} accept="image/*" />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Vista previa" className="img-thumbnail" style={{ maxWidth: "200px", maxHeight: "200px" }} />
              </div>
            )}
            <div className="form-text">Formatos aceptados: JPEG, PNG, GIF, WEBP. Tamaño máximo: 5MB.</div>
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <label htmlFor="eventDescription" className="form-label">Descripción</label>
            <Input
              type="text"
              className={`form-control ${
                eventData.eventDescription.length > 0 &&
                (eventData.eventDescription.length < 4 || eventData.eventDescription.length > 500)
                  ? "is-invalid"
                  : ""
              }`}
              id="eventDescription"
              name="eventDescription"
              value={eventData.eventDescription}
              onChange={handleChange}
            />
            {eventData.eventDescription.length > 0 &&
              (eventData.eventDescription.length < 4 || eventData.eventDescription.length > 500) && (
                <div className="invalid-feedback">
                  Debe tener entre 4 y 500 caracteres.
                </div>
              )}
          </div>

          {/* Fecha */}
          <div className="mb-3">
            <label htmlFor="eventDate" className="form-label">Fecha del Evento</label>
            <Input type="date" className="form-control" id="eventDate" name="eventDate" value={eventData.eventDate} onChange={handleChange} min={today} />
          </div>

          {/* Hora */}
          <div className="mb-3">
            <label htmlFor="eventTime" className="form-label">Hora del Evento</label>
            <Input type="time" className="form-control" id="eventTime" name="eventTime" value={eventData.eventTime} onChange={handleChange} />
          </div>

          {/* Modalidad */}
          <div className="mb-3">
            <label htmlFor="eventModality" className="form-label">Modalidad</label>
            <select className="form-select" id="eventModality" name="eventModality" value={eventData.eventModality} onChange={handleChange}>
              <option value="inPerson">Presencial</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>

          {/* Campus */}
          <div className="mb-3">
            <label htmlFor="campusId" className="form-label">Campus</label>
          <select
  className="form-select"
  id="campusId"
  name="campusId"
  value={eventData.campusId ?? ""}
  onChange={handleChange}
  disabled={!!eventData.subcampusId}  // << aquí está el truco
>

              <option value="">Selecciona un campus</option>
              {campuses.map((campus) => (
                <option key={campus.campusId} value={campus.campusId}>{campus.campusName}</option>
              ))}
            </select>
          </div>

          {/* Subcampus */}
          <div className="mb-3">
            <label htmlFor="subcampusId" className="form-label">Subcampus</label>d
 <select
  className="form-select"
  id="subcampusId"
  name="subcampusId"
  value={eventData.subcampusId ?? ""}

  onChange={handleChange}
  disabled={!!eventData.campusId}  // << aquí la lógica inversa
>


              <option value="">Selecciona un subcampus</option>
              {subcampuses.map((sub) => (
                <option key={sub.subcampusId} value={sub.subcampusId}>{sub.subcampusName}</option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Button type="button" variant="secondary" onClick={() => navigate("/events-list")}>
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
