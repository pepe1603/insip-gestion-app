// src/composables/useInactivityDetector.js

import { ref, onMounted, onUnmounted } from 'vue';
import { useGlobalModal } from './useGlobalModal';
import InactivityWarningModal from '../components/modals/InactivityWarningModal.vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

/**
 * Composable para detectar la inactividad del usuario o el abandono de la pestaña
 * y mostrar un modal de advertencia de sesión.
 */
export function useInactivityDetector() {

  // --- Configuración de Tiempos (puedes ajustar estos valores) ---
  const INACTIVITY_TIMEOUT_MS = 60 * 1000; // 60 segundos de inactividad
  const TAB_BACKGROUND_TIMEOUT_MS = 30 * 1000; // 30 segundos en segundo plano

  // --- Variables Internas ---
  let inactivityTimer = null;
  let tabBackgroundTimer = null;
  let inactivityModalId = null;
  let isModalOpen = false;

  const $modal = useGlobalModal();
  const authStore = useAuthStore();
  const router = useRouter();

  // --- Funciones de Control de Temporizadores y Modales ---

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    if (!isModalOpen) {
      inactivityTimer = setTimeout(() => {
        showInactivityModal('inactivity');
      }, INACTIVITY_TIMEOUT_MS);
    }
  };

  const resetTabBackgroundTimer = () => {
    clearTimeout(tabBackgroundTimer);
    if (!document.hidden && !isModalOpen) {
       resetInactivityTimer();
    } else if (document.hidden) {
      tabBackgroundTimer = setTimeout(() => {
        showInactivityModal('tab_background');
      }, TAB_BACKGROUND_TIMEOUT_MS);
    }
  };

  const showInactivityModal = async (reason) => {
    // Si el usuario no está autenticado, no mostramos el modal de inactividad
    // ya que no hay una sesión activa para mantener o cerrar.
    if (!authStore.isAuthenticated) {
        console.log('Usuario no autenticado, omitiendo modal de inactividad.');
        return;
    }

    if (isModalOpen) return;

    isModalOpen = true;
    clearTimeout(inactivityTimer);
    clearTimeout(tabBackgroundTimer);

    let title = '';
    let message = '';

    if (reason === 'inactivity') {
      title = 'Inactividad Detectada';
      message = 'No hemos detectado actividad en un tiempo. Tu sesión podría expirar pronto. ¿Deseas continuar?';
    } else if (reason === 'tab_background') {
      title = 'Pestaña en Segundo Plano';
      message = 'Has estado fuera de esta pestaña por un tiempo. ¿Deseas mantener tu sesión activa?';
    }

    try {
      const result = await $modal?.showModal(
        InactivityWarningModal,
        { title, message },
        {
          title: 'Advertencia de Sesión',
          closeOnClickOutside: false
        }
      );

      inactivityModalId = result.id;

      if (result?.action === 'confirm' && result?.payload?.action === 'continue_session') {
        console.log('Usuario eligió continuar la sesión.');
        // Opcional: Aquí podrías añadir una llamada para refrescar el token si aplica
        // await authStore.refreshToken();
        resetInactivityTimer();
      } else if (result?.action === 'cancel' && result?.payload?.action === 'logout') {
        console.log('Usuario eligió cerrar sesión.');
        // Solo intentar logout en el backend si el usuario está autenticado
        if (authStore.isAuthenticated) {
            try {
                await authStore.logout(); // Cierra sesión en el backend y limpia datos locales
                console.log('Logout completo ejecutado.');

            } catch (error) {
                console.warn('Fallo al cerrar sesión en el backend, limpiando localmente:', error);
                authStore.clearAuthData(); // Asegurarse de limpiar incluso si el backend falla
            }
        } else {
            console.log('Usuario ya no autenticado, solo limpiando datos locales.');
            authStore.clearAuthData(); // Solo limpia datos locales si no estaba autenticado
        }
        router.push({ name: 'login' }); // Redirige siempre al login después de la acción de cierre
      }
    } catch (error) {
      console.error("Error al manejar el modal de inactividad o durante el proceso de logout:", error);
      // En caso de cualquier error inesperado, asegúrate de limpiar y redirigir
      if (authStore.isAuthenticated) { // Solo si todavía tenemos un token que podría ser inválido
          authStore.clearAuthData();
      }
      router.push({ name: 'login' });
    } finally {
      isModalOpen = false;
      inactivityModalId = null;
      resetInactivityTimer();
    }
  };

  const hideInactivityModal = () => {
    if (isModalOpen && inactivityModalId) {
      $modal?.hideModal(inactivityModalId);
      isModalOpen = false;
      inactivityModalId = null;
      resetInactivityTimer();
    }
  };

  // --- Configuración y Limpieza de Event Listeners ---

  const setupActivityListeners = () => {
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('mousedown', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
    window.addEventListener('touchstart', resetInactivityTimer);
  };

  const cleanupActivityListeners = () => {
    window.removeEventListener('mousemove', resetInactivityTimer);
    window.removeEventListener('mousedown', resetInactivityTimer);
    window.removeEventListener('keypress', resetInactivityTimer);
    window.removeEventListener('scroll', resetInactivityTimer);
    window.removeEventListener('touchstart', resetInactivityTimer);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      resetTabBackgroundTimer();
    } else {
      clearTimeout(tabBackgroundTimer);
      hideInactivityModal();
      resetInactivityTimer();
    }
  };

  // --- Ciclo de Vida del Composable ---

  onMounted(() => {
    setupActivityListeners();
    resetInactivityTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onUnmounted(() => {
    cleanupActivityListeners();
    clearTimeout(inactivityTimer);
    clearTimeout(tabBackgroundTimer);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    hideInactivityModal();
  });

  return {};
}