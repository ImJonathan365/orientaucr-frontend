import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "../../services/eventService";
import { Event } from "../../types/EventTypes";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate, Link } from "react-router-dom";
import { Title } from "../../components/atoms/Title/Ttile";
import Swal from "sweetalert2";

export const EventsListPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = async (event: Event) => {
    const result = await Swal.fire({
      title: "¿Editar evento?",
      text: `¿Deseas editar el evento: ${event.event_title}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      navigate(`/events-list/edit/${event.event_id}`);
    }
  };

  const handleDelete = async (event: Event) => {
    const result = await Swal.fire({
      title: "¿Eliminar evento?",
      text: `¿Seguro que deseas eliminar el evento: ${event.event_title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(event.event_id);
        setEvents(events.filter((e) => e.event_id !== event.event_id));
        Swal.fire("Eliminado", "El evento fue eliminado correctamente", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar el evento", "error");
      }
    }
  };

  const columns: TableColumn<Event>[] = [
    {
      key: "event_title",
      label: "Título",
      render: (row) => row.event_title,
    },
    {
      key: "event_date",
      label: "Fecha",
      render: (row) => new Date(row.event_date).toLocaleDateString(),
    },
    {
      key: "event_time",
      label: "Hora",
      render: (row) => row.event_time,
    },
    {
      key: "event_modality",
      label: "Modalidad",
      render: (row) =>
        row.event_modality === "virtual" ? "Virtual" : "Presencial",
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Title variant="h2" className="mb-4">Eventos</Title>
        <Link to="/events-list/add" className="btn btn-primary mb-4">
          Añadir Evento
        </Link>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={events}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
