<template>
  <div class=" p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8 relative">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Configuración General del Sistema</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Gestiona la información principal de la empresa y las preferencias de localización de la aplicación.
      </p>
    </div>

    <div class="mb-8 p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
        <InformationCircleIcon class="w-7 h-7 mr-3 text-blue-600" />
        Información de la Empresa
      </h2>
      <p class="text-blue-700 dark:text-blue-300 mb-4">
        Detalles fundamentales de la organización que se utilizan en reportes y comunicaciones.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <UiInputText
          id="companyName"
          label="Nombre de la Empresa"
          v-model="settings.companyInfo.name"
          :placeholder="'Nombre completo de la empresa'"
          :disabled="!isEditing"
        />

        <UiInputText
          id="companyPhone"
          label="Teléfono de Contacto"
          placeholder="+XX XXX XXX XXXX"
          v-model="settings.companyInfo.phone"
          :disabled="!isEditing"
          type="tel"
        />

        <UiInputText
          id="companyPhone2"
          label="Teléfono Secundario"
          placeholder="+XX XXX XXX XXXX"
          v-model="settings.companyInfo.phone_2"
          :disabled="!isEditing"
          type="tel"
        />

        <div class="md:col-span-2">
          <UiTextarea
            id="companyAddress"
            label="Dirección 1"
            placeholder="Calle, número, colonia, código postal, ciudad, país"
            v-model="settings.companyInfo.address"
            :rows="2"
            :disabled="!isEditing"
          />
        </div>

        <div class="md:col-span-2">
          <UiTextarea
            id="companyAddress2"
            label="Dirección 2"
            placeholder="Calle, número, colonia, código postal, ciudad, país"
            v-model="settings.companyInfo.address_2"
            :rows="2"
            :disabled="!isEditing"
          />
          </div>

        <UiInputEmail
          id="companyEmail"
          label="Correo Electrónico"
          placeholder="contacto@empresa.com"
          v-model="settings.companyInfo.email"
          :disabled="!isEditing"
        />

        <div class="md:col-span-2">
          <label for="companyLogo" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Logo de la Empresa:</label>
          <div class="mt-1 flex items-center">
            <img :src="settings.companyInfo.logoUrl" alt="Logo de la Empresa" class="h-16 w-16 object-contain mr-4 border border-gray-300 dark:border-gray-600 rounded-md p-1 bg-white dark:bg-gray-700" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ settings.companyInfo.logoUrl ? settings.companyInfo.logoUrl.split('/').pop() : 'No hay logo cargado' }}
            </span>
            <button
              v-if="isEditing"
              @click="showLogoUploadAlert"
              class="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cambiar Logo
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Este logo se usará en reportes y cabeceras. (Funcionalidad de carga simulada)</p>
        </div>
      </div>
    </div>

    <UiDivider label="Preferencias de Idioma y Región" :icon="GlobeAltIcon" color="green" size="md" />

    <div class="mb-8 p-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg shadow-sm">
      <p class="text-green-700 dark:text-green-300 mb-4">
        Ajusta los formatos de fecha, hora, moneda y el idioma predeterminado de la aplicación.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <UiSelect
          id="systemTimezone"
          label="Zona Horaria del Sistema"
          v-model="settings.locale.timezone"
          :options="timezoneOptions"
          :disabled="!isEditing"
        />

        <UiSelect
          id="dateFormat"
          label="Formato de Fecha"
          v-model="settings.locale.dateFormat"
          :options="dateFormatOptions"
          :disabled="!isEditing"
        />

        <UiSelect
          id="currencyFormat"
          label="Formato de Moneda"
          v-model="settings.locale.currencyFormat"
          :options="currencyFormatOptions"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <UiDivider label="Preferencias de Tema" :icon="SunIcon" color="yellow" size="md" />

    <div class="mb-8 p-6 bg-yellow-50 dark:bg-yellow-800 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-sm">
      <p class="text-yellow-600 dark:text-yellow-300 mb-4">
        Personaliza la apariencia visual de la aplicación.
      </p>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Seleccionar Tema:
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
            Cambia entre el tema claro (Light) y oscuro (Dark).
          </p>

          <p class="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
            El tema se aplicará a toda la aplicación y se guardará en tu configuración.
          </p>

        <!-- Tema actual-->
        <p class="mt-4 text-sm font-medium text-gray-800 dark:text-gray-200">
            Tema Actual: <span class="font-extrabold ml-2">{{ settings.theme.appTheme === 'dark' ? 'Oscuro' : 'Claro' }}</span>
          </p>

        </label>


        <div class="flex space-x-2">
          <button
            @click="changeAppTheme('light')"
            :disabled="!isEditing"
            :class="[
              'p-2 rounded-md transition-colors duration-200 ease-in-out flex items-center',
              settings.theme.appTheme === 'light'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
              { 'opacity-50 cursor-not-allowed': !isEditing }
            ]"
            aria-label="Seleccionar Tema Claro"
          >
            <SunIcon class="w-5 h-5 mr-1" v-if="settings.theme.appTheme === 'light'" />
            <SunIcon class="w-5 h-5 mr-1 text-yellow-500" v-else />
            Claro
          </button>
          <button
            @click="changeAppTheme('dark')"
            :disabled="!isEditing"
            :class="[
              'p-2 rounded-md transition-colors duration-200 ease-in-out flex items-center',
              settings.theme.appTheme === 'dark'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
              { 'opacity-50 cursor-not-allowed': !isEditing }
            ]"
            aria-label="Seleccionar Tema Oscuro"
          >
            <MoonIcon class="w-5 h-5 mr-1" v-if="settings.theme.appTheme === 'dark'" />
            <MoonIcon class="w-5 h-5 mr-1 text-blue-300" v-else />
            Oscuro
          </button>
        </div>
      </div>
    </div>

    <UiDivider label="Sonidos y Notificaciones" :icon="BellAlertIcon" color="purple" size="md" />

    <div class="mb-8 p-6 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg shadow-sm">
      <p class="text-purple-700 dark:text-purple-300 mb-4">
        Controla la reproducción de sonidos para las alertas y notificaciones de la aplicación.
      </p>

      <div class="flex items-center justify-between py-2">
        <label for="toggleAlertSounds" class="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
          Activar Sonidos de Alerta
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
            Reproducir un sonido cuando aparezca una notificación (ej. éxito, error).
          </p>
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
            Los sonidos se reproducirán solo si el navegador lo permite. si están deshabilitados, no se reproducirán.
            <br>Pero si el usuario ha silenciado el dispositivo, los sonidos no se reproducirán. Sin embargo, los sonidos se reproducirán si el usuario ha habilitado los sonidos en su dispositivo.
          </p>
        </label>
        <UiSwitch
          id="toggleAlertSounds"
          v-model="uiStore.areAlertSoundsMuted"
          :disabled="!isEditing"
          @update:modelValue="handleToggleAlertSounds"
        />
      </div>
      <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Nota: Los navegadores pueden requerir una primera interacción del usuario para permitir la reproducción de sonidos.
      </p>
    </div>

    <div class="mt-8 flex justify-end space-x-4">
      <button
        v-if="!isEditing"
        @click="startEditing"
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
          <UiSpinner class="w-5 h-5 mr-2" /> Guardando...
        </template>
        <template v-else>
          <CheckCircleIcon class="w-5 h-5 mr-2" /> Guardar Cambios
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUiStore } from '@/stores/uiStore';
import { useGlobalToast } from '@/composables/useGlobalToast';

// Importa tus componentes UI
import UiInputEmail from '@/components/ui/UiInputEmail.vue';
import UiInputText from '@/components/ui/UiInputText.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiTextarea from '@/components/ui/UiTextArea.vue';
import UiDivider from '@/components/ui/UiDivider.vue';

import UiSwitch from '@/components/ui/UiSwitch.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';

import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckCircleIcon,
  BellAlertIcon,
  SunIcon, // Importar SunIcon
  MoonIcon // Importar MoonIcon
} from '@heroicons/vue/24/outline';
import { InformationCircleIcon } from '@heroicons/vue/20/solid';

const uiStore = useUiStore();
const $toast = useGlobalToast();

const isEditing = ref(false);
const isSaving = ref(false);

const initialSettings = {
  companyInfo: {
    name: 'Nature Source Improved Plants De México S.A de C.V',
    address: 'Batallon de San Patricio 109 int. 404-B del Valle Oriente,San Pedro , Garza Garcia Nuevo Leon, C.P. 66260, México',
    address_2: 'Rancho El Rocio S/N , Canton EL CArmen  Frontera Hidalgo Chiapas, C.P. 30850, México',
    phone: '+52 962-620-1530',
    phone_2: '+52 962-620-1534',
    email: 'contacto@techsolutions.com.mx',
    logoUrl: '/nsip-logo_opt_original_mini.png',
  },
  locale: {
    language: 'es', // Idioma fijo a español
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    currencyFormat: 'MXN',
  },
  theme: {
    appTheme: 'light', // Inicializa con un tema predeterminado. Se sobrescribirá en onMounted.
  }
};

const settings = ref({ ...initialSettings });
const originalSettings = ref(null);

const timezoneOptions = computed(() => [
  { value: 'America/Mexico_City', label: 'America/Mexico_City (CST)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
]);

const dateFormatOptions = computed(() => [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (20/07/2025)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (07/20/2025)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2025-07-20)' },
]);

const currencyFormatOptions = computed(() => [
  { value: 'MXN', label: 'MXN ($ 1,234.56)' },
  { value: 'USD', label: 'USD ($ 1,234.56)' },
  { value: 'EUR', label: 'EUR (€ 1.234,56)' },
]);

// La variable themeOptions ya no es estrictamente necesaria para los botones,
// pero la mantengo si en algún punto quieres volver a un select o usarla para otra cosa.
// const themeOptions = computed(() => [
//   { value: 'light', label: 'Claro' },
//   { value: 'dark', label: 'Oscuro' },
// ]);


const saveSettings = () => {
  isSaving.value = true;
  setTimeout(() => {
    // Aquí se guarda el tema seleccionado del formulario en el uiStore
    uiStore.setTheme(settings.value.theme.appTheme);

    console.log('Guardando configuración (simulado):', settings.value);
    originalSettings.value = { ...settings.value };
    isEditing.value = false;
    isSaving.value = false;
    $toast.success('Configuración guardada exitosamente.');
  }, 1500);
};

const cancelEditing = () => {
  if (originalSettings.value) {
    settings.value = { ...originalSettings.value };
  } else {
    settings.value = { ...initialSettings };
  }
  isEditing.value = false;
  $toast.info('Edición cancelada. Los cambios no se guardaron.');
};

const startEditing = () => {
  originalSettings.value = { ...settings.value };
  isEditing.value = true;
};

const handleToggleAlertSounds = (newValue) => {
  if (newValue) {
    $toast.info('Sonidos de alerta deshabilitados.');
  } else {
    $toast.success('Sonidos de alerta activados.');
  }
};

const showLogoUploadAlert = () => {
  $toast.info('Funcionalidad de subir logo simulada. En una aplicación real, se abriría un selector de archivos.');
};

// Esta función ahora actualiza directamente el modelo y el store
const changeAppTheme = (theme) => {
  settings.value.theme.appTheme = theme; // Actualiza el modelo local
  uiStore.setTheme(theme); // Actualiza el store
  $toast.info(`Tema cambiado a ${theme === 'dark' ? 'Oscuro' : 'Claro'}.`);
};

onMounted(() => {
  // Se inicializa el modelo del selector con el tema actual del store
  settings.value.theme.appTheme = uiStore.currentTheme;
  // Se guarda una copia inicial de la configuración
  originalSettings.value = { ...settings.value };
});
</script>

<style scoped>
/* No se necesitan estilos adicionales con Tailwind CSS */
</style>