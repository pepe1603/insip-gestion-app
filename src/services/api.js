import axios from 'axios';
import { useSessionStore } from '../stores/useSessionStore';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 ) {
        const sessionStore = useSessionStore();
        await sessionStore.handleSessionExpired();
      }//validar para 0043 y mosatra modal correspopndiente de no autorizado
    }
    return Promise.reject(error);
  }
);

export default api;
