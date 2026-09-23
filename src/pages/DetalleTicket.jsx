import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarTicketPorId, cambiarEstadoTicket } from '../api/ticketService';
import { listarComentarios, agregarComentario } from '../api/comentarioService';
import { obtenerUsuarioActual } from '../api/authService';

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

  if (cargando) return <p>Cargando...</p>;
  if (!ticket) return <p>Ticket no encontrado</p>;

  return (
    <div className="detalle-ticket-container">
      <button onClick={() => navigate('/dashboard')}>← Volver</button>

      <h1>{ticket.titulo}</h1>
      <p>{ticket.descripcion}</p>
      <div className="ticket-info">
        <span>Estado: {ticket.estado}</span>
        <span>Prioridad: {ticket.prioridad}</span>
        <span>Cliente: {ticket.clienteNombre}</span>
        {ticket.agenteNombre && <span>Agente: {ticket.agenteNombre}</span>}
      </div>

      <div className="cambiar-estado">
        <label>Cambiar estado: </label>
        <select value={ticket.estado} onChange={(e) => handleCambiarEstado(e.target.value)}>
          <option value="ABIERTO">Abierto</option>
          <option value="EN_PROGRESO">En progreso</option>
          <option value="RESUELTO">Resuelto</option>
          <option value="CERRADO">Cerrado</option>
        </select>
      </div>

      <h2>Comentarios</h2>
      <div className="comentarios-list">
        {comentarios.length === 0 ? (
          <p>Sin comentarios todavía.</p>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} className="comentario">
              <strong>{c.autorNombre}</strong>
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
        <button type="submit">Comentar</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}