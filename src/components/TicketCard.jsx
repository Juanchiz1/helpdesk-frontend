import { Link } from 'react-router-dom';

const coloresEstado = {
  ABIERTO: '#e74c3c',
  EN_PROGRESO: '#f39c12',
  RESUELTO: '#27ae60',
  CERRADO: '#95a5a6',
};

export default function TicketCard({ ticket }) {
  return (
    <Link to={`/tickets/${ticket.id}`} className="ticket-card">
      <div className="ticket-card-header">
        <h3>{ticket.titulo}</h3>
        <span
          className="ticket-badge"
          style={{ backgroundColor: coloresEstado[ticket.estado] }}
        >
          {ticket.estado}
        </span>
      </div>
      <p className="ticket-descripcion">{ticket.descripcion}</p>
      <div className="ticket-meta">
        <span>Prioridad: {ticket.prioridad}</span>
        <span>Cliente: {ticket.clienteNombre}</span>
        {ticket.agenteNombre && <span>Agente: {ticket.agenteNombre}</span>}
      </div>
    </Link>
  );
}