<template>
  <div class="fixed inset-0 z-50 flex b flex-col items-center backdrop-blur-sm  justify-center transition-colors duration-300"
       :class="[isDarkTheme ? 'bg-dark-space-900 bg-opacity-50' : 'bg-dark-space-50 bg-opacity-80']">

    <div
      class="w-12 h-12 border-4 rounded-full animate-spin"
      :class="[isDarkTheme ? 'border-blue-400 border-t-transparent' : 'border-indigo-500 border-t-transparent']"
    ></div>

    <p v-if="message" class="mt-4 text-lg font-semibold"
       :class="[isDarkTheme ? 'text-gray-200' : 'text-gray-700']">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUiStore } from '../stores/uiStore'; // Asegúrate de que esta ruta es correcta

// Definimos las props que este componente puede recibir
const props = defineProps({
  message: {
    type: String,
    default: 'Cargando...', // Mensaje predeterminado si no se especifica
  },
});

const uiStore = useUiStore();

// Usamos una propiedad computada para determinar si el tema oscuro está activo
const isDarkTheme = computed(() => uiStore.currentTheme === 'dark');
</script>

<style scoped>
/* No se necesitan estilos adicionales aquí, Tailwind CSS maneja la mayoría */
</style>