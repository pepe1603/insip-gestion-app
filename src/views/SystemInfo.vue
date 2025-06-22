<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md my-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Información del Sistema</h1>
      <p class="text-gray-600">Detalles técnicos y de contacto de la API de Gestión de Vacaciones.</p>
    </div>

    <div v-if="cargando" class="flex items-center justify-center h-48">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p class="ml-4 text-gray-600">Cargando información del sistema...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">¡Error!</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
      <p class="mt-2 text-sm">Por favor, intenta recargar la página o contacta a soporte.</p>
    </div>

    <div v-else-if="info" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <p class="text-sm font-semibold text-gray-500">Nombre de la API:</p>
          <p class="text-lg font-medium text-blue-700">{{ info.api_name }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-500">Versión:</p>
          <p class="text-lg font-medium text-gray-800">{{ info.version }}</p>
        </div>
        <div class="md:col-span-2">
          <p class="text-sm font-semibold text-gray-500">Descripción:</p>
          <p class="text-base text-gray-700">{{ info.description }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-500">Estado:</p>
          <UiBadge :text="info.status" :color="info.status === 'Operativo' ? 'green' : 'red'" size="md" />
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-500">Entorno:</p>
          <p class="text-base text-gray-700">{{ info.environment }}</p>
        </div>
        <div class="md:col-span-2">
          <p class="text-sm font-semibold text-gray-500">Último Despliegue:</p>
          <p class="text-base text-gray-700">{{ formatDate(info.last_deployment_date) }}</p>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <PaperAirplaneIcon class="w-6 h-6 mr-2 text-blue-500" />
          Contacto
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p class="text-sm font-semibold text-gray-500">Email:</p>
            <a :href="'mailto:' + info.contact.email" class="text-blue-600 hover:underline">
              {{ info.contact.email }}
            </a>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-500">Teléfono:</p>
            <a :href="'tel:' + info.contact.phone" class="text-blue-600 hover:underline">
              {{ info.contact.phone }}
            </a>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm font-semibold text-gray-500">URL de Documentación:</p>
            <a :href="info.contact.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline flex items-center">
              {{ info.contact.url }}
              <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <UsersIcon class="w-6 h-6 mr-2 text-blue-500" />
          Colaboradores
        </h3>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="(collab, index) in info.collaborators" :key="index" class="text-base text-gray-700">
            <strong>{{ collab.name }}</strong> - {{ collab.role }}
          </li>
        </ul>
      </div>

      <div class="pt-4 border-t border-gray-200 text-center">
        <p class="text-gray-700 italic">"{{ info.message }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatDate } from '../utils/dateFormatter'; // Adjust path as needed
import UiBadge from '../components/ui/UiBadge.vue'; // Adjust path as needed
import { PaperAirplaneIcon, UsersIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

// Import the new InfoService
import InfoService from '../services/infoService'; // Adjust path as needed

// State variables
const info = ref(null);
const cargando = ref(true);
const error = ref(null);

// Function to fetch API information using the service
const fetchApiInfo = async () => {
  try {
    const data = await InfoService.getSystemInfo(); // Call the service method
    info.value = data;
  } catch (err) {
    // The InfoService already handles console.error and toast, so here we just
    // update the local error state for display within the component.
    error.value = err.message || 'No se pudo obtener la información del sistema.';
  } finally {
    cargando.value = false;
  }
};

// Fetch data when the component is mounted
onMounted(fetchApiInfo);
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>