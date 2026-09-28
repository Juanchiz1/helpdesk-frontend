import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevoTicket from './pages/NuevoTicket';
import DetalleTicket from './pages/DetalleTicket';
import RutaProtegida from './routes/RutaProtegida';
import Registro from './pages/Registro';
import Usuarios from './pages/Usuarios';
import Metricas from './pages/Metricas';



function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />
      <Route path="/metricas" element={<Metricas />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        path="/tickets/nuevo"
        element={
          <RutaProtegida>
            <NuevoTicket />
          </RutaProtegida>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <RutaProtegida>
            <DetalleTicket />
          </RutaProtegida>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
  path="/usuarios"
  element={
    <RutaProtegida>
      <Usuarios />
    </RutaProtegida>
  }
/>
<Route
  path="/metricas"
  element={
    <RutaProtegida>
      <Metricas />
    </RutaProtegida>
  }
/>
    </Routes>
  );
}

export default App;