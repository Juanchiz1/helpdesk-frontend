import { useEffect, useState } from 'react';
import { listarUsuarios, cambiarEstadoActivo } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function Usuarios() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const datos = await listarUsuarios();
      setUsuarios(datos);
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario?.rol === 'ADMIN') cargar();
    else setCargando(false);
  }, []);

  const handleToggle = async (id, activoActual) => {
    try {
      await cambiarEstadoActivo(id, !activoActual);
      cargar();
    } catch (err) {
      setError('No se pudo actualizar el usuario');
    }
  };

  if (usuario?.rol !== 'ADMIN') {
    return (
      <Layout>
        <div className="page">
          <div className="acceso-denegado">
            No tienes permiso para ver esta página.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page" style={{ maxWidth: 860 }}>
        <div className="page-header">
          <h1>Usuarios</h1>
        </div>

        {error && <p className="page-error">{error}</p>}

        {cargando ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : (
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><span className="rol-tag">{u.rol}</span></td>
                  <td>
                    <span className={u.activo ? 'estado-activo' : 'estado-inactivo'}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-toggle" onClick={() => handleToggle(u.id, u.activo)}>
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}