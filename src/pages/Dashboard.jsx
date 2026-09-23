import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTickets } from '../api/ticketService';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { usuario, cerrarSesion } = useAuth();

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

  if (cargando) return <p>Cargando tickets...</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tickets de soporte</h1>
        <div>
          <span>{usuario.email} ({usuario.rol})</span>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>

      <Link to="/tickets/nuevo" className="btn-crear">+ Nuevo ticket</Link>

      {error && <p className="error">{error}</p>}

      <div className="ticket-list">
        {tickets.length === 0 ? (
          <p>No hay tickets registrados.</p>
        ) : (
          tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
        )}
      </div>
    </div>
  );
}