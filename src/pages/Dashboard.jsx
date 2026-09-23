import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTickets } from '../api/ticketService';
import Layout from '../components/Layout';
import TicketCard from '../components/TicketCard';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarTickets = async () => {
      try {
        const datos = await listarTickets();
        setTickets(datos);
      } catch (err) {
        setError('No se pudieron cargar los tickets');
      } finally {
        setCargando(false);
      }
    };

    cargarTickets();
  }, []);

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Tickets de soporte</h1>
          <Link to="/tickets/nuevo" className="btn btn-primary">+ Nuevo ticket</Link>
        </div>

        {error && <p className="page-error">{error}</p>}

        {cargando ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : tickets.length === 0 ? (
          <div className="empty-state">No hay tickets registrados todavía.</div>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}