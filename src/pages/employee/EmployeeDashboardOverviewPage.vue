<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
      <BriefcaseIcon class="w-8 h-8 text-blue-600 mr-3" />
      ¡Hola, {{ authStore.user?.name || 'Compañero' }}! Bienvenido a tu Espacio de Empleado
    </h2>

    <p class="text-gray-700 dark:text-gray-300 mb-6 text-lg">
      Este es tu panel personal donde puedes gestionar tu información laboral y acceder a las herramientas esenciales para tu día a día en la empresa.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <router-link :to="{ name: 'employee-attendance' }" class="block">
        <div class="p-5 bg-teal-50 dark:bg-teal-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <ClockIcon class="w-12 h-12 text-teal-600 dark:text-teal-400 mb-3" />
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">Mis Asistencias</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">Registra y consulta tus entradas y salidas.</p>
        </div>
      </router-link>

      <router-link :to="{ name: 'employee-vacations' }" class="block">
        <div class="p-5 bg-indigo-50 dark:bg-indigo-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <SunIcon class="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-3" />
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">Mis Vacaciones</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">Revisa tu saldo y el estado de tus solicitudes.</p>
        </div>
      </router-link>

      <router-link :to="{ name: 'employee-my-data' }" class="block">
        <div class="p-5 bg-purple-50 dark:bg-purple-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <IdentificationIcon class="w-12 h-12 text-purple-600 dark:text-purple-400 mb-3" />
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">Mis Datos de Empleado</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">Consulta y actualiza tu información personal.</p>
        </div>
      </router-link>

      <router-link :to="{ name: 'employee-consultations' }" class="block">
        <div class="p-5 bg-green-50 dark:bg-green-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <QuestionMarkCircleIcon class="w-12 h-12 text-green-600 dark:text-green-400 mb-3" />
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">Consultas y Soporte</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">Obtén ayuda y resuelve tus dudas.</p>
        </div>
      </router-link>

      <router-link :to="{ name: 'employee-request-vacation' }" class="block">
        <div class="p-5 bg-orange-50 dark:bg-orange-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <CalendarDaysIcon class="w-12 h-12 text-orange-600 dark:text-orange-400 mb-3" />
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">Solicitar Vacaciones</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">Envía tu solicitud de días libres.</p>
        </div>
      </router-link>
    </div>

    <p class="text-gray-700 dark:text-gray-300 mb-4">
      Te invitamos a explorar las distintas secciones para aprovechar al máximo tu plataforma.
      Si tienes alguna duda o necesitas ayuda, no dudes en contactar a Recursos Humanos o utilizar la sección de Consultas.
    </p>

    <div class="flex justify-end mt-8">
      <router-link :to="{ name: 'employee-my-data' }">
        <UiButton variant="primary" class="flex items-center">
          <PencilSquareIcon class="w-5 h-5 mr-2" /> Actualizar Mis Datos
        </UiButton>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import UiButton from '@/components/ui/UiButton.vue'; // Asegúrate de la ruta
import { 
  BriefcaseIcon,        // Ícono principal del dashboard
  ClockIcon,            // Asistencia
  SunIcon,              // Vacaciones
  IdentificationIcon,   // Mis Datos
  QuestionMarkCircleIcon, // Consultas
  CalendarDaysIcon,      // Solicitar Vacaciones
  PencilSquareIcon      // Para el botón de "Actualizar Mis Datos"
} from '@heroicons/vue/24/outline'; // Importa los íconos de Heroicons

const authStore = useAuthStore();
</script>

<style scoped>
/* No se necesitan estilos aquí, ya que todas las clases son de Tailwind CSS */
</style>