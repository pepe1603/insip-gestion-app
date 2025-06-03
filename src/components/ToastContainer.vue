<template>
    <div class="fixed inset-0 pointer-events-none z-30" aria-live="assertive" aria-atomic="true">
      
        <div
          v-for="config in toastPositions"
          :key="config.position"
          :class="config.containerClass"
          class="fixed inset-0 z-40"
        >
          <UiToast
            v-for="toast in positionedToasts(config.position)"
            :key="toast.id"
            v-bind="toast"
            @close="handleClose"
          />
        </div>
      
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import UiToast from './ui/UiToast.vue';
  import { useToastService } from '../services/toastService';
  
  const { toasts, removeToast } = useToastService();
  
  const handleClose = (id) => {
    removeToast(id);
  };
  
  const positionedToasts = computed(() => (position) => {
    return toasts.value.filter((toast) => toast.position === position);
  });
  
  // Declaramos las configuraciones de layout por posición
  const toastPositions = [
    {
      position: 'top-right',
      containerClass: 'top-2 right-0 flex flex-col items-end p-4 space-y-2',
    },
    {
      position: 'top-left',
      containerClass: 'top-2 left-0 flex flex-col items-start p-4 space-y-2',
    },
    {
      position: 'bottom-right',
      containerClass: 'bottom-2 right-0 flex flex-col-reverse items-end p-4 space-y-2',
    },
    {
      position: 'bottom-left',
      containerClass: 'bottom-2 left-0 flex flex-col-reverse items-start p-4 space-y-2',
    },
    {
      position: 'top-center',
      containerClass: 'top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center p-4 space-y-2',
    },
    {
      position: 'bottom-center',
      containerClass: 'bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center p-4 space-y-2',
    },
  ];
  </script>
  
  <style scoped>
  /* Nada necesario por ahora */
  </style>
  