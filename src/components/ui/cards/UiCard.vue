<template>
  <div
    :class="[colorClasses[color]]"
    class="relative min-h-36 p-6 flex items-center justify-center text-2xl font-bold rounded-2xl cursor-pointer
           overflow-hidden group"
  >
    <div class="relative z-10 text-white">
      <slot></slot>
    </div>

    <div
      :class="[beforeAfterBaseClasses, colorClasses[color + 'Light']]"
      class="absolute top-0 right-0 rounded-tr-2xl rounded-bl-[100%] transition-all duration-500
             group-hover:w-full group-hover:h-full group-hover:rounded-2xl"
    ></div>

    <div
      :class="[beforeAfterBaseClasses, colorClasses[color + 'Light']]"
      class="absolute bottom-0 left-0 rounded-bl-2xl rounded-tr-[100%] transition-all duration-500
             group-hover:w-full group-hover:h-full group-hover:rounded-2xl
             group-hover:backdrop-blur-sm z-10 bg-transparent" >
      <span
        v-if="$slots.hoverContent"
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300
               text-gray-800 dark:text-gray-900"
      >
        <slot name="hoverContent"></slot>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'gray',
    validator: (value) => ['gray', 'blue', 'green', 'purple', 'indigo', 'pink'].includes(value), // 'pink' añadido
  },
});

// --- Clases Tailwind para colores ---
// Ajustadas a tonos más suaves (p. ej., -300 o -200 para base, -100 para light)
const colorClasses = {
  // Colores principales del fondo de la tarjeta (más suaves)
  gray: 'bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ',
  blue: 'bg-blue-300',
  green: 'bg-green-300',
  purple: 'bg-purple-300',
  indigo: 'bg-indigo-300',
  pink: 'bg-pink-300', // Color 'pink' añadido

  // Colores más claros para los pseudo-elementos (::before, ::after)
  grayLight: 'bg-gray-200',
  blueLight: 'bg-blue-100',
  greenLight: 'bg-green-100',
  purpleLight: 'bg-purple-100',
  indigoLight: 'bg-indigo-100',
  pinkLight: 'bg-pink-100', // Color 'pinkLight' añadido
};

const beforeAfterBaseClasses = 'w-[20%] h-[20%] flex items-center justify-center';
</script>

<style scoped>
/* No se necesitan estilos <style scoped> adicionales. */
</style>