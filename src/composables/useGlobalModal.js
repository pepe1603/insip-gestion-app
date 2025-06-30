// src/composables/useGlobalModal.js
import { inject } from 'vue';

export const useGlobalModal = () => {
  try {
    // Intenta acceder desde el contexto si estamos dentro de un componente
    return inject('$modal') || window.__global_modal__;
  } catch {
    return window.__global_modal__;
  }
};
