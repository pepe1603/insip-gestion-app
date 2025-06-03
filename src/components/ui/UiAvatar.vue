<template>
    <div :class="avatarClasses">
      <!-- Imagen del avatar -->
      <img
        v-if="src"
        :src="src"
        :alt="alt"
        class="object-cover w-full h-full rounded-full"
      />
      
      <!-- Fallback en caso de que no haya imagen -->
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
      default: 'medium',  // Tamaño predeterminado (small, medium, large)
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
      return nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : nameParts[0][0]
    }
    return 'U' // Si no hay nombre, usar una "U" por defecto
  })
  
  // Clases de Tailwind para el tamaño y estilo del avatar
  const avatarClasses = computed(() => {
    const sizeClasses = {
      small: 'w-8 h-8 text-xs',
      medium: 'w-12 h-12 text-sm',
      large: 'w-16 h-16 text-lg',
    }
    
    return `${sizeClasses[props.size]} rounded-full`
  })
  </script>
  
  <style scoped>
  /* Estilos adicionales si es necesario */
  </style>
  