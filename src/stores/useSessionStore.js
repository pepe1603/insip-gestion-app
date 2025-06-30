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
          message: 'Tu sesión ha expirado.',
        },
        {
          title: 'Sesión expirada',
        }
      );

      if (result?.action === 'confirm' || result?.action === 'close') {
        localStorage.removeItem('token');
        router.push({ name: 'login' });
      }
    }
  }
});
