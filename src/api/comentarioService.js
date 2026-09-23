import api from './axiosConfig';

export const listarComentarios = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/comentarios`);
  return response.data;
};

export const agregarComentario = async (ticketId, contenido, autorId) => {
  const response = await api.post(`/tickets/${ticketId}/comentarios`, { contenido, autorId });
  return response.data;
};