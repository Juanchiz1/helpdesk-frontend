import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend rechaza el token (expirado o inválido), limpia la sesión
// y manda al usuario a login en vez de dejarlo en una pantalla rota.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('rol');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;