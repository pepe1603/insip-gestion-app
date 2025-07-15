<template>
  <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
    <li v-for="(tab, index) in tabs" :key="index" class="me-2">
      <router-link
        :to="tab.path"
        v-slot="{ isActive, isPending }"
        :class="[
          'inline-block p-4 rounded-t-lg',
          isActive || currentRoute.path === tab.path // Comprobación adicional
            ? 'text-indigo-600 bg-gray-100 dark:bg-gray-800 dark:text-indigo-500'
            : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
          tab.disabled ? 'text-gray-400 cursor-not-allowed dark:text-gray-500' : '',
        ]"
        :aria-current="(isActive || currentRoute.path === tab.path) ? 'page' : null"
        :aria-disabled="tab.disabled ? 'true' : null"
      >
        {{ tab.label }}
        <span v-if="isPending"> (Cargando...)</span>
      </router-link>
    </li>
  </ul>
  <div class="mt-4">
    <slot></slot>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

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