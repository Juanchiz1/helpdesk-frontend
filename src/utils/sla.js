const HORAS_LIMITE = {
  ALTA: 4,
  MEDIA: 24,
  BAJA: 72,
};

export function calcularSlaVencido(ticket) {
  if (ticket.estado !== 'ABIERTO') return false;

  const horasLimite = HORAS_LIMITE[ticket.prioridad];
  if (!horasLimite) return false;

  const fechaCreacion = new Date(ticket.fechaCreacion);
  const horasTranscurridas = (Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60);

  return horasTranscurridas > horasLimite;
}

export function horasRestantesSla(ticket) {
  const horasLimite = HORAS_LIMITE[ticket.prioridad];
  if (!horasLimite) return null;

  const fechaCreacion = new Date(ticket.fechaCreacion);
  const horasTranscurridas = (Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60);

  return Math.round(horasLimite - horasTranscurridas);
}