<template>
  <div class="p-6 text-center">
    <div class="text-yellow-500 dark:text-yellow-400 mb-4">
      <font-awesome-icon :icon="['fas', 'exclamation-triangle']" size="3x" /> 
    </div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">¡Advertencia!</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6 font-medium">
      {{ message }}
    </p>
    <button
      @click="closeAndProceed"
      class="px-6 py-3 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors dark:bg-yellow-600 dark:hover:bg-yellow-700"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: 'Entendido',
  },
  __onClose: Function,
});

const closeAndProceed = () => {
  if (props.__onClose) {
    props.__onClose();
  }
};
</script>

<style scoped>
/* No se necesitan estilos específicos aquí; Tailwind CSS maneja el diseño. */
</style>