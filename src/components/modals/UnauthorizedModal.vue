<template>
  <div class="text-center p-4">
    <div class="mb-6 flex justify-center">
      <svg class="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
      </svg>
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Acceso Denegado</h2>
    <p class="text-gray-700 dark:text-gray-300 text-base mb-6">
      {{ message }}
    </p>

    <div class="space-y-3">
      <button
        @click="handleGoToHome"
        class="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
      >
        Ir al Inicio
      </button>

      <button
        v-if="!isAuthenticated"
        @click="handleGoToLogin"
        class="w-full px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900"
      >
        Iniciar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Tu store de Pinia para auth
import { useRouter } from 'vue-router'; // Para la navegación

// Props inyectadas por el modalService para gestionar el cierre y resultados
const props = defineProps({
  message: {
    type: String,
    default: 'No tienes los permisos necesarios para acceder a esta sección.',
  },
  __onClose: Function, // Función para cerrar el modal y resolver la promesa
});

const authStore = useAuthStore();
const router = useRouter();

// Obtenemos el estado de autenticación de tu store de Pinia
const isAuthenticated = authStore.isAuthenticated; // Pinia getters son directamente accesibles

// Manejadores de clic
const handleGoToHome = () => {
  if (props.__onClose) {
    props.__onClose({ action: 'home' }); // Resolver con acción 'home'
  }
  router.push('/dashboard'); // Redirige al dashboard o la ruta principal
};

const handleGoToLogin = () => {
  if (props.__onClose) {
    props.__onClose({ action: 'login' }); // Resolver con acción 'login'
  }
  router.push('/auth/login'); // Redirige a la página de login
};
</script>

<style scoped>
/* No se necesitan estilos con scope, Tailwind CSS lo maneja */
</style>