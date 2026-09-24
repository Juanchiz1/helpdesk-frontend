import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTickets } from '../api/ticketService';
import Layout from '../components/Layout';
import TicketCard from '../components/TicketCard';

const ESTADOS = ['TODOS', 'ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'];

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
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

  const ticketsFiltrados =
    filtro === 'TODOS' ? tickets : tickets.filter((t) => t.estado === filtro);

  const contar = (estado) =>
    estado === 'TODOS' ? tickets.length : tickets.filter((t) => t.estado === estado).length;

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Tickets de soporte</h1>
          <Link to="/tickets/nuevo" className="btn btn-primary">+ Nuevo ticket</Link>
        </div>

        {error && <p className="page-error">{error}</p>}

        <div className="filtros-estado">
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              className={`filtro-tab ${filtro === estado ? 'activo' : ''}`}
              onClick={() => setFiltro(estado)}
            >
              {estado.replace('_', ' ').toLowerCase()} ({contar(estado)})
            </button>
          ))}
        </div>

        {cargando ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : ticketsFiltrados.length === 0 ? (
          <div className="empty-state">No hay tickets en este estado.</div>
        ) : (
          <div className="ticket-list">
            {ticketsFiltrados.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}