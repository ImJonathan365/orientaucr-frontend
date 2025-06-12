import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Input } from "../../components/atoms/Input/Input";
import { Title } from "../../components/atoms/Title/Ttile";
import { Button } from "../../components/atoms/Button/Button";
import { Event } from "../../types/EventTypes";
import { addEvent } from "../../services/eventService";
import { getUserFromLocalStorage } from "../../utils/Auth";

export const EventAddPage = () => {
  const navigate = useNavigate();
  const user = getUserFromLocalStorage();
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

  const [campusError, setCampusError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
 const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    // Validar la selección de campus/subcampus cuando cambian
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
  }, [eventData.campusId, eventData.subcampusId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Si se selecciona un campus, limpiar subcampus y viceversa
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
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      // Validar tipo de archivo
      if (!validImageTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Tipo de archivo no válido",
          text: "Por favor, sube solo imágenes (JPEG, PNG, GIF, WEBP).",
          confirmButtonText: "Aceptar",
        });
        e.target.value = ""; // Limpiar el input
        setImagePreview(null);
        return;
      }
      
      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "Archivo demasiado grande",
          text: "La imagen no puede superar los 5MB.",
          confirmButtonText: "Aceptar",
        });
        e.target.value = "";
        setImagePreview(null);
        return;
      }
      
      setSelectedFile(file);
      
      // Crear vista previa
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

    const error = validateForm();
    if (error) {
      return Swal.fire({
        icon: "warning",
        title: "Validación",
        text: error,
        confirmButtonText: "Aceptar",
      });
    }

    try {
      const formData = new FormData();
      
      // Agregar todos los campos del evento al FormData
      formData.append("eventTitle", eventData.eventTitle);
      formData.append("eventDescription", eventData.eventDescription);
      formData.append("eventDate", eventData.eventDate);
      formData.append("eventTime", eventData.eventTime);
      formData.append("eventModality", eventData.eventModality);
      formData.append("createdBy", eventData.createdBy || "");
      
      // Solo agregar campusId o subcampusId si tienen valor
      if (eventData.campusId) {
        formData.append("campusId", eventData.campusId);
      }
      if (eventData.subcampusId) {
        formData.append("subcampusId", eventData.subcampusId);
      }

      // Agregar la imagen si existe
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await addEvent(formData);

      await Swal.fire({
        icon: "success",
        title: "Evento creado",
        text: "El evento se añadió correctamente.",
        confirmButtonText: "Aceptar",
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
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Título */}
        <div className="mb-3">
          <label htmlFor="eventTitle" className="form-label">
            Título del Evento
          </label>
          <Input
            type="text"
            className={`form-control ${
              eventData.eventTitle.length > 0 &&
              (eventData.eventTitle.length < 4 ||
                eventData.eventTitle.length > 25)
                ? "is-invalid"
                : ""
            }`}
            id="eventTitle"
            name="eventTitle"
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
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          )}
          <div className="form-text">
            Formatos aceptados: JPEG, PNG, GIF, WEBP. Tamaño máximo: 5MB.
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label htmlFor="eventDescription" className="form-label">
            Descripción
          </label>
          <Input
            type="text"
            className={`form-control ${
              eventData.eventDescription.length > 0 &&
              (eventData.eventDescription.length < 4 ||
                eventData.eventDescription.length > 500)
                ? "is-invalid"
                : ""
            }`}
            id="eventDescription"
            name="eventDescription"
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
            Hora del Evento
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
              Campus Guanacaste
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
              Subcampus de Derecho
            </option>
            <option value="s2f3g4h5-bbbb-4def-a8c9-bbbbccccdddd">
              Subcampus de Biología Marina
            </option>
            <option value="s3g4h5i6-cccc-4def-a8c9-ccccddddeeee">
              Subcampus de Turismo
            </option>
          </select>
          {campusError && <div className="invalid-feedback">{campusError}</div>}
        </div>

        {/* Botones */}
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
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};