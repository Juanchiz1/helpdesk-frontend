import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <div>
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-mark">HD</div>
          <span>Helpdesk</span>
        </div>
        {usuario && (
          <div className="topbar-user">
            <div className="topbar-user-info">
              <span className="topbar-user-email">{usuario.email}</span>
              <span className="topbar-user-rol">{usuario.rol}</span>
            </div>
            <button className="btn btn-ghost" onClick={handleCerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}