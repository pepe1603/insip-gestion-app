import { ref, reactive } from 'vue';
import { createGlobalState } from '@vueuse/core';

const useToastServiceState = createGlobalState(() => {
  const toasts = ref([]);
  let nextId = 0;

  const addToast = (message, type = 'info', position = 'top-right', duration = 3000, title = '') => {
    const id = nextId++;
    toasts.value.push({ id, message, type, position, duration, title });
    return id; // Return the ID in case the caller needs to manually close it
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const notify = (message, options = {}) => {
    return addToast(message, 'notify', options.position, options.duration, options.title);
  };
  const success = (message, options = {}) => {
    return addToast(message, 'success', options.position, options.duration, options.title);
  };

  const error = (message, options = {}) => {
    return addToast(message, 'error', options.position, options.duration, options.title);
  };

  const warning = (message, options = {}) => {
    return addToast(message, 'warning', options.position, options.duration, options.title);
  };

  const info = (message, options = {}) => {
    return addToast(message, 'info', options.position, options.duration, options.title);
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
  };
});

export const useToastService = () => useToastServiceState();
