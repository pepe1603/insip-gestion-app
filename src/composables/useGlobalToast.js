// composables/useGlobalToast.js
import { inject } from 'vue'; // ¡Necesitarás inject aquí!

export const useGlobalToast = () => {
  try {
    // Intenta acceder desde el contexto si estamos dentro de un componente
    return inject('$toast') || window.__global_toast__;
  } catch {
    return window.__global_toast__;
  }
};