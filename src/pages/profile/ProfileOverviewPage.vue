<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
      <SparklesIcon class="w-8 h-8 text-yellow-500 mr-3" />
      ¡Bienvenido a tu Perfil de usuario, {{ authStore.user?.name || 'Usuario' }}!
    </h2>

    <p class="text-gray-700 dark:text-gray-300 mb-6 text-lg">
      Aquí puedes gestionar y revisar toda la información relacionada con tu cuenta y datos personales.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
        <UserCircleIcon class="w-10 h-10 text-teal-500 mr-4 flex-shrink-0" />
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Rol Actual:</p>
          <p class="text-lg font-semibold text-gray-800 dark:text-white capitalize">{{ authStore.user?.role || 'N/A' }}</p>
        </div>
      </div>
      <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
        <EnvelopeIcon class="w-10 h-10 text-indigo-500 mr-4 flex-shrink-0" />
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Email:</p>
          <p class="text-lg font-semibold text-gray-800 dark:text-white break-all">{{ authStore.user?.email || 'N/A' }}</p>
        </div>
      </div>
    </div>

    <p class="text-gray-700 dark:text-gray-300 mb-4">
      Utiliza el menú de navegación de la izquierda para explorar las diferentes secciones de tu perfil:
    </p>
    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-8">
      <li>**Mi Perfil:** Revisa tus datos básicos de usuario.</li>
      <li>**Editar Perfil:** Actualiza tu información de contacto.</li>
      <li>**Cambiar Contraseña:** Mantén tu cuenta segura.</li>
      <li>**Seguridad:** Configura opciones de seguridad adicionales.</li>
      <li>**Mis Datos de Empleado:** Consulta tu información laboral detallada (puesto, salario, etc.).</li>
    </ul>

    <div class="flex justify-end mt-8">
      <router-link :to="{ name: 'profile-details' }">
        <UiButton variant="primary" class="flex items-center">
          <UserIcon class="w-5 h-5 mr-2" /> Ir a Mi Perfil Principal
        </UiButton>
      </router-link>
    </div>
  </div>
</template>160320

<script setup>
import { useAuthStore } from '@/stores/authStore';
import UiButton from '@/components/ui/UiButton.vue'; // Asegúrate de que esta ruta sea correcta
import { 
  SparklesIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  UserIcon 
} from '@heroicons/vue/24/outline'; // Importa los íconos de Heroicons

const authStore = useAuthStore();
</script>

<style scoped>
/* No se necesitan estilos aquí, ya que todas las clases son de Tailwind CSS */
</style>