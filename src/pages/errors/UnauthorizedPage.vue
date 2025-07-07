<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-lg w-full text-center">
      <h1 class="text-5xl font-extrabold text-red-600 mb-6 flex items-center justify-center">
        🚫 <span class="ml-4">Acceso Denegado</span>
      </h1>
      <p class="text-gray-700 text-lg mb-4">
        No tienes los permisos necesarios para ver esta página.
      </p>
      <p class="text-gray-600 mb-8">
        Por favor, contacta al administrador si crees que esto es un error.
      </p>

      <div class="space-y-4 md:space-y-0 md:space-x-4">
        <router-link
          to="/dashboard"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          Ir al Inicio
        </router-link>

        <router-link
          v-if="!isAuthenticated"
          to="/auth/login"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
          Iniciar Sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Importa tu store de Pinia

// Usa tu store de Pinia
const authStore = useAuthStore();

// Usa la propiedad isAuthenticated del store como una propiedad computada
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped>
/* No es necesario este bloque si solo usas Tailwind CSS */
</style>