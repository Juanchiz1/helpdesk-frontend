import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarTicketPorId, cambiarEstadoTicket } from '../api/ticketService';
import { listarComentarios, agregarComentario } from '../api/comentarioService';
import { obtenerUsuarioActual } from '../api/authService';
import Layout from '../components/Layout';

const iniciales = (nombre) =>
  nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
          ← volver al listado
        </button>

        <div className="ticket-detail">
          <div className="ticket-detail-stub" data-prioridad={ticket.prioridad}>
            <span className="stub-id">#{ticket.id}</span>
            <span className="stub-prioridad">{ticket.prioridad}</span>
          </div>
          <div className="ticket-detail-body">
            <span className={`badge badge-${ticket.estado}`}>{ticket.estado}</span>
            <h1 style={{ marginTop: 10 }}>{ticket.titulo}</h1>
            <p className="ticket-detail-desc">{ticket.descripcion}</p>
            <div className="ticket-detail-meta">
              <span>cliente: {ticket.clienteNombre}</span>
              <span className="divider" />
              <span>agente: {ticket.agenteNombre || 'sin asignar'}</span>
            </div>
          </div>
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

        <h2 className="section-title">Comentarios ({comentarios.length})</h2>
        <div className="comentarios-list">
          {comentarios.length === 0 ? (
            <div className="empty-state">Sin comentarios todavía.</div>
          ) : (
            comentarios.map((c) => (
              <div key={c.id} className="comentario">
                <div className="comentario-avatar">{iniciales(c.autorNombre)}</div>
                <div className="comentario-content">
                  <div className="comentario-header">
                    <span className="comentario-autor">{c.autorNombre}</span>
                  </div>
                  <p>{c.contenido}</p>
                </div>
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