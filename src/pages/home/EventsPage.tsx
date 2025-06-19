import { useEffect, useState } from "react";
import { Event } from "../../types/EventTypes";
import {
  getAllEvents,
  insertUserInterestedEvent,
  removeUserInterestedEvent,
  getImage,
  getUserInterestedEvents,
} from "../../services/eventService";
import Swal from "sweetalert2";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

export const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userInterestedEvents, setUserInterestedEvents] = useState<Set<string>>(
    new Set()
  );

  // Convierte la fecha a local (Costa Rica) evitando desfase UTC
  const formatCostaRicanDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    const localDate = new Date(dateString + "T00:00:00");
    return localDate.toLocaleDateString("es-CR", options);
  };

  // Convierte la hora a formato 12h en Costa Rica
  const formatCostaRicanTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString("es-CR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchUserAndInterests = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        const interested = await getUserInterestedEvents(user.userId ?? "");
        setUserInterestedEvents(new Set(interested));
      } catch (error) {
        console.error("Error al cargar usuario o eventos interesados", error);
        setCurrentUser(null);
        setUserInterestedEvents(new Set());
      }
    };

    fetchUserAndInterests();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);

        // Obtener imágenes para cada evento que tenga eventImagePath
        data.forEach(async (event) => {
          if (event.eventImagePath) {
            try {
              const url = await getImage(event.eventImagePath);
              setImageUrls((prev) => ({ ...prev, [event.eventId]: url }));
            } catch (error) {
              console.error(
                `Error cargando imagen para evento ${event.eventId}:`,
                error
              );
            }
          }
        });
      } catch (error) {
        console.error("Error fetching events:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un problema al cargar los eventos. Intente más tarde.",
        });
      }
    };

    fetchEvents();
  }, []);

  const handleParticipate = async (event: Event) => {
    if (!currentUser || !currentUser.userId) {
      Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión",
        text: "Para participar en un evento debes estar autenticado.",
      });
      return;
    }

    const result = await Swal.fire({
      title: `¿Deseas participar en el evento "${event.eventTitle}"?`,
      html: `<p><strong>Fecha:</strong> ${formatCostaRicanDate(
        event.eventDate
      )}</p>
             <p><strong>Hora:</strong> ${formatCostaRicanTime(
               event.eventTime
             )}</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, participar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-primary me-2",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await insertUserInterestedEvent(
          event.eventId,
          currentUser.userId ?? ""
        );
        setUserInterestedEvents((prev) => new Set(prev).add(event.eventId));
        Swal.fire({
          icon: "success",
          title: "¡Te esperamos!",
          html: `<p>Has registrado tu participación en el evento "<strong>${
            event.eventTitle
          }</strong>".</p>
                 <p><strong>Fecha:</strong> ${formatCostaRicanDate(
                   event.eventDate
                 )}</p>
                 <p><strong>Hora:</strong> ${formatCostaRicanTime(
                   event.eventTime
                 )}</p>`,
          customClass: {
            confirmButton: "btn btn-success",
          },
          buttonsStyling: false,
        });
      } catch (error) {
        console.error("Error al registrar participación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al registrar tu interés. Intenta más tarde.",
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      }
    }
  };

  const handleCancelParticipate = async (event: Event) => {
    if (!currentUser || !currentUser.userId) {
      Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión",
        text: "Para cancelar tu participación, primero debes iniciar sesión.",
      });
      return;
    }

    const result = await Swal.fire({
      title: `¿Deseas cancelar la participación en el evento "${event.eventTitle}"?`,
      html: `<p><strong>Fecha:</strong> ${formatCostaRicanDate(
        event.eventDate
      )}</p>
             <p><strong>Hora:</strong> ${formatCostaRicanTime(
               event.eventTime
             )}</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, deseo cancelar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-primary me-2",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await removeUserInterestedEvent(
          event.eventId,
          currentUser.userId ?? ""
        );
        setUserInterestedEvents((prev) => {
          const copy = new Set(prev);
          copy.delete(event.eventId);
          return copy;
        });
        Swal.fire({
          icon: "success",
          title: "¡Lástima, te queríamos ver!",
          html: `<p>Has cancelado tu participación en el evento "<strong>${
            event.eventTitle
          }</strong>".</p>
                 <p><strong>Fecha:</strong> ${formatCostaRicanDate(
                   event.eventDate
                 )}</p>
                 <p><strong>Hora:</strong> ${formatCostaRicanTime(
                   event.eventTime
                 )}</p>`,
          customClass: {
            confirmButton: "btn btn-success",
          },
          buttonsStyling: false,
        });
      } catch (error) {
        console.error("Error al cancelar participación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al cancelar tu interés. Intenta más tarde.",
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      }
    }
  };

  return (
    <>
      <section className="mb-5 text-center">
        <h1 className="display-4 fw-bold text-primary">
          Eventos Institucionales
        </h1>
        <p className="lead text-secondary">
          Explora los próximos eventos, conferencias y talleres organizados por
          la universidad.
        </p>
      </section>

      <div className="row g-4">
        {events.length > 0 ? (
          events.map((event) => {
            const isInterested = userInterestedEvents.has(event.eventId);
            return (
              <div className="col-sm-12 col-md-6 col-lg-4" key={event.eventId}>
                <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                  {imageUrls[event.eventId] ? (
                    <img
                      src={imageUrls[event.eventId]}
                      className="card-img-top rounded-top"
                      alt={event.eventTitle}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ height: "180px", backgroundColor: "#ddd" }} />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-semibold text-dark">
                      {event.eventTitle}
                    </h5>
                    <p className="card-text text-muted flex-grow-1">
                      {event.eventDescription}
                    </p>
                    <ul className="list-unstyled mt-3 small text-secondary">
                      <li>
                        <i className="bi bi-calendar3"></i>{" "}
                        <strong>Fecha:</strong>{" "}
                        {formatCostaRicanDate(event.eventDate)}
                      </li>
                      <li>
                        <i className="bi bi-clock"></i> <strong>Hora:</strong>{" "}
                        {formatCostaRicanTime(event.eventTime)}
                      </li>
                      <li>
                        <i className="bi bi-globe"></i>{" "}
                        <strong>Modalidad:</strong>{" "}
                        {event.eventModality === "virtual"
                          ? "Virtual"
                          : "Presencial"}
                      </li>
                    </ul>
                    {currentUser && (
                      <button
                        className={`btn w-100 mt-3 ${
                          isInterested ? "btn-outline-danger" : "btn-primary"
                        }`}
                        onClick={() =>
                          isInterested
                            ? handleCancelParticipate(event)
                            : handleParticipate(event)
                        }
                      >
                        {isInterested ? "Cancelar participación" : "Participar"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted">
            <p className="fs-5">
              No hay eventos disponibles actualmente. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </div>
    </>
  );
};
