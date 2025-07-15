<template>
  <span
    :class="badgeClasses"
    class="inline-flex items-center ring-1 ring-inset leading-5 font-semibold rounded-full
           transform hover:scale-105 cursor-pointer transition duration-200 ease-in-out"
  >
    <div v-if="Icon" :class="iconWrapperClasses">
      <Icon :class="iconClasses" />
    </div>

    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

// Propiedades que el componente acepta
const props = defineProps({
  text: {
    type: String,
    default: 'Badge', // Ahora tiene un valor por defecto y ya no es requerido
  },
  color: {
    type: String,
    default: 'gray',
    validator(value) {
      // Colores válidos para el badge
      return ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'].includes(value)
    }
  },
  size: {
    type: String,
    default: 'sm',
    validator(value) {
      // Tamaños válidos para el badge
      return ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    }
  },
  icon: {
    type: [Object, Function],
    default: null
  },
})

// Clases predefinidas para los colores
const colorClasses = {
  gray: 'text-gray-700 bg-gray-50 ring-gray-600/10 hover:bg-gray-100 hover:ring-gray-500/20',
  red: 'text-red-700 bg-red-50 ring-red-600/10 hover:bg-red-100 hover:ring-red-500/20',
  yellow: 'text-yellow-700 bg-yellow-50 ring-yellow-600/10 hover:bg-yellow-100 hover:ring-yellow-500/20',
  green: 'text-green-700 bg-green-50 ring-green-600/10 hover:bg-green-100 hover:ring-green-500/20',
  blue: 'text-blue-700 bg-blue-50 ring-blue-600/10 hover:bg-blue-100 hover:ring-blue-500/20',
  indigo: 'text-indigo-700 bg-indigo-50 ring-indigo-600/10 hover:bg-indigo-100 hover:ring-indigo-500/20',
  purple: 'text-purple-700 bg-purple-50 ring-purple-600/10 hover:bg-purple-100 hover:ring-purple-500/20',
  pink: 'text-pink-700 bg-pink-50 ring-pink-600/10 hover:bg-pink-100 hover:ring-pink-500/20',
}

// Clases para el tamaño del texto y el padding del badge
const sizeTextAndPaddingClasses = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-2.5 py-1.5',
  lg: 'text-base px-3 py-2',
  xl: 'text-lg px-3.5 py-2.5',
}

// Clases para el tamaño del icono
const iconSizeClasses = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
}

// Clases para el margen del icono
const iconMarginClasses = {
  xs: 'mr-0.5',
  sm: 'mr-1',
  md: 'mr-1.5',
  lg: 'mr-2',
  xl: 'mr-2.5',
}

// Computar las clases dinámicamente según las propiedades
const badgeClasses = computed(() => {
  const colorClass = colorClasses[props.color] || colorClasses['gray']
  const sizeClass = sizeTextAndPaddingClasses[props.size] || sizeTextAndPaddingClasses['sm']

  return `${colorClass} ${sizeClass} ring-inset`
})

// Computar las clases del icono
const iconClasses = computed(() => {
  return iconSizeClasses[props.size] || iconSizeClasses['sm']
})

// Computar las clases del contenedor del icono (para el margen)
const iconWrapperClasses = computed(() => {
  return iconMarginClasses[props.size] || iconMarginClasses['sm']
})

const Icon = props.icon
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>