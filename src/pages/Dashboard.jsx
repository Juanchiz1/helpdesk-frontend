import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTickets } from '../api/ticketService';
import Layout from '../components/Layout';
import TicketCard from '../components/TicketCard';

const ESTADOS = ['TODOS', 'ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'];

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');
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

  const ticketsFiltrados = tickets
    .filter((t) => filtroEstado === 'TODOS' || t.estado === filtroEstado)
    .filter((t) => filtroPrioridad === 'TODAS' || t.prioridad === filtroPrioridad)
    .filter((t) => {
      const texto = busqueda.trim().toLowerCase();
      if (!texto) return true;
      return (
        t.titulo.toLowerCase().includes(texto) ||
        t.descripcion.toLowerCase().includes(texto)
      );
    });

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

        <div className="controles-lista">
          <input
            type="text"
            className="buscador"
            placeholder="Buscar por título o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="select-prioridad"
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
          >
            <option value="TODAS">Toda prioridad</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>

        <div className="filtros-estado">
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              className={`filtro-tab ${filtroEstado === estado ? 'activo' : ''}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado.replace('_', ' ').toLowerCase()} ({contar(estado)})
            </button>
          ))}
        </div>

        {cargando ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : ticketsFiltrados.length === 0 ? (
          <div className="empty-state">No hay tickets que coincidan con los filtros.</div>
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