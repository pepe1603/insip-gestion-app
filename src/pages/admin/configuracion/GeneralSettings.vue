<template>
  <div class=" p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8 relative">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">{{ $t('general.generalSettingsTitle') }}</h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('general.generalSettingsDescription') }}
      </p>
    </div>

    <div class="mb-8 p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
        <BuildingOfficeIcon class="w-7 h-7 mr-3 text-blue-600" />
        {{ $t('general.companyInfo') }}
      </h2>
      <p class="text-blue-700 dark:text-blue-300 mb-4">
        {{ $t('general.companyInfoDescription') }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <UiInputText
          id="companyName"
          :label="$t('general.companyName')"
          :placeholder="$t('general.namePlaceholder')"
          v-model="settings.companyInfo.name"
          :disabled="!isEditing"
        />

        <UiInputText
          id="companyPhone"
          :label="$t('general.companyPhone')"
          :placeholder="$t('general.phonePlaceholder')"
          v-model="settings.companyInfo.phone"
          :disabled="!isEditing"
          type="tel"
        />

        <div class="md:col-span-2">
          <UiTextarea
            id="companyAddress"
            :label="$t('general.companyAddress')"
            :placeholder="$t('general.addressPlaceholder')"
            v-model="settings.companyInfo.address"
            :rows="2"
            :disabled="!isEditing"
          />
        </div>

        <UiInputEmail
          id="companyEmail"
          :label="$t('general.companyEmail')"
          :placeholder="$t('general.emailPlaceholder')"
          v-model="settings.companyInfo.email"
          :disabled="!isEditing"
        />

        <div class="md:col-span-2">
          <label for="companyLogo" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t('general.companyLogo') }}:</label>
          <div class="mt-1 flex items-center">
            <img :src="settings.companyInfo.logoUrl" alt="Logo de la Empresa" class="h-16 w-16 object-contain mr-4 border border-gray-300 dark:border-gray-600 rounded-md p-1 bg-white dark:bg-gray-700" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ settings.companyInfo.logoUrl ? settings.companyInfo.logoUrl.split('/').pop() : $t('general.noLogoLoaded') }}
            </span>
            <button
              v-if="isEditing"
              @click="showLogoUploadAlert"
              class="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {{ $t('general.changeLogo') }}
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ $t('general.companyLogoHelp') }}</p>
        </div>
      </div>
    </div>

    <UiDivider :label="$t('general.localePreferences')" :icon="GlobeAltIcon" color="green" size="md" />

    <div class="mb-8 p-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg shadow-sm">
      <p class="text-green-700 dark:text-green-300 mb-4">
        {{ $t('general.localePreferencesDescription') }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <UiSelect
          id="defaultLanguage"
          :label="$t('general.defaultLanguage')"
          v-model="settings.locale.language"
          :options="languageOptions"
          :disabled="!isEditing"
          @change="changeAppLanguage(settings.locale.language)"
        />

        <UiSelect
          id="systemTimezone"
          :label="$t('general.systemTimezone')"
          v-model="settings.locale.timezone"
          :options="timezoneOptions"
          :disabled="!isEditing"
        />

        <UiSelect
          id="dateFormat"
          :label="$t('general.dateFormat')"
          v-model="settings.locale.dateFormat"
          :options="dateFormatOptions"
          :disabled="!isEditing"
        />

        <UiSelect
          id="currencyFormat"
          :label="$t('general.currencyFormat')"
          v-model="settings.locale.currencyFormat"
          :options="currencyFormatOptions"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <UiDivider :label="$t('general.themePreferences')" :icon="SunIcon" color="yellow" size="md" />

    <div class="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-sm">
      <p class="text-yellow-700 dark:text-yellow-300 mb-4">
        {{ $t('general.themePreferencesDescription') }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <UiSelect
          id="appTheme"
          :label="$t('general.selectTheme')"
          v-model="uiStore.currentTheme"
          :options="themeOptions"
          :disabled="!isEditing"
          @change="changeAppTheme(uiStore.currentTheme)"
        />
      </div>
    </div>

    <UiDivider :label="$t('general.soundAndNotifications')" :icon="BellAlertIcon" color="purple" size="md" />

    <div class="mb-8 p-6 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg shadow-sm">
      <p class="text-purple-700 dark:text-purple-300 mb-4">
        {{ $t('general.soundAndNotificationsDescription') }}
      </p>

      <div class="flex items-center justify-between py-2">
        <label for="toggleAlertSounds" class="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
          {{ $t('general.activateAlertSounds') }}
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
            {{ $t('general.activateAlertSoundsHelp') }}
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
        {{ $t('general.browserAutoplayNote') }}
      </p>
    </div>


    <div class="mt-8 flex justify-end space-x-4">
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PencilIcon class="w-5 h-5 mr-2" /> {{ $t('general.editSettings') }}
      </button>

      <button
        v-if="isEditing"
        @click="cancelEditing"
        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        {{ $t('general.cancel') }}
      </button>

      <button
        v-if="isEditing"
        @click="saveSettings"
        :disabled="isSaving"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <template v-if="isSaving">
          <UiSpinner class="w-5 h-5 mr-2" /> {{ $t('general.saving') }}
        </template>
        <template v-else>
          <CheckCircleIcon class="w-5 h-5 mr-2" /> {{ $t('general.saveChanges') }}
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUiStore } from '../../../stores/uiStore';
import { useGlobalToast } from '../../../composables/useGlobalToast';
import { useI18n } from 'vue-i18n';

// Importa tus componentes UI
import UiInputEmail from '../../../components/ui/UiInputEmail.vue';
import UiInputText from '../../../components/ui/UiInputText.vue';
import UiSelect from '../../../components/ui/UiSelect.vue';
import UiTextarea from '../../../components/ui/UiTextarea.vue';
import UiDivider from '../../../components/ui/UiDivider.vue';

import UiSwitch from '../../../components/ui/UiSwitch.vue';
import UiSpinner from '../../../components/ui/UiSpinner.vue';

import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckCircleIcon,
  BellAlertIcon,
  SunIcon
} from '@heroicons/vue/24/outline';

const uiStore = useUiStore();
const $toast = useGlobalToast();
const { t, locale } = useI18n();

const isEditing = ref(false);
const isSaving = ref(false);

const initialSettings = {
  companyInfo: {
    name: 'Tech Solutions S.A. de C.V.',
    address: 'Av. Siempre Viva 123, Col. Springfield, C.P. 01234, Ciudad de México',
    phone: '+52 55 1234 5678',
    email: 'contacto@techsolutions.com.mx',
    logoUrl: '/public/nsip-logo_opt_original_mini.png',
  },
  locale: {
    language: uiStore.currentLanguage,
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    currencyFormat: 'MXN',
  },
  theme: {
    appTheme: uiStore.currentTheme,
  }
};

const settings = ref({ ...initialSettings });
const originalSettings = ref(null);

// Opciones para UiSelect
const languageOptions = computed(() => [
  { value: 'es', label: t('general.languageOptions.es') },
  { value: 'en', label: t('general.languageOptions.en') },
  { value: 'fr', label: t('general.languageOptions.fr') },
]);

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

const themeOptions = computed(() => [
  { value: 'light', label: t('general.themeLight') },
  { value: 'dark', label: t('general.themeDark') },
]);


const saveSettings = () => {
  isSaving.value = true;
  setTimeout(() => {
    uiStore.setTheme(settings.value.theme.appTheme);
    uiStore.setLanguage(settings.value.locale.language);

    console.log('Guardando configuración (simulado):', settings.value);
    originalSettings.value = { ...settings.value };
    isEditing.value = false;
    isSaving.value = false;
    $toast.success(t('general.settingsSavedSuccess'));
  }, 1500);
};

const cancelEditing = () => {
  if (originalSettings.value) {
    settings.value = { ...originalSettings.value };
  } else {
    settings.value = { ...initialSettings };
  }
  isEditing.value = false;
  $toast.info(t('general.editCanceled'));
};

const startEditing = () => {
  originalSettings.value = { ...settings.value };
  isEditing.value = true;
};

// Lógica ajustada para el switch de sonido
const handleToggleAlertSounds = (newValue) => {
  // newValue es el valor actualizado de uiStore.areAlertSoundsMuted
  if (newValue) { // Si uiStore.areAlertSoundsMuted es true, significa que se muteó
    $toast.info(t('general.alertSoundsDisabled'));
  } else { // Si uiStore.areAlertSoundsMuted es false, significa que se activó (desmuteó)
    $toast.success(t('general.alertSoundsEnabled'));
  }
};

const showLogoUploadAlert = () => {
  $toast.info(t('general.logoUploadSimulated'));
};

const changeAppLanguage = (lang) => {
  locale.value = lang;
  $toast.info(t('general.languageChangedTo', { lang: t(`general.languageOptions.${lang}`) }));
};

const changeAppTheme = (theme) => {
  $toast.info(t('general.themeChangedTo', { theme: theme === 'dark' ? t('general.themeDark') : t('general.themeLight') }));
};

onMounted(() => {
  settings.value.locale.language = uiStore.currentLanguage;
  settings.value.theme.appTheme = uiStore.currentTheme;
  originalSettings.value = { ...settings.value };
});
</script>

<style scoped>
/* No se necesitan estilos adicionales con Tailwind CSS */
</style>