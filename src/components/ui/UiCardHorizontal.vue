<template>
    <!-- Router Link para la navegación -->
    <router-link :to="link" class="h-auto md:h-64 w-full md:w-xl flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      
      <!-- Imagen del Card -->
      <div class=" w-full md:w-2/3 h-auto md:h-full rounded-t-lg md:rounded-t-none md:rounded-l-lg overflow-hidden">
        <img :src="imageSrc" alt="Card image" class="object-cover md:h-full" />    

      </div>
  
      <!-- Contenedor de contenido de texto -->
      <div class="flex flex-col justify-between p-4 leading-normal">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ title }}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ description }}</p>
        <slot name="extra-content"></slot> <!-- Para incluir contenido adicional como botones, íconos, etc -->
      </div>
    </router-link>
  </template>
  
  <script setup>
    // Definición de las propiedades del componente
    const props = defineProps({
      imageSrc: {
        type: String,
        required: true, // La URL de la imagen es obligatoria
      },
      title: {
        type: String,
        required: true, // El título de la tarjeta es obligatorio
      },
      description: {
        type: String,
        required: true, // La descripción es obligatoria
      },
      link: {
        type: String,
        required: true, // El enlace debe ser proporcionado
      },
    });
  </script>
  
  <style scoped>
    /* Personaliza aquí los estilos si es necesario */
  </style>
  