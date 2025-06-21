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
  const [loading, setLoading] = useState(true);

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getTodayInCostaRica = (): string => {
    const today = new Date();
    const costaRicaOffset = -6 * 60;
    const localTime = new Date(
      today.getTime() - (today.getTimezoneOffset() - costaRicaOffset) * 60000
    );
    return localTime.toISOString().split("T")[0];
  };

  const today = getTodayInCostaRica();

  const getCostaRicaCurrentTotalMinutes = (): number => {
    const now = new Date();
    let costaRicaHours = now.getUTCHours() - 6;
    if (costaRicaHours < 0) costaRicaHours += 24;
    const costaRicaMinutes = now.getUTCMinutes();
    return costaRicaHours * 60 + costaRicaMinutes;
  };

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      try {
        const user = await getCurrentUser();
        const hasPermission = user?.userRoles?.some(role =>
          role.permissions?.some(p => p.permissionName === "CREAR EVENTOS")
        );

        if (!hasPermission) {
          await Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tienes permiso para crear eventos.",
          });
          navigate("/home", { replace: true });
          return;
        }

        setCurrentUser(user);
      } catch {
        await Swal.fire("Error", "No se pudo validar tu sesión", "error");
        navigate("/home", { replace: true });
      }
    };

    fetchUserAndPermissions();
  }, [navigate]);

  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const campusesData = await getAllCampus();
        setCampuses(campusesData);
      } catch {
        setCampuses([]);
        Swal.fire("Error", "No se pudieron cargar las sedes", "error");
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
        } catch {
          setSubcampuses([]);
          Swal.fire("Error", "No se pudieron cargar los Recintos", "error");
        }
      } else {
        setSubcampuses([]);
        setEventData((prev) => ({ ...prev, subcampusId: "" }));
      }
    };

    fetchSubcampus();
  }, [eventData.campusId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

      if (!validImageTypes.includes(file.type)) {
        Swal.fire("Error", "Formato no válido (JPEG, PNG, GIF, WEBP)", "error");
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "La imagen no puede superar los 5MB", "error");
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
    const {
      eventTitle,
      eventDescription,
      eventDate,
      eventTime,
      eventModality,
      campusId,
    } = eventData;

    const allowedPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s¿?()\/]+$/;

    if (!eventTitle.trim()) return "El título no puede estar vacío.";
    if (!allowedPattern.test(eventTitle))
      return "El título solo puede contener letras y espacios.";
    if (eventTitle.length < 4 || eventTitle.length > 200)
      return "El título debe tener entre 4 y 200 caracteres.";

    if (!eventDescription.trim()) return "La descripción no puede estar vacía.";
    if (!allowedPattern.test(eventDescription))
      return "La descripción solo puede contener letras y espacios.";
    if (eventDescription.length < 4 || eventDescription.length > 500)
      return "La descripción debe tener entre 4 y 500 caracteres.";

    if (!eventDate || eventDate < today) return "La fecha no puede estar en el pasado.";
    if (!eventTime) return "La hora es obligatoria.";

    const [hours, minutes] = eventTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 360 || totalMinutes > 1260)
      return "La hora debe estar entre 6:00 AM y 9:00 PM.";

    if (eventDate === today) {
      const nowMinutes = getCostaRicaCurrentTotalMinutes();
      if (totalMinutes < nowMinutes)
        return "La hora debe ser mayor a la hora actual en Costa Rica.";
    }

    if (!eventModality) return "Debes seleccionar una modalidad.";
    if (!campusId) return "Debes seleccionar un campus.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      Swal.fire("Validación", error, "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("eventTitle", eventData.eventTitle);
      formData.append("eventDescription", eventData.eventDescription);

      const localDate = new Date(eventData.eventDate + "T00:00:00");
      const adjustedDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      );
      formData.append("eventDate", adjustedDate.toISOString().split("T")[0]);
      formData.append("eventTime", eventData.eventTime);
      formData.append("eventModality", eventData.eventModality);
      formData.append("createdBy", currentUser?.userId || "");
      if (eventData.campusId) formData.append("campusId", eventData.campusId);
      if (eventData.subcampusId) formData.append("subcampusId", eventData.subcampusId);
      if (selectedFile) formData.append("image", selectedFile);

      await addEvent(formData);
      await Swal.fire("Evento creado", "El evento se añadió correctamente.", "success");
      navigate("/events-list");
    } catch (error: any) {
      Swal.fire("Error", error.message || "No se pudo añadir el evento.", "error");
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
              Sedes
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
              Recintos
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
