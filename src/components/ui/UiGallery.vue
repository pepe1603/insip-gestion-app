<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="(image, index) in images" :key="index" class="gallery-item">
        <img
          :src="image.src"
          :alt="image.alt"
          class="h-auto max-w-full rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
        />
        <slot :image="image"></slot> </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    images: {
      type: Array,
      required: true,
      default: () => []
    }
  });
  </script>
  
  <style scoped>
  .gallery-item {
    /* Estilos para cada item si es necesario */
  }
  
  .grid {
    display: grid;
    gap: 16px;
  }
  
  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  </style>