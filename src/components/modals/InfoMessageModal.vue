<script setup>
import { defineProps } from 'vue';

// Recibe la función de cierre inyectada por modalService
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: 'Entendido',
  },
  __onClose: Function, // Esta prop la inyecta el modalService para cerrar el modal
});

const closeAndProceed = () => {
  props.__onClose(); // Llama a la función de cierre
};
</script>

<template>
  <div class="text-center p-4">
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">{{ message }}</p>
    <button
      @click="closeAndProceed"
      class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      {{ buttonText }}
    </button>
  </div>
</template>