<template>
  <div class="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Configuración General del Sistema</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Gestiona la información principal de la empresa y las preferencias de localización de la aplicación.
      </p>
    </div>

    <!-- Sección de Información de la Empresa -->
    <div class="mb-8 p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
        <BuildingOfficeIcon class="w-7 h-7 mr-3 text-blue-600" /> <!-- Icono para información de empresa -->
        Información de la Empresa
      </h2>
      <p class="text-blue-700 dark:text-blue-300 mb-4">
        Detalles fundamentales de la organización que se utilizan en reportes y comunicaciones.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label for="companyName" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre de la Empresa:</label>
          <input
            type="text"
            id="companyName"
            v-model="settings.companyInfo.name"
            :class="inputClasses"
            placeholder="Nombre completo de la empresa"
            :disabled="!isEditing"
          />
        </div>
        <div>
          <label for="companyPhone" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Teléfono de Contacto:</label>
          <input
            type="tel"
            id="companyPhone"
            v-model="settings.companyInfo.phone"
            :class="inputClasses"
            placeholder="+XX XXX XXX XXXX"
            :disabled="!isEditing"
          />
        </div>
        <div class="md:col-span-2">
          <label for="companyAddress" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Dirección:</label>
          <textarea
            id="companyAddress"
            v-model="settings.companyInfo.address"
            rows="2"
            :class="inputClasses"
            placeholder="Calle, número, colonia, código postal, ciudad, país"
            :disabled="!isEditing"
          ></textarea>
        </div>
        <div>
          <label for="companyEmail" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Correo Electrónico:</label>
          <input
            type="email"
            id="companyEmail"
            v-model="settings.companyInfo.email"
            :class="inputClasses"
            placeholder="contacto@empresa.com"
            :disabled="!isEditing"
          />
        </div>
        <div class="md:col-span-2">
          <label for="companyLogo" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Logo de la Empresa:</label>
          <div class="mt-1 flex items-center">
            <img :src="settings.companyInfo.logoUrl" alt="Logo de la Empresa" class="h-16 w-16 object-contain mr-4 border border-gray-300 dark:border-gray-600 rounded-md p-1 bg-white dark:bg-gray-700" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ settings.companyInfo.logoUrl ? settings.companyInfo.logoUrl.split('/').pop() : 'No hay logo cargado' }}
            </span>
            <!-- En un escenario real, aquí iría un input type="file" y lógica para subir/previsualizar -->
            <button
              v-if="isEditing"
              @click="alert('Funcionalidad de subir logo simulada.')"
              class="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cambiar Logo
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Este logo se usará en reportes y cabeceras. (Funcionalidad de carga simulada)</p>
        </div>
      </div>
    </div>

    <!-- Sección de Preferencias de Idioma y Región -->
    <div class="p-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
        <GlobeAltIcon class="w-7 h-7 mr-3 text-green-600" /> <!-- Icono para idioma/región -->
        Preferencias de Idioma y Región
      </h2>
      <p class="text-green-700 dark:text-green-300 mb-4">
        Ajusta los formatos de fecha, hora, moneda y el idioma predeterminado de la aplicación.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label for="defaultLanguage" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Idioma Predeterminado:</label>
          <select
            id="defaultLanguage"
            v-model="settings.locale.language"
            :class="inputClasses"
            :disabled="!isEditing"
          >
            <option value="es">Español (ES)</option>
            <option value="en">Inglés (EN)</option>
            <option value="fr">Francés (FR)</option>
          </select>
        </div>
        <div>
          <label for="systemTimezone" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Zona Horaria del Sistema:</label>
          <select
            id="systemTimezone"
            v-model="settings.locale.timezone"
            :class="inputClasses"
            :disabled="!isEditing"
          >
            <option value="America/Mexico_City">America/Mexico_City (CST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
          </select>
        </div>
        <div>
          <label for="dateFormat" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Formato de Fecha:</label>
          <select
            id="dateFormat"
            v-model="settings.locale.dateFormat"
            :class="inputClasses"
            :disabled="!isEditing"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (20/07/2025)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (07/20/2025)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-07-20)</option>
          </select>
        </div>
        <div>
          <label for="currencyFormat" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Formato de Moneda:</label>
          <select
            id="currencyFormat"
            v-model="settings.locale.currencyFormat"
            :class="inputClasses"
            :disabled="!isEditing"
          >
            <option value="MXN">MXN ($ 1,234.56)</option>
            <option value="USD">USD ($ 1,234.56)</option>
            <option value="EUR">EUR (€ 1.234,56)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Botones de Acción (Editar/Guardar/Cancelar) -->
    <div class="mt-8 flex justify-end space-x-4">
      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PencilIcon class="w-5 h-5 mr-2" /> Editar Configuración
      </button>

      <button
        v-if="isEditing"
        @click="cancelEditing"
        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        Cancelar
      </button>

      <button
        v-if="isEditing"
        @click="saveSettings"
        :disabled="isSaving"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <template v-if="isSaving">
          <ArrowPathIcon class="w-5 h-5 mr-2 animate-spin" /> Guardando...
        </template>
        <template v-else>
          <CheckCircleIcon class="w-5 h-5 mr-2" /> Guardar Cambios
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  BuildingOfficeIcon, // Para información de la empresa
  GlobeAltIcon,       // Para idioma y región
  PencilIcon,         // Para el botón de editar
  CheckCircleIcon,    // Para el botón de guardar
  ArrowPathIcon       // Para el icono de "guardando..."
} from '@heroicons/vue/24/outline'; // Asegúrate de que los iconos estén en tu versión de Heroicons

// --- Estado de la Interfaz ---
const isEditing = ref(false); // Controla si los campos están habilitados para edición
const isSaving = ref(false);  // Controla el estado del botón de guardar

// --- Datos de Configuración Simulados (Iniciales) ---
const initialSettings = {
  companyInfo: {
    name: 'Tech Solutions S.A. de C.V.',
    address: 'Av. Siempre Viva 123, Col. Springfield, C.P. 01234, Ciudad de México',
    phone: '+52 55 1234 5678',
    email: 'contacto@techsolutions.com.mx',
    logoUrl: '/public/nsip-logo_opt_original_mini.png', // Usa tu logo existente
  },
  locale: {
    language: 'es',
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    currencyFormat: 'MXN',
  },
};

// Se usa para mostrar los datos en el formulario
const settings = ref({ ...initialSettings });
// Se usa para guardar una copia de los datos originales al iniciar la edición
const originalSettings = ref(null);

// --- Clases de Tailwind CSS para Inputs ---
const inputClasses = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white';

// --- Métodos de Simulación ---

const saveSettings = () => {
  isSaving.value = true;
  // Simula una llamada a la API
  setTimeout(() => {
    console.log('Guardando configuración (simulado):', settings.value);
    // En un escenario real, aquí harías tu llamada a la API (ej. axios.post('/api/settings', settings.value))
    // Luego, si la API responde con éxito:
    originalSettings.value = { ...settings.value }; // Actualiza los datos originales
    isEditing.value = false; // Sale del modo edición
    isSaving.value = false;
    alert('Configuración guardada exitosamente (simulado).'); // Usar un toast real en producción
  }, 1500); // Simula un retraso de 1.5 segundos
};

const cancelEditing = () => {
  // Restaura los datos a los originales antes de cualquier cambio
  if (originalSettings.value) {
    settings.value = { ...originalSettings.value };
  } else {
    // Si no hay originalSettings (ej. primera carga), reinicia a los valores iniciales
    settings.value = { ...initialSettings };
  }
  isEditing.value = false; // Sale del modo edición
  alert('Edición cancelada. Los cambios no se guardaron (simulado).'); // Usar un toast real
};

// Cuando se entra en modo edición, guarda una copia de los datos actuales
// Esto permite "cancelar" y volver a los valores originales
const startEditing = () => {
    originalSettings.value = { ...settings.value };
    isEditing.value = true;
};

// Al montar el componente, inicializa originalSettings con los datos actuales
// Esto es importante si los datos iniciales provienen de una carga real y no son hardcoded
import { onMounted } from 'vue';
onMounted(() => {
    // En una aplicación real, aquí cargarías los datos del backend
    // Por ahora, usamos los initialSettings como si fueran los cargados
    originalSettings.value = { ...initialSettings };
});

</script>

<style scoped>
/* No se necesitan estilos adicionales con Tailwind CSS */
</style>