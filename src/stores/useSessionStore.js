// src/stores/session.js
import { defineStore } from 'pinia';
import router from '@/router';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal.vue';
import { useGlobalModal } from '@/composables/useGlobalModal';

export const useSessionStore = defineStore('session', {
  actions: {
    async handleSessionExpired() {
      const $modal = useGlobalModal(); // Esto ya debería funcionar

      const result = await $modal?.showModal(
        SessionExpiredModal,
        {
          message: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.',
        },
        {
          title: 'Sesión expirada',
          closeOnClickOutside: false, // Probablemente quieras que no se cierre haciendo clic fuera
   
        }
      );

// Una vez que el usuario interactúa con el modal y este se cierra,
      // la promesa de showModal se resuelve (después de la animación de salida).
      // El 'result' contendrá la acción que el usuario realizó (ej. 'confirm' de un botón, o 'close' si se cerró por ESC).

      // En este caso, ya sea que el usuario haga clic en un botón de "Aceptar" (que dispararía 'confirm' o '__onClose')
      // o cierre el modal de alguna otra forma (ESC, lo que resultaría en 'close'),
      // siempre limpiaremos el token y redirigiremos.
      if (result?.action === 'confirm' || result?.action === 'close') {
        localStorage.removeItem('token'); // Limpia el token almacenado
        // Aquí podrías también limpiar otros estados de usuario en tu store de autenticación si tienes uno separado
        router.push({ name: 'login' }); // Redirige a la página de inicio de sesión
      }
      // No necesitas un 'else' aquí, ya que cualquier interacción resultará en un cierre y la subsiguiente redirección.

    }
  }
});
