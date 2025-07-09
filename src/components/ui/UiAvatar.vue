<template>
  <div :class="avatarClasses">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="object-cover w-full h-full rounded-full"
    />

    <div v-else class="flex items-center justify-center w-full h-full bg-gray-300 text-white rounded-full">
      {{ initials }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Propiedades del componente
const props = defineProps({
  src: {
    type: String,
    default: null,  // Fuente de la imagen del avatar
  },
  alt: {
    type: String,
    default: 'Avatar', // Texto alternativo
  },
  size: {
    type: String,
    default: 'medium',   // Tamaño predeterminado (small, medium, large)
    validator(value) {
      // Validación de los tamaños disponibles
      return ['small', 'medium', 'large'].includes(value)
    }
  },
  name: {
    type: String,
    default: ''
  }
})

// Iniciales del nombre (fallback cuando no hay imagen)
const initials = computed(() => {
  if (props.name) {
    const nameParts = props.name.split(' ')
    // Asegurarse de que al menos la primera inicial exista
    if (nameParts.length > 0 && nameParts[0].length > 0) {
      const firstInitial = nameParts[0][0].toUpperCase();
      const lastInitial = nameParts.length > 1 && nameParts[1].length > 0 ? nameParts[1][0].toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
    }
  }
  return 'U' // Si no hay nombre o es vacío, usar una "U" por defecto
})

// Clases de Tailwind para el tamaño y estilo del avatar
const avatarClasses = computed(() => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg',
  }

  // Si el tamaño es 'small', ajustamos el tamaño de fuente para que las iniciales no sean demasiado grandes
  const textClass = props.size === 'small' ? 'text-xs' : (props.size === 'medium' ? 'text-sm' : 'text-lg');
  
  return `${sizeClasses[props.size]} ${textClass} rounded-full overflow-hidden flex items-center justify-center font-semibold`;
})
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>