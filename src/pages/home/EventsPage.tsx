import { useEffect, useState } from "react";
import { Event } from "../../types/EventTypes";
import { getAllEvents } from "../../services/eventService";
import FooterBar from "../../components/organisms/FooterBar/FooterBar";
import { HeaderBar } from "../../components/organisms/HeaderBar/HeaderBar";
import SideBar from "../../components/organisms/SideBar/SideBar";

export const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

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

  return (
    <>
      <HeaderBar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <SideBar />
        <main className="flex-grow-1 p-5 bg-light">
          <section className="mb-5 text-center">
            <h1 className="display-4 fw-bold text-primary">Eventos Institucionales</h1>
            <p className="lead text-secondary">
              Explora los próximos eventos, conferencias y talleres organizados por la universidad.
            </p>
          </section>

          <div className="row g-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div className="col-sm-12 col-md-6 col-lg-4" key={event.eventId}>
                  <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                    {event.eventImagePath && (
                      <img
                        src={event.eventImagePath.toString()}
                        className="card-img-top rounded-top"
                        alt={event.eventTitle}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-semibold text-dark">{event.eventTitle}</h5>
                      <p className="card-text text-muted flex-grow-1">{event.eventDescription}</p>
                      <ul className="list-unstyled mt-3 small text-secondary">
                        <li><i className="bi bi-calendar3"></i> <strong>Fecha:</strong> {event.eventDate}</li>
                        <li><i className="bi bi-clock"></i> <strong>Hora:</strong> {event.eventTime}</li>
                        <li><i className="bi bi-globe"></i> <strong>Modalidad:</strong> {event.eventModality === "virtual" ? "Virtual" : "Presencial"}</li>
                      </ul>
                      {/* Botón de Participar */}
                      <button className="btn btn-primary w-100 mt-3">
                        Participar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">
                <p className="fs-5">No hay eventos disponibles actualmente. ¡Vuelve pronto!</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <FooterBar />
    </>
  );
};
