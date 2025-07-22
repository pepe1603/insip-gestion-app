<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black p-4 sm:p-6 lg:p-8">
    <div class=" p-8 md:p-12 rounded-2xl w-full text-center transform transition-all duration-500 ease-in-out scale-95 opacity-0 animate-fade-in-up">
      <div class="mb-8">
        <ExclamationTriangleIcon class="mx-auto h-28 w-28 text-red-500 dark:text-red-400 animate-bounce-subtle" />
      </div>

      <h1 class="text-6xl md:text-7xl font-extrabold text-red-700 dark:text-red-500 mb-4 tracking-tight">
        403
      </h1>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
        Acceso Denegado <font-awesome-icon :icon="['fas', 'ban']" class="h-6 w-6 text-red-400" />
      </h2>

      <p class="text-gray-700 dark:text-gray-300 text-lg mb-4 leading-relaxed px-2">
        Parece que **no tienes los permisos necesarios** para acceder a esta sección. Tu cuenta actual no cuenta con los roles requeridos para visualizar este contenido.
      </p>
      <p class="text-gray-600 dark:text-gray-400 text-md mb-8 px-2">
        Si crees que esto es un error o necesitas acceder, por favor, <span class="font-semibold text-indigo-600 dark:text-indigo-400">contacta a tu administrador</span>.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <UiButton
          v-if="authStore.isAuthenticated && authStore.user?.role !== 'employee'"
          :to="determineDashboardRoute()"
          variant="primary"
          size="md"
          :show-icon="true"
          :icon="HomeModernIcon"
          icon-position="left"
        >
          Ir al Panel de Control
        </UiButton>

        <UiButton
          v-if="!isAuthenticated"
          to="/auth/login"
          variant="outline-primary"
          size="md"
          :show-icon="true"
          :icon="ArrowRightOnRectangleIcon"
          icon-position="left"
        >
          Iniciar Sesión
        </UiButton>

        <UiButton
          @click="goBack"
          variant="secondary"
          size="md"
          :show-icon="true"
          :icon="ArrowUturnLeftIcon"
          icon-position="left"
        >
          Regresar
        </UiButton>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // Importar useRouter
import { useAuthStore } from '@/stores/authStore';
import UiButton from '@/components/ui/UiButton.vue'; // Asegúrate de que la ruta sea correcta
import {
  ExclamationTriangleIcon, // Icono principal de advertencia
  HomeModernIcon,          // Icono para "Ir al Panel de Control"
  ArrowRightOnRectangleIcon, // Icono para "Iniciar Sesión"
  ArrowUturnLeftIcon         // Icono para "Regresar"
} from '@heroicons/vue/24/solid';

const authStore = useAuthStore();
const router = useRouter(); // Instanciar el router

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentYear = computed(() => new Date().getFullYear());
const appName = 'RH-Flow (Gestión de Asistencias y Vacaciones)'; // Nombre de la aplicación más descriptivo

// Función para determinar la ruta del dashboard basada en el rol
const determineDashboardRoute = () => {
  const userRole = authStore.user?.role;
  if (userRole === 'admin' || userRole === 'supervisor') {
    return { name: 'intro' }; // O la ruta de tu dashboard de admin/supervisor
  } else if (userRole === 'employee') {
    return { name: 'employee-dashboard' }; // O la ruta de tu dashboard de empleado
  }
  return '/'; // Ruta por defecto si no se reconoce el rol o no hay user
};

// Función para regresar a la página anterior o a la raíz
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1); // Intenta ir a la página anterior
  } else {
    router.push('/'); // Si no hay historial, ve a la página de inicio
  }
};
</script>

<style scoped>
/* Animación de entrada para el contenedor principal */
@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInSlideUp 0.6s ease-out forwards;
}

/* Animación sutil de rebote para el icono de advertencia */
@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite ease-in-out;
}
</style>