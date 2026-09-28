import { useEffect, useState } from 'react';
import { listarTickets } from '../api/ticketService';
import { calcularSlaVencido } from '../utils/sla';
import Layout from '../components/Layout';

const COLORES_ESTADO = {
  ABIERTO: 'var(--estado-abierto)',
  EN_PROGRESO: 'var(--estado-progreso)',
  RESUELTO: 'var(--estado-resuelto)',
  CERRADO: 'var(--estado-cerrado)',
};

const COLORES_PRIORIDAD = {
  ALTA: 'var(--prioridad-alta)',
  MEDIA: 'var(--prioridad-media)',
  BAJA: 'var(--prioridad-baja)',
};

export default function Metricas() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listarTickets()
      .then(setTickets)
      .catch(() => setError('No se pudieron cargar las métricas'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Layout><div className="page">Cargando...</div></Layout>;

  const total = tickets.length;
  const vencidos = tickets.filter(calcularSlaVencido).length;
  const sinAsignar = tickets.filter((t) => !t.agenteId && t.estado !== 'CERRADO').length;

  const porEstado = ['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'].map((estado) => ({
    label: estado,
    valor: tickets.filter((t) => t.estado === estado).length,
    color: COLORES_ESTADO[estado],
  }));

  const porPrioridad = ['ALTA', 'MEDIA', 'BAJA'].map((prioridad) => ({
    label: prioridad,
    valor: tickets.filter((t) => t.prioridad === prioridad).length,
    color: COLORES_PRIORIDAD[prioridad],
  }));

  const maxEstado = Math.max(...porEstado.map((e) => e.valor), 1);
  const maxPrioridad = Math.max(...porPrioridad.map((p) => p.valor), 1);

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Métricas</h1>
        </div>

        {error && <p className="page-error">{error}</p>}

        <div className="metricas-grid">
          <div className="metrica-card">
            <div className="valor">{total}</div>
            <div className="etiqueta">Tickets totales</div>
          </div>
          <div className={`metrica-card ${vencidos > 0 ? 'alerta' : ''}`}>
            <div className="valor">{vencidos}</div>
            <div className="etiqueta">SLA vencido</div>
          </div>
          <div className="metrica-card">
            <div className="valor">{sinAsignar}</div>
            <div className="etiqueta">Sin asignar</div>
          </div>
          <div className="metrica-card">
            <div className="valor">{porEstado.find((e) => e.label === 'RESUELTO')?.valor || 0}</div>
            <div className="etiqueta">Resueltos</div>
          </div>
        </div>

        <h2 className="section-title">Por estado</h2>
        <div className="barra-grupo">
          {porEstado.map((item) => (
            <div className="barra-fila" key={item.label}>
              <span className="barra-etiqueta">{item.label.replace('_', ' ').toLowerCase()}</span>
              <div className="barra-track">
                <div
                  className="barra-fill"
                  style={{
                    width: `${(item.valor / maxEstado) * 100}%`,
                    background: item.color,
                  }}
                />
              </div>
              <span className="barra-valor">{item.valor}</span>
            </div>
          ))}
        </div>

        <h2 className="section-title">Por prioridad</h2>
        <div className="barra-grupo">
          {porPrioridad.map((item) => (
            <div className="barra-fila" key={item.label}>
              <span className="barra-etiqueta">{item.label.toLowerCase()}</span>
              <div className="barra-track">
                <div
                  className="barra-fill"
                  style={{
                    width: `${(item.valor / maxPrioridad) * 100}%`,
                    background: item.color,
                  }}
                />
              </div>
              <span className="barra-valor">{item.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}