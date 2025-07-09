<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Seguridad de la Cuenta</h2>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'mobile-screen-button']" class="mr-2 text-indigo-500" />
        Sesiones Activas
      </h3>
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Si sospechas que tu cuenta ha sido accedida desde otro lugar o simplemente quieres cerrar todas las sesiones excepto la actual, haz clic en el botón de abajo.
      </p>
      <UiButton
        @click="confirmLogoutOtherDevices"
        :disabled="isLoggingOut"
        variant="outline-error"
        class="w-full sm:w-auto"
      >
        <UiSpinner v-if="isLoggingOut" class="inline h-4 w-4 mr-2" />
        <font-awesome-icon v-else :icon="['fas', 'right-from-bracket']" class="mr-2" />
        {{ isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión en Otros Dispositivos' }}
      </UiButton>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'door-open']" class="mr-2 text-indigo-500" />
        Cerrar Sesión (Dispositivo Actual)
      </h3>
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Para cerrar tu sesión únicamente en este dispositivo.
      </p>
      <UiButton
        @click="confirmLogout"
        :disabled="isLoggingOutCurrent"
        variant="secondary"
        class="w-full sm:w-auto"
      >
        <UiSpinner v-if="isLoggingOutCurrent" class="inline h-4 w-4 mr-2" />
        <font-awesome-icon v-else :icon="['fas', 'sign-out-alt']" class="mr-2" />
        {{ isLoggingOutCurrent ? 'Cerrando...' : 'Cerrar Sesión' }}
      </UiButton>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import { profileService } from '@/services/profileService';
import { useGlobalToast } from '@/composables/useGlobalToast';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Importar tu authStore

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMobileScreenButton, faRightFromBracket, faDoorOpen, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faMobileScreenButton, faRightFromBracket, faDoorOpen, faSignOutAlt);

const $toast = useGlobalToast();
const router = useRouter();
const authStore = useAuthStore(); // Instanciar tu authStore

const isLoggingOut = ref(false);
const isLoggingOutCurrent = ref(false);

const confirmLogoutOtherDevices = async () => {
  if (!confirm('¿Estás seguro de que quieres cerrar la sesión en todos los demás dispositivos?')) {
    return;
  }

  isLoggingOut.value = true;
  try {
    const response = await profileService.logoutOtherDevices();
    $toast?.success(response.message || 'Sesiones cerradas en otros dispositivos exitosamente.');
  } catch (error) {
    console.error("Error al cerrar sesión en otros dispositivos:", error);
    $toast?.error(error.response?.data?.message || 'Error al cerrar sesión en otros dispositivos.');
  } finally {
    isLoggingOut.value = false;
  }
};

const confirmLogout = async () => {
  if (!confirm('¿Estás seguro de que quieres cerrar tu sesión actual?')) {
    return;
  }

  isLoggingOutCurrent.value = true;
  try {
    // Llama a la acción logout de tu authStore, que a su vez maneja:
    // 1. La llamada al endpoint `/logout` del backend.
    // 2. La limpieza del estado del Pinia store (user, token).
    // 3. La eliminación del token de localStorage.
    await authStore.logout(); 
    
    $toast?.success('Sesión cerrada exitosamente.');
    router.push({ name: 'login' }); // Redirige a la página de login
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    $toast?.error(error.response?.data?.message || 'Error al cerrar sesión.');
  } finally {
    isLoggingOutCurrent.value = false;
  }
};
</script>

<style scoped>
/* Estilos adicionales si fueran necesarios */
</style>