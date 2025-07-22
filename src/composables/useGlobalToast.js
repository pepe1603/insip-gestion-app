// src/composables/useGlobalToast.js

// Ya no necesitamos 'inject' aquí.
// Simplemente asumimos que window.__global_toast__ ya está disponible
// después de que el plugin de Toast se haya instalado.
export const useGlobalToast = () => {
  // Asegurarse de que el servicio está disponible.
  // Podrías lanzar un error si no lo está, para depuración.
  if (!window.__global_toast__) {
    console.error("Error: Toast service not found on window.__global_toast__.");
    // Esto podría indicar que el toastPlugin no se ha instalado correctamente o en el orden adecuado.
    return undefined; // O lanzar un nuevo Error('Toast service not available');
  }
  return window.__global_toast__;
};