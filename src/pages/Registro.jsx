import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registro } from '../api/authService';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('CLIENTE');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await registro(nombre, email, password, rol);
      setExito(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ya existe una cuenta con ese email');
      } else if (err.response?.data?.errores) {
        const primerError = Object.values(err.response.data.errores)[0];
        setError(primerError);
      } else {
        setError('No se pudo crear la cuenta');
      }
    }
  };

  if (exito) {
    return (
      <div className="login-screen">
        <div className="login-panel">
          <div className="topbar-mark">HD</div>
          <h1>Cuenta creada</h1>
          <p className="subtitle">Redirigiendo a inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="topbar-mark">HD</div>
        <h1>Crear cuenta</h1>
        <p className="subtitle">Regístrate para abrir tickets de soporte</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className="field">
            <label>Tipo de cuenta</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="CLIENTE">Cliente</option>
              <option value="AGENTE">Agente de soporte</option>
            </select>
          </div>
          {error && <p className="page-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Crear cuenta</button>
        </form>
        <p className="login-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}