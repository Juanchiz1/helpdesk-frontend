import api from './axiosConfig';

export const listarTickets = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

export const crearTicket = async (titulo, descripcion, prioridad, clienteId) => {
  const response = await api.post('/tickets', { titulo, descripcion, prioridad, clienteId });
  return response.data;
};

export const buscarTicketPorId = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};