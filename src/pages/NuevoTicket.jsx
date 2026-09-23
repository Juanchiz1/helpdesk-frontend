import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearTicket } from '../api/ticketService';
import { obtenerUsuarioActual } from '../api/authService';
import Layout from '../components/Layout';

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
    <Layout>
      <div className="page" style={{ maxWidth: 520 }}>
        <div className="page-header">
          <h1>Nuevo ticket</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Prioridad</label>
            <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
          {error && <p className="page-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Crear ticket</button>
        </form>
      </div>
    </Layout>
  );
}