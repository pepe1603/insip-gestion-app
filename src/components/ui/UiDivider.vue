<template>
  <div class="relative flex items-center w-full my-4">
    <div :class="[lineColorClass, 'flex-grow border-t']"></div>

    <div
      v-if="label"
      :class="[
        textSizeClass,
        textColorClass,
        'mx-4 font-medium'
      ]"
    >
      {{ label }}
    </div>

    <div v-if="icon" :class="['mx-4', iconSizeClass]">
      <component :is="Icon" :class="[iconColorClass]" />
    </div>

    <div :class="[lineColorClass, 'flex-grow border-t']"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Propiedades del componente
const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  color: {
    type: String,
    default: 'gray',
    validator(value) {
      return ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'].includes(value);
    },
  },
  size: {
    type: String,
    default: 'sm', // Valor por defecto
    validator(value) {
      return ['xs', 'sm', 'md', 'lg', 'xl'].includes(value);
    },
  },
});

// Asignar el icono
const Icon = props.icon;

// Clases computadas para el tamaño del texto
const textSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs';
    case 'sm':
      return 'text-sm';
    case 'md':
      return 'text-base';
    case 'lg':
      return 'text-lg';
    case 'xl':
      return 'text-xl';
    default:
      return 'text-sm'; // Default
  }
});

// Clases computadas para el tamaño del icono
const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-3 h-3'; // Icono más pequeño para 'xs'
    case 'sm':
      return 'w-4 h-4';
    case 'md':
      return 'w-5 h-5';
    case 'lg':
      return 'w-6 h-6';
    case 'xl':
      return 'w-7 h-7'; // Icono más grande para 'xl'
    default:
      return 'w-4 h-4'; // Default
  }
});

// Clases computadas para el color del texto
const textColorClass = computed(() => {
  return `text-${props.color}-600 dark:text-${props.color}-300`;
});

// Clases computadas para el color del icono
const iconColorClass = computed(() => {
  return `text-${props.color}-600 dark:text-${props.color}-300`;
});

// Clases computadas para el color de la línea divisora
const lineColorClass = computed(() => {
  return `border-${props.color}-300 dark:border-${props.color}-600`;
});
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>