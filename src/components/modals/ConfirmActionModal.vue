<!-- src/components/modals/ConfirmActionModal.vue -->
<script setup>
import { defineProps, defineEmits } from 'vue';

// Definimos las props que este modal de confirmación puede recibir
const props = defineProps({
  message: {
    type: String,
    default: '¿Estás seguro de que quieres realizar esta acción?',
  },
  confirmText: {
    type: String,
    default: 'Confirmar',
  },
  cancelText: {
    type: String,
    default: 'Cancelar',
  },
});

// Definimos los eventos que este componente puede emitir
const emit = defineEmits(['confirm', 'cancel', 'close']);

// Función para manejar la confirmación
const handleConfirm = () => {
  emit('confirm'); // Emitimos el evento 'confirm'
  emit('close');    // Y también el evento 'close' para cerrar el modal
};

// Función para manejar la cancelación
const handleCancel = () => {
  emit('cancel'); // Emitimos el evento 'cancel'
  emit('close');    // Y también el evento 'close' para cerrar el modal
};
</script>

<template>
  <div class="text-center p-4">
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">{{ message }}</p>
    <div class="flex justify-center gap-4 mt-6">
      <button
        @click="handleCancel"
        class="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        {{ cancelText }}
      </button>
      <button
        @click="handleConfirm"
        class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {{ confirmText }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* No se necesitan estilos específicos aquí, Tailwind CSS es suficiente */
</style>