import api from './axiosConfig';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { token, email, rol }
};

export const registro = async (nombre, email, password, rol) => {
  const response = await api.post('/usuarios/registro', { nombre, email, password, rol });
  return response.data;
};

export const obtenerUsuarioActual = async () => {
  const response = await api.get('/usuarios/me');
  return response.data;
};

export const listarAgentes = async () => {
  const response = await api.get('/usuarios/agentes');
  return response.data;
};

export const listarUsuarios = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const cambiarEstadoActivo = async (id, activo) => {
  const response = await api.patch(`/usuarios/${id}/activo`, { activo });
  return response.data;
};