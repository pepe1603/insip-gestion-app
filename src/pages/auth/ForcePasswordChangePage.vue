<template>
  <div class="w-full p-4 sm:max-w-md md:max-w-xl lg:max-w-3xl sm:px-8">
    <div class="space-y-4 mb-6 sm:mb-10 text-center">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white">Cambio de Contraseña Obligatorio</h1>
      <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-2">
        Por favor, establezca una nueva contraseña para su cuenta por motivos de seguridad.
        Este paso es indispensable para poder acceder a las funcionalidades de la aplicación.
      </p>
    </div>

    <form @submit.prevent="handleChangePassword" class="mt-8 flex flex-col items-center text-sm sm:text-base">
      <UiInputPassword
        label="Contraseña Actual"
        class="mb-4 w-full"
        v-model="currentPassword"
        placeholder="Su contraseña temporal"
        id="current-password"
      />
      <UiInputPassword
        label="Nueva Contraseña"
        class="mb-4 w-full"
        v-model="newPassword"
        placeholder="Su nueva contraseña"
        id="new-password"
      />
      <UiInputPassword
        label="Confirmar Nueva Contraseña"
        class="mb-6 w-full"
        v-model="newPasswordConfirmation"
        placeholder="Confirme su nueva contraseña"
        id="confirm-new-password"
      />

      <div class="flex flex-col sm:flex-row justify-center gap-4 w-full mt-4 sm:mt-8">
        <UiButton
          type="submit"
          variant="primary"
          :disabled="isSubmitting"
          size="sm"
          :show-icon="true"
          :icon="KeyIcon"
          icon-position="left"        >
          <span v-if="!isSubmitting">Cambiar Contraseña  </span>
          <span v-else>Cambiando... <UiSpinner class="text-indigo-200 w-5 h-5 inline mr-1" /> </span>
        </UiButton>

        <UiButton

          variant="secondary"
          @click="handleCancel"
          :show-icon="true"
          :icon="ArrowRightOnRectangleIcon"
          icon-position="left"
          size="sm"
        >
          Cancelar y Cerrar Sesión
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import UiInputPassword from '../../components/ui/UiInputPassword.vue';
import UiButton from "@/components/ui/UiButton.vue";
import UiSpinner from "@/components/ui/UiSpinner.vue";
import { useGlobalToast } from '../../composables/useGlobalToast';
import { KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'; // Importar iconos

const currentPassword = ref('');
const newPassword = ref('');
const newPasswordConfirmation = ref('');
const isSubmitting = ref(false); // Para deshabilitar el botón durante el envío

const router = useRouter();
const auth = useAuthStore();
const $toast = useGlobalToast();

const handleChangePassword = async () => {
  if (newPassword.value !== newPasswordConfirmation.value) {
    $toast.error('Las nuevas contraseñas no coinciden.');
    return;
  }

  isSubmitting.value = true; // Deshabilitar el botón
  try {
    const result = await auth.forceChangePassword({
      current_password: currentPassword.value,
      new_password: newPassword.value,
      new_password_confirmation: newPasswordConfirmation.value,
    });

    if (result === 'PASSWORD_CHANGED_SUCCESS') {
      $toast.success('¡Contraseña cambiada exitosamente! Ahora puede acceder a la aplicación.');
      router.push('/profile'); // Redirigir al usuario al dashboard o página principal
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    $toast.error(error.response.data?.message || 'Error desconocido al cambiar la contraseña. Por favor, intente de nuevo.');
  } finally {
    isSubmitting.value = false; // Habilitar el botón nuevamente
  }
};

// 🚀 Nueva función para manejar la cancelación 🚀
const handleCancel = async () => {
  try {
    await auth.logout(); // Llama a la acción logout de tu store
    $toast.info('Se ha cancelado el cambio de contraseña. Sesión cerrada.');
    router.push('/auth/login'); // Redirigir a la página de login
  } catch (error) {
    console.error('Error al cancelar y cerrar sesión:', error);
    $toast.error('No se pudo cerrar la sesión correctamente. Por favor, recargue la página.');
    auth.clearAuthData(); // Asegurarse de que al menos los datos locales se limpien
    router.push('/auth/login'); // Intentar redirigir de todos modos
  }
};
</script>

<style scoped>
/* Tus estilos específicos para esta página */
</style>