<!-- src/pages/auth/ForcePasswordChangePage.vue -->
<template>
  <div class="w-full p-4 sm:max-w-md md:max-w-xl lg:max-w-3xl sm:px-8">
    <div class="space-x-4 mb-4 sm:mb-10">
      <h1 class="text-2xl sm:text-4xl font-bold">Cambio de Contraseña Obligatorio</h1>
      <p class="text-gray-600 text-sm sm:text-base">Por favor, establezca una nueva contraseña para su cuenta por motivos de seguridad.</p>
    </div>

    <form @submit.prevent="handleChangePassword" class="mt-4 flex flex-col items-center text-sm sm:text-base">
      <UiInputPassword label="Contraseña Actual" class="mb-4" v-model="currentPassword" placelholder="Su contraseña temporal" />
      <UiInputPassword label="Nueva Contraseña" class="mb-4" v-model="newPassword" placelholder="Su nueva contraseña"  />
      <UiInputPassword label="Confirmar Nueva Contraseña" class="mb-6" v-model="newPasswordConfirmation"  placelholder="Confirme su nueva contraseña" />

      <UiButton type="submit" variant="primary">Cambiar Contraseña</UiButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import UiInputPassword from '../../components/ui/UiInputPassword.vue';
import UiButton from "@/components/ui/UiButton.vue";
import { useGlobalToast } from '../../composables/useGlobalToast';

const currentPassword = ref('');
const newPassword = ref('');
const newPasswordConfirmation = ref('');

const router = useRouter();
const auth = useAuthStore();
const $toast = useGlobalToast();

const handleChangePassword = async () => {
  if (newPassword.value !== newPasswordConfirmation.value) {
    $toast.error('Las nuevas contraseñas no coinciden.');
    return;
  }

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
    $toast.error(error.response.data?.message || 'Error desconocido al cambiar la contraseña.');
  }
};
</script>

<style scoped>
/* Tus estilos específicos para esta página */
</style>