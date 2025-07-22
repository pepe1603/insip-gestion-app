// src/composables/useGlobalModal.js

// Ya no necesitamos 'inject' aquí.
// Simplemente asumimos que window.__global_modal__ ya está disponible
// después de que el plugin de Modal se haya instalado.
export const useGlobalModal = () => {
  // Asegurarse de que el servicio está disponible.
  if (!window.__global_modal__) {
    console.error("Error: Modal service not found on window.__global_modal__.");
    // Esto podría indicar que el modalPlugin no se ha instalado correctamente o en el orden adecuado.
    return undefined; // O lanzar un new Error('Modal service not available');
  }
  return window.__global_modal__;
};