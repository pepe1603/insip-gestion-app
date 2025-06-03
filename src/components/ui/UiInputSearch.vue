<template>
  <div class="relative flex items-center w-full max-w-md">
    <div v-if="Icon" class="absolute left-4 text-xl text-gray-600 dark:text-gray-300">
      <Icon class="w-5 h-5" />
    </div>

    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      type="text"
      :aria-label="placeholder"
      class="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';

// Propiedades del componente
const props = defineProps({
  placeholder: {
    type: String,
    default: "Search...",
  },
  icon: {
    type: [Object, Function], // Permitir tanto objetos como funciones (para componentes dinámicos)
    default: MagnifyingGlassIcon, // Asignar el icono directamente sin necesidad de definirlo como async
  },
  modelValue: String, // Agregamos la prop modelValue
});

const emit = defineEmits(['update:modelValue']); // Definimos el evento que emitiremos

// Usamos el icono directamente sin definirlo como un componente asincrónico
const Icon = props.icon;
</script>

<style scoped>
/* Aquí puedes añadir más estilos si los necesitas */
</style>