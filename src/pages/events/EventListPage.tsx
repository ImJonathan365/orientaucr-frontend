import React, { useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "../../services/eventService";
import { getCurrentUser } from "../../services/userService";
import { Event } from "../../types/EventTypes";
import { User } from "../../types/userType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate } from "react-router-dom";
import { Title } from "../../components/atoms/Title/Ttile";
import Swal from "sweetalert2";
import { Icon } from "../../components/atoms/Icon/Icon";
import { Button } from "../../components/atoms/Button/Button";

export const EventsListPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }

      try {
        const data = await getAllEvents();
        const sorted = data.sort((a, b) => {
          const dateA = new Date(`${a.eventDate}T${a.eventTime}`);
          const dateB = new Date(`${b.eventDate}T${b.eventTime}`);
          return dateA.getTime() - dateB.getTime();
        });
        setEvents(sorted);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndEvents();
  }, []);

  const hasPermission = (permission: string): boolean => {
    return currentUser?.userRoles?.some((role) =>
      role.permissions?.some((p) => p.permissionName === permission)
    ) ?? false;
  };

  const handleEdit = async (event: Event) => {
    if (!hasPermission("MODIFICAR EVENTOS")) {
      Swal.fire({
        icon: "warning",
        title: "Acceso denegado",
        text: "No tienes permiso para editar eventos.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Editar evento?",
      text: `¿Deseas editar el evento: ${event.eventTitle}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      navigate(`/events-list/edit/${event.eventId}`);
    }
  };

  const handleDelete = async (event: Event) => {
    if (!hasPermission("ELIMINAR EVENTOS")) {
      Swal.fire({
        icon: "warning",
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar eventos.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar evento?",
      text: `¿Seguro que deseas eliminar el evento: ${event.eventTitle}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(event.eventId);
        setEvents(events.filter((e) => e.eventId !== event.eventId));
        Swal.fire(
          "Eliminado",
          "El evento fue eliminado correctamente",
          "success"
        );
      } catch {
        Swal.fire("Error", "No se pudo eliminar el evento", "error");
      }
    }
  };

  const columns: TableColumn<Event>[] = [
    {
      key: "event_title",
      label: "Título",
      render: (row) => row.eventTitle,
    },
    {
      key: "event_date",
      label: "Fecha",
      render: (row) => {
        const localDate = new Date(row.eventDate + "T00:00:00");
        return localDate.toLocaleDateString();
      },
    },
    {
      key: "event_time",
      label: "Hora",
      render: (row) => row.eventTime?.slice(0, 5),
    },
    {
      key: "event_modality",
      label: "Modalidad",
      render: (row) =>
        row.eventModality === "virtual" ? "Virtual" : "Presencial",
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Title variant="h2" className="mb-4">
          Listado de eventos
        </Title>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/home")}>
            <Icon variant="home" className="me-2" />
            Regresar
          </Button>
          {hasPermission("CREAR EVENTOS") && (
            <Button
              variant="primary"
              onClick={() => navigate("/events-list/add")}
            >
              <Icon variant="add" className="me-2" />
              Nuevo Evento
            </Button>
          )}
        </div>
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
