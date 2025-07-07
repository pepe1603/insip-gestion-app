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

<script setup>

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: 'Entendido',
  },
  // La función inyectada por modalService para cerrar el modal y resolver la promesa
  __onClose: Function,
});

const closeAndProceed = () => {
  // Aquí es donde necesitamos asegurar que el modal se cierra y la promesa se resuelve.
  // La función __onClose inyectada ya está diseñada para hacer ambas cosas.
  if (props.__onClose) {
    props.__onClose(); // Llama a la función inyectada para resolver la promesa y ocultar el modal
  }
};
</script>

<style scoped>
/* No se necesitan estilos específicos aquí, Tailwind CSS es suficiente */
</style>