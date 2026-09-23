import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarTicketPorId, cambiarEstadoTicket } from '../api/ticketService';
import { listarComentarios, agregarComentario } from '../api/comentarioService';
import { obtenerUsuarioActual } from '../api/authService';
import Layout from '../components/Layout';

export default function DetalleTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      const [datosTicket, datosComentarios] = await Promise.all([
        buscarTicketPorId(id),
        listarComentarios(id),
      ]);
      setTicket(datosTicket);
      setComentarios(datosComentarios);
    } catch (err) {
      setError('No se pudo cargar el ticket');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const handleComentar = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      const usuario = await obtenerUsuarioActual();
      await agregarComentario(id, nuevoComentario, usuario.id);
      setNuevoComentario('');
      cargarDatos();
    } catch (err) {
      setError('No se pudo agregar el comentario');
    }
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      await cambiarEstadoTicket(id, nuevoEstado);
      cargarDatos();
    } catch (err) {
      setError('No se pudo cambiar el estado');
    }
  };

  if (cargando) return <Layout><div className="page">Cargando...</div></Layout>;
  if (!ticket) return <Layout><div className="page">Ticket no encontrado</div></Layout>;

  return (
    <Layout>
      <div className="page">
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>

        <div className="ticket-detail-header">
          <span className={`badge badge-${ticket.estado}`}>{ticket.estado}</span>
          <h1>{ticket.titulo}</h1>
          <p className="ticket-detail-desc">{ticket.descripcion}</p>
          <div className="ticket-detail-meta">
            <span>#{ticket.id}</span>
            <span>prioridad: {ticket.prioridad}</span>
            <span>cliente: {ticket.clienteNombre}</span>
            {ticket.agenteNombre && <span>agente: {ticket.agenteNombre}</span>}
          </div>
          <div className="ticket-detail-estado">
            <label>Cambiar estado</label>
            <select value={ticket.estado} onChange={(e) => handleCambiarEstado(e.target.value)}>
              <option value="ABIERTO">Abierto</option>
              <option value="EN_PROGRESO">En progreso</option>
              <option value="RESUELTO">Resuelto</option>
              <option value="CERRADO">Cerrado</option>
            </select>
          </div>
        </div>

        <h2 className="section-title">Comentarios</h2>
        <div className="comentarios-list">
          {comentarios.length === 0 ? (
            <div className="empty-state">Sin comentarios todavía.</div>
          ) : (
            comentarios.map((c) => (
              <div key={c.id} className="comentario">
                <div className="comentario-header">
                  <span className="comentario-autor">{c.autorNombre}</span>
                </div>
                <p>{c.contenido}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleComentar} className="comentario-form">
          <textarea
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Comentar</button>
        </form>

        {error && <p className="page-error">{error}</p>}
      </div>
    </Layout>
  );
}