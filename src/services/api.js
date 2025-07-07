import axios from 'axios';
import { useSessionStore } from '../stores/useSessionStore';
// Importa tu composable para acceder al servicio de modales
import { useGlobalModal } from '@/composables/useGlobalModal'; // Ajusta la ruta si es necesario
// Importa tu modal de no autorizado
import UnauthorizedModal from '@/components/modals/UnauthorizedModal.vue'; // Ajusta la ruta si es necesario

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
      const { status, data } = error.response; // Extrae también 'data' para mensajes de error del backend

      // --- Manejo de 401: No Autorizado (Sesión Expirada/Inválida) ---
      if (status === 401) {
        const sessionStore = useSessionStore();
        // Llama a tu función que limpia la sesión y redirige al login
        await sessionStore.handleSessionExpired();
        // Puedes también mostrar un toast o modal aquí si lo deseas
        // Pero handleSessionExpired ya debería manejar la notificación al usuario
      }
      // --- Manejo de 403: Prohibido (Permisos Insuficientes) ---
      else if (status === 403) {
        // Accede al servicio de modales. Como `api.js` no es un componente Vue,
        // necesitamos usar `window.__global_modal__` o una función de inyección global
        // que hayas definido en tu `modalPlugin.js` si `useGlobalModal` no funciona directamente aquí.
        // Dada tu implementación de `useGlobalModal`, debería funcionar también fuera de un componente.
        const $modal = useGlobalModal();
        let errorMessage = 'No tienes permisos para realizar esta acción.';

        // Si el backend proporciona un mensaje de error específico, úsalo
        if (data && data.message) {
            errorMessage = data.message;
        }

        // Muestra el modal de no autorizado
        await $modal?.showModal(
          UnauthorizedModal,
          {
            message: errorMessage,
            // Puedes añadir más props si tu modal UnauthorizedModal las acepta
            // Por ejemplo, para ocultar el botón de "Iniciar Sesión" si ya está logueado:
            // isAuthenticated: true, // Esto no es necesario si el modal lo obtiene de Pinia
          },
          {
            title: 'Acceso Prohibido' // Título para el UiModal base
          }
        );
        // Opcional: Después de mostrar el modal, puedes redirigir al dashboard
        // o a la página anterior, pero a menudo con 403 en una API, solo notificas
        // y dejas al usuario en la página actual. Depende de tu UX.
        // router.push('/dashboard'); // Si tuvieras acceso al router aquí.
      }
      // --- Otros errores de estado ---
      // Aquí puedes añadir lógica para otros códigos de estado (ej. 404, 500)
      // O simplemente dejar que la promesa se rechace para que el componente que hizo la llamada lo maneje.
    }
    return Promise.reject(error); // Re-lanza el error para que el código que hizo la llamada pueda manejarlo
  }
);

export default api;