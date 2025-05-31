import { useEffect, useState } from 'react';
import { getAllEvents } from '../../services/eventService';
import { Title } from '../../components/atoms/Title/Ttile';
import { Event } from '../../types/EventTypes';

export const EventsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        await getAllEvents(); // ya no guardamos los eventos porque no los mostramos
      } catch {
        setError('Error al cargar los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="col-12">
      <center>
        <Title variant="h2" color="success">Eventos</Title>
        {loading ? (
          <p>Cargando eventos...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <p>Eventos cargados correctamente.</p>
        )}
      </center>
    </div>
  );
};
