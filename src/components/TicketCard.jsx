import { Link } from 'react-router-dom';

export default function TicketCard({ ticket }) {
  return (
    <Link to={`/tickets/${ticket.id}`} className="ticket-row" data-prioridad={ticket.prioridad}>
      <div className="ticket-row-body">
        <div className="ticket-row-top">
          <h3>{ticket.titulo}</h3>
          <span className={`badge badge-${ticket.estado}`}>{ticket.estado}</span>
        </div>
        <p className="ticket-row-desc">{ticket.descripcion}</p>
        <div className="ticket-row-meta">
          <span>#{ticket.id}</span>
          <span>{ticket.clienteNombre}</span>
          {ticket.agenteNombre && <span>→ {ticket.agenteNombre}</span>}
        </div>
      </div>
    </Link>
  );
}