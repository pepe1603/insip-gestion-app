<template>
<div class="min-w-screen h-full overflow-hidden bg-gray-50 dark:bg-gray-900 pt-4">
    <div class="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Información del Sistema</h1>
      <p class="text-gray-600 dark:text-gray-400">Detalles técnicos de la aplicación y la API de Gestión de Vacaciones.</p>
    </div>

    <div class="mb-8 p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
        <ComputerDesktopIcon class="w-7 h-7 mr-3 text-blue-600" />
        Información de la Aplicación (Frontend)
      </h2>
      <p class="text-blue-700 dark:text-blue-300 mb-4">
        Esta sección muestra detalles sobre la interfaz de usuario que estás utilizando.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Versión de la UI:</p>
          <p class="text-lg font-medium text-blue-900 dark:text-blue-100">{{ frontendInfo.version }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Framework:</p>
          <p class="text-lg font-medium text-blue-900 dark:text-blue-100">{{ frontendInfo.framework }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Entorno de Despliegue:</p>
          <p class="text-lg font-medium text-blue-900 dark:text-blue-100">{{ frontendInfo.environment }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Fecha de Compilación:</p>
          <p class="text-lg font-medium text-blue-900 dark:text-blue-100">{{ formatDate(frontendInfo.buildDate) }}</p>
        </div>
        <div class="md:col-span-2">
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Repositorio del Frontend:</p>
          <a :href="frontendInfo.repositoryUrl" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline flex items-center">
            {{ frontendInfo.repositoryUrl }}
            <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
    <div class="p-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
        <ServerStackIcon class="w-7 h-7 mr-3 text-green-600" />
        Información del Servicio (Backend API)
      </h2>
      <p class="text-green-700 dark:text-green-300 mb-4">
        Aquí se detallan las especificaciones técnicas de la API de gestión de vacaciones.
      </p>

      <div v-if="cargando" class="flex items-center justify-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p class="ml-4 text-gray-600 dark:text-gray-400">Cargando información del backend...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">¡Error!</strong>
        <span class="block sm:inline ml-2">{{ error }}</span>
        <p class="mt-2 text-sm">Por favor, intenta recargar la página o contacta a soporte.</p>
      </div>

      <div v-else-if="info" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Nombre de la API:</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ info.api_name }}</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Versión:</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ info.version }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Descripción:</p>
            <p class="text-base text-gray-700 dark:text-gray-300">{{ info.description }}</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Estado:</p>
            <UiBadge :text="info.status" :color="info.status === 'Operativo' ? 'green' : 'red'" size="md" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Entorno:</p>
            <p class="text-base text-gray-700 dark:text-gray-300">{{ info.environment }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Último Despliegue:</p>
            <p class="text-base text-gray-700 dark:text-gray-300">{{ formatDate(info.last_deployment_date) }}</p>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <PaperAirplaneIcon class="w-6 h-6 mr-2 text-blue-500" />
            Contacto
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Email:</p>
              <a :href="'mailto:' + info.contact.email" class="text-blue-600 hover:underline dark:text-blue-400">
                {{ info.contact.email }}
              </a>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Teléfono:</p>
              <a :href="'tel:' + info.contact.phone" class="text-blue-600 hover:underline dark:text-blue-400">
                {{ info.contact.phone }}
              </a>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">URL de Documentación:</p>
              <a :href="info.contact.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline flex items-center dark:text-blue-400">
                {{ info.contact.url }}
                <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <UsersIcon class="w-6 h-6 mr-2 text-blue-500" />
            Colaboradores
          </h3>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(collab, index) in info.collaborators" :key="index" class="text-base text-gray-700 dark:text-gray-300">
              <strong>{{ collab.name }}</strong> - {{ collab.role }}
            </li>
          </ul>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-gray-700 dark:text-gray-300 italic">"{{ info.message }}"</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatDate } from '../utils/dateFormatter'; // Asegúrate de que esta ruta sea correcta
import UiBadge from '../components/ui/UiBadge.vue'; // Asegúrate de que esta ruta sea correcta
import { PaperAirplaneIcon, UsersIcon, ArrowTopRightOnSquareIcon, ComputerDesktopIcon, ServerStackIcon } from '@heroicons/vue/24/outline'; // ¡Nuevos iconos!

import InfoService from '../services/infoService'; // Asegúrate de que esta ruta sea correcta

// --- Datos del Frontend (Sección 1) ---
const frontendInfo = ref({
  version: '1.0.0', // Puedes actualizar esto manualmente o desde un archivo de configuración
  framework: 'Vue.js 3',
  environment: import.meta.env.MODE, // Obtiene el entorno de Vite/Webpack (development, production, etc.)
  buildDate: '2025-07-13T12:00:00Z', // Fecha/hora de la última compilación, puedes automatizar esto
  repositoryUrl: 'https://github.com/tu-organizacion/vacation-app-frontend', // Reemplaza con tu repo
});

// --- Datos del Backend (Sección 2) ---
const info = ref(null); // Contendrá la información de la API
const cargando = ref(true);
const error = ref(null);

// Función para obtener la información de la API
const fetchApiInfo = async () => {
  try {
    const data = await InfoService.getSystemInfo();
    info.value = data;
  } catch (err) {
    // InfoService ya maneja console.error y toast, aquí solo actualizamos el estado local
    error.value = err.message || 'No se pudo obtener la información del sistema (API).';
  } finally {
    cargando.value = false;
  }
};

// Se llama al montar el componente para obtener los datos de la API
onMounted(fetchApiInfo);
</script>

<style scoped>
/* Puedes añadir estilos adicionales aquí si es necesario */
</style>