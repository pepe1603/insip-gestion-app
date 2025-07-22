<template>
  <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
    <li v-for="(tab, index) in tabs" :key="index" class="me-2">
      <router-link
        :to="tab.path"
        v-slot="{ isPending }" :class="[
          'inline-block p-4 rounded-t-lg',
          currentRoute.path === tab.path // <--- SOLAMENTE usamos currentRoute.path para el estado activo
            ? 'text-indigo-600 bg-gray-100 dark:bg-gray-800 dark:text-indigo-500'
            : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
          tab.disabled ? 'text-gray-400 cursor-not-allowed dark:text-gray-500' : '',
        ]"
        :aria-current="currentRoute.path === tab.path ? 'page' : null" :aria-disabled="tab.disabled ? 'true' : null"
      >
        {{ tab.label }}
        <span v-if="isPending"> (Cargando...)</span> </router-link>
    </li>
  </ul>
  <div class="mt-4">
    <slot></slot>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'; // Aunque no se usa directamente en el script debido a la prop, es buena práctica mantenerlo si currentRoute no está *siempre* garantizado que se pase. Sin embargo, según tu diseño, sí lo está.

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => [],
  },
  currentRoute: {
    type: Object,
    required: true,
  },
});

// No necesitamos usar useRoute aquí ya que lo pasamos como prop
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si lo deseas */
</style>