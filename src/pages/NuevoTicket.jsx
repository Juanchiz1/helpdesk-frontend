import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearTicket } from '../api/ticketService';
import { obtenerUsuarioActual } from '../api/authService';

export default function NuevoTicket() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('MEDIA');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const usuario = await obtenerUsuarioActual();
      await crearTicket(titulo, descripcion, prioridad, usuario.id);
      navigate('/dashboard');
    } catch (err) {
      setError('No se pudo crear el ticket');
    }
  };

  return (
    <div className="nuevo-ticket-container">
      <h1>Nuevo ticket</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe el problema"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="BAJA">Baja</option>
          <option value="MEDIA">Media</option>
          <option value="ALTA">Alta</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit">Crear ticket</button>
      </form>
    </div>
  );
}