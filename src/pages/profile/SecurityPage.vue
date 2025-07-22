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
        @click="showLogoutOtherDevicesConfirm" :disabled="isLoggingOut"
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
        @click="showLogoutCurrentConfirm" :disabled="isLoggingOutCurrent"
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
import { useAuthStore } from '@/stores/authStore';
import { useGlobalModal } from '@/composables/useGlobalModal'; // NUEVO: Importa el servicio de modal global
import LogoutConfirmModal from '@/components/modals/LogoutConfirmModal.vue'; // NUEVO: Importa tu modal de confirmación

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMobileScreenButton, faRightFromBracket, faDoorOpen, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faMobileScreenButton, faRightFromBracket, faDoorOpen, faSignOutAlt);

const $toast = useGlobalToast();
const router = useRouter();
const authStore = useAuthStore();
const $modal = useGlobalModal(); // NUEVO: Instancia el servicio de modal

const isLoggingOut = ref(false);
const isLoggingOutCurrent = ref(false);

// NUEVA FUNCIÓN: Muestra el modal de confirmación para cerrar sesión en otros dispositivos
const showLogoutOtherDevicesConfirm = async () => {
  try {
    const result = await $modal.showModal(
      LogoutConfirmModal,
      {
        // Puedes pasarle props específicas al modal si es necesario,
        // aunque para este modal genérico de confirmación no es estrictamente necesario.
      },
      {
        // Opciones para el ModalContainer:
        title: 'Cerrar Sesiones Activas', // Un título más específico para el encabezado del modal
        closeOnClickOutside: false, // Fuerza al usuario a interactuar con los botones
        width: 'max-w-md'
      }
    );

    // Si el usuario confirmó el cierre de sesión
    if (result && result.action === 'confirm' && result.payload.logout) {
      isLoggingOut.value = true;
      try {
        const response = await profileService.logoutOtherDevices();
        console.log('Sesiones cerradas en otros dispositivos:', response);
        $toast?.success(response.message || 'Sesiones cerradas en otros dispositivos exitosamente.');
      } catch (error) {
        console.error("Error al cerrar sesión en otros dispositivos:", error);
        $toast?.error(error.response?.data?.message || 'Error al cerrar sesión en otros dispositivos.');
      } finally {
        isLoggingOut.value = false;
        $modal.hideModal(result.id); // Oculta el modal manualmente
      }
    } else {
      // Si el usuario canceló
      console.log('Cierre de sesión en otros dispositivos cancelado.');
      $modal.hideModal(result.id); // Oculta el modal si fue cancelado
    }
  } catch (error) {
    console.error('Error al mostrar o manejar el modal de cierre de sesión en otros dispositivos:', error);
    // Asegúrate de ocultar el modal si algo salió mal antes de que se mostrara completamente
    // Esto es un catch general, podrías necesitar manejo más específico.
  }
};

// NUEVA FUNCIÓN: Muestra el modal de confirmación para cerrar la sesión actual
const showLogoutCurrentConfirm = async () => {
  try {
    const result = await $modal.showModal(
      LogoutConfirmModal,
      {},
      {
        title: 'Confirmar Cierre de Sesión', // Un título más específico para el encabezado del modal
        closeOnClickOutside: true,
        width: 'max-w-md'
      }
    );

    // Si el usuario confirmó el cierre de sesión
    if (result && result.action === 'confirm' && result.payload.logout) {
      isLoggingOutCurrent.value = true;
      try {
        await authStore.logout();

        $toast?.success('Sesión cerrada exitosamente.');
        router.push({ name: 'login' }); // Redirige a la página de login
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        $toast?.error(error.response?.data?.message || 'Error al cerrar sesión.');
      } finally {
        isLoggingOutCurrent.value = false;
        $modal.hideModal(result.id); // Oculta el modal manualmente
      }
    } else {
      // Si el usuario canceló
      console.log('Cierre de sesión actual cancelado.');
      $modal.hideModal(result.id); // Oculta el modal si fue cancelado
    }
  } catch (error) {
    console.error('Error al mostrar o manejar el modal de cierre de sesión actual:', error);
  }
};

// Eliminamos las funciones confirmLogoutOtherDevices y confirmLogout originales
// ya que ahora sus lógicas están dentro de las nuevas funciones show...Confirm
</script>

<style scoped>
/* Estilos adicionales si fueran necesarios */


</style>