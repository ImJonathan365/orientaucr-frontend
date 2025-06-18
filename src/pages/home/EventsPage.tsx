import { useEffect, useState } from "react";
import { Event } from "../../types/EventTypes";
import { getAllEvents, insertUserInterestedEvent } from "../../services/eventService";
import Swal from "sweetalert2";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

export const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
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
      html: `<p><strong>Fecha:</strong> ${event.eventDate}</p>
             <p><strong>Hora:</strong> ${event.eventTime}</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, participar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await insertUserInterestedEvent(event.eventId, currentUser.userId ?? "");
        Swal.fire({
          icon: "success",
          title: "¡Te esperamos!",
          html: `<p>Has registrado tu participación en el evento "<strong>${event.eventTitle}</strong>".</p>
                 <p><strong>Fecha:</strong> ${event.eventDate}</p>
                 <p><strong>Hora:</strong> ${event.eventTime}</p>`,
        });
      } catch (error) {
        console.error("Error al registrar participación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al registrar tu interés. Intenta más tarde.",
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
          Explora los próximos eventos, conferencias y talleres organizados
          por la universidad.
        </p>
      </section>

      <div className="row g-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              className="col-sm-12 col-md-6 col-lg-4"
              key={event.eventId}
            >
              <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                {event.eventImagePath && (
                  <img
                    src={event.eventImagePath || undefined}
                    className="card-img-top rounded-top"
                    alt={event.eventTitle}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
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
                      <strong>Fecha:</strong> {event.eventDate}
                    </li>
                    <li>
                      <i className="bi bi-clock"></i>{" "}
                      <strong>Hora:</strong> {event.eventTime}
                    </li>
                    <li>
                      <i className="bi bi-globe"></i>{" "}
                      <strong>Modalidad:</strong>{" "}
                      {event.eventModality === "virtual"
                        ? "Virtual"
                        : "Presencial"}
                    </li>
                  </ul>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => handleParticipate(event)}
                  >
                    Participar
                  </button>
                </div>
              </div>
            </div>
          ))
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
