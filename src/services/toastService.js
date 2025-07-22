import { ref, reactive } from 'vue';
import { createGlobalState } from '@vueuse/core';

const useToastServiceState = createGlobalState(() => {
  const toasts = ref([]);
  let nextId = 0;

  /**
   * Añade un nuevo toast a la cola.
   * @param {string} message - El mensaje principal del toast.
   * @param {Object} options - Objeto con opciones para configurar el toast.
   * @param {string} [options.type='info'] - Tipo de toast (success, error, warning, info, notify, ghost, purple-power, highlight).
   * @param {string} [options.position='bottom-right'] - Posición donde se mostrará el toast.
   * @param {number} [options.duration=7000] - Duración en milisegundos antes de que el toast se cierre automáticamente.
   * @param {string} [options.title=''] - Título opcional para el toast.
   * @param {boolean} [options.dismissible=true] - Si el toast puede ser cerrado manualmente por el usuario (muestra botón de cerrar).
   * @param {boolean} [options.showLeftBorder=true] - Si el toast debe mostrar un borde a la izquierda.
   * @returns {number} El ID del toast añadido.
   */
  const addToast = (message, options = {}) => {
    const id = nextId++;
    const defaultOptions = {
      type: 'info',
      position: 'bottom-right',
      duration: 12000, // Actualizado a 12 segundos por defecto
      title: '',
      dismissible: true, // Por defecto se puede cerrar
      showLeftBorder: true, // Por defecto muestra el borde izquierdo
    };

    const mergedOptions = { ...defaultOptions, ...options };

    toasts.value.push({
      id,
      message,
      type: mergedOptions.type,
      position: mergedOptions.position,
      duration: mergedOptions.duration,
      title: mergedOptions.title,
      dismissible: mergedOptions.dismissible,
      showLeftBorder: mergedOptions.showLeftBorder,
    });
    return id; // Devuelve el ID por si el llamador necesita cerrarlo manualmente
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  // Funciones de conveniencia para cada tipo de toast
  const notify = (message, options = {}) => {
    return addToast(message, { ...options, type: 'notify' });
  };
  const success = (message, options = {}) => {
    return addToast(message, { ...options, type: 'success' });
  };
  const error = (message, options = {}) => {
    return addToast(message, { ...options, type: 'error' });
  };
  const warning = (message, options = {}) => {
    return addToast(message, { ...options, type: 'warning' });
  };
  const info = (message, options = {}) => {
    return addToast(message, { ...options, type: 'info' });
  };
  
  // Nuevos tipos de toast
  const ghost = (message, options = {}) => {
    return addToast(message, { ...options, type: 'ghost' });
  };
  const purplePower = (message, options = {}) => {
    return addToast(message, { ...options, type: 'purple-power' });
  };
  const highlight = (message, options = {}) => {
    return addToast(message, { ...options, type: 'highlight' });
  };


  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    notify,
    ghost, // Exportar el nuevo tipo
    purplePower, // Exportar el nuevo tipo
    highlight, // Exportar el nuevo tipo
  };
});

export const useToastService = () => useToastServiceState();