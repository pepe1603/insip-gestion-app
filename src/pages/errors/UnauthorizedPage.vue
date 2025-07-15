<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
    <div class="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl  w-auto text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div class="mb-6">
        <svg class="mx-auto h-24 w-24 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <h1 class="text-5xl md:text-6xl font-extrabold text-red-700 dark:text-red-500 mb-4">
        403
      </h1>
      <h2 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Acceso Denegado
      </h2>

      <p class="text-gray-700 dark:text-gray-300 text-lg mb-4 leading-relaxed">
        Parece que no tienes los permisos necesarios para acceder a esta sección. Tu cuenta actual no cuenta con los roles requeridos para visualizar este contenido.
      </p>
      <p class="text-gray-600 dark:text-gray-400 text-md mb-8">
        Si crees que esto es un error o necesitas acceder, por favor, contacta a tu administrador.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link
        v-if="authStore.isAuthenticated && authStore.user?.role !== 'employee'"
          to="/admin"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          Ir al Panel de Control
        </router-link>

        <router-link
          v-if="!isAuthenticated"
          to="/auth/login"
          class="inline-flex items-center justify-center px-6 py-3 border border-indigo-300 dark:border-indigo-600 text-base font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
          Iniciar Sesión
        </router-link>

        <router-link
        to="/"
        >
        <UiButton size="md">
          Regresar
        </UiButton>

        </router-link>

      </div>
      
      <div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {{ currentYear }} {{ nameApp }} . Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Asegúrate de que esta ruta sea correcta
import UiButton from '../../components/ui/UiButton.vue';

// Usa tu store de Pinia
const authStore = useAuthStore();

// Usa la propiedad isAuthenticated del store como una propiedad computada
const isAuthenticated = computed(() => authStore.isAuthenticated);

const currentYear = computed(() => new Date().getFullYear());

const nameApp = 'gestion-asistencias-vacaciones-insip-app/RH-Flow';
</script>

<style scoped>
/* No es necesario este bloque si solo usas Tailwind CSS */
</style>