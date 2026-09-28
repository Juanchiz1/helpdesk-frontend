import { Link } from 'react-router-dom';
import { calcularSlaVencido, horasRestantesSla } from '../utils/sla';

export default function TicketCard({ ticket }) {
  const vencido = calcularSlaVencido(ticket);
  const horasRestantes = horasRestantesSla(ticket);

  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className={`ticket-row ${vencido ? 'sla-vencido' : ''}`}
    >
      <div className="ticket-stub" data-prioridad={ticket.prioridad}>
        #{ticket.id}
      </div>
      <div className="ticket-row-body">
        <div className="ticket-row-top">
          <h3>{ticket.titulo}</h3>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {vencido && <span className="badge-sla">SLA vencido</span>}
            <span className={`badge badge-${ticket.estado}`}>{ticket.estado}</span>
          </div>
        </div>
        <p className="ticket-row-desc">{ticket.descripcion}</p>
        <div className="ticket-row-meta">
          <span>{ticket.clienteNombre}</span>
          {ticket.agenteNombre && <span>→ {ticket.agenteNombre}</span>}
          {ticket.estado === 'ABIERTO' && horasRestantes !== null && !vencido && (
            <span className={`sla-restante ${horasRestantes <= 1 ? 'urgente' : ''}`}>
              SLA: {horasRestantes}h restantes
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}