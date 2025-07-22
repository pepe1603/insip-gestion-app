<template>
  <div class="fixed inset-0 pointer-events-none z-30" aria-live="assertive" aria-atomic="true">
    <div
      v-for="config in toastPositions"
      :key="config.position"
      :class="config.containerClass"
      class="absolute flex flex-col pointer-events-auto"
      :style="config.style"
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
import UiToast from './ui/UiToast.vue'; // Asegúrate de que esta ruta sea correcta
import { useToastService } from '../services/toastService'; // Asegúrate de que esta ruta sea correcta

const { toasts, removeToast } = useToastService();

const handleClose = (id) => {
  removeToast(id);
};

const positionedToasts = computed(() => (position) => {
  return toasts.value.filter((toast) => toast.position === position);
});

const toastPositions = [
  {
    position: 'top-right',
    containerClass: 'top-4 right-4 items-end space-y-3',
    style: {}
  },
  {
    position: 'top-left',
    containerClass: 'top-4 left-4 items-start space-y-3',
    style: {}
  },
  {
    position: 'bottom-right',
    containerClass: 'bottom-4 right-4 items-end flex-col-reverse space-y-3',
    style: {}
  },
  {
    position: 'bottom-left',
    containerClass: 'bottom-4 left-4 items-start flex-col-reverse space-y-3',
    style: {}
  },
  {
    position: 'top-center',
    containerClass: 'top-4 items-center space-y-3',
    style: { left: '50%', transform: 'translateX(-50%)' }
  },
  {
    position: 'bottom-center',
    containerClass: 'bottom-4 items-center flex-col-reverse space-y-3',
    style: { left: '50%', transform: 'translateX(-50%)' }
  },
];
</script>

<style scoped>
/* Nada necesario por ahora */
</style>