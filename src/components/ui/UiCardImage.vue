<template>
    <div class="max-w-xs max-h-[475px] bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <!-- Contenedor de la imagen -->
      <router-link :to="link" class="w-full min-h-1/2 max-h-64 relative">
        <img :src="imageSrc" alt="Card image" class="object-cover" />
      </router-link>
      <!-- Contenedor del texto -->
      <div class="p-4 flex flex-col justify-between h-1/3">
        <router-link :to="link">
          <h5 class="mb-2 text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ title }}</h5>
        </router-link>
        <p class="mb-3 text-xs md:text-base font-normal text-gray-700 dark:text-gray-400">{{ description }}</p>
        <router-link :to="link" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
          Read more
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
    // Props para personalizar la tarjeta
    const props = defineProps({
      imageSrc: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    });
  </script>
  