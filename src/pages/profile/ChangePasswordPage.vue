<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cambiar Contraseña</h2>

    <form @submit.prevent="changePassword">
      <div class="space-y-4">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Actual</label>
          <UiInputPassword
            id="currentPassword"
            v-model="passwordForm.current_password"
            placeholder="Ingresa tu contraseña actual"
            :disabled="isChangingPassword"
            required
          />
          <p v-if="validationErrors.current_password" class="mt-1 text-sm text-red-500">{{ validationErrors.current_password[0] }}</p>
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
          <UiInputPassword
            id="newPassword"
            v-model="passwordForm.password"
            placeholder="Mínimo 8 caracteres"
            :disabled="isChangingPassword"
            required
          />
          <p v-if="validationErrors.password" class="mt-1 text-sm text-red-500">{{ validationErrors.password[0] }}</p>
        </div>

        <div>
          <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
          <UiInputPassword
            id="confirmNewPassword"
            v-model="passwordForm.password_confirmation"
            placeholder="Repite tu nueva contraseña"
            :disabled="isChangingPassword"
            required
          />
          <p v-if="validationErrors.password_confirmation" class="mt-1 text-sm text-red-500">{{ validationErrors.password_confirmation[0] }}</p>
          <p v-if="passwordForm.password && passwordForm.password_confirmation && passwordForm.password !== passwordForm.password_confirmation && !validationErrors.password_confirmation" class="mt-1 text-sm text-red-500">Las contraseñas no coinciden.</p>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <router-link :to="{ name: 'profile-details' }">
            <UiButton variant="secondary" type="button" :disabled="isChangingPassword">Cancelar</UiButton>
          </router-link>
          <UiButton variant="primary" type="submit" :disabled="isChangingPassword">
            <UiSpinner v-if="isChangingPassword" class="inline h-4 w-4 mr-2" />
            {{ isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
          </UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiInputPassword from '@/components/ui/UiInputPassword.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue'; // Necesario para el botón de guardar
import { profileService } from '@/services/profileService';
import { useGlobalToast } from '@/composables/useGlobalToast';
import { useRouter } from 'vue-router';

const $toast = useGlobalToast();
const router = useRouter();

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
});

const isChangingPassword = ref(false);
const validationErrors = ref({}); // Para errores de validación del backend

const changePassword = async () => {
  isChangingPassword.value = true;
  validationErrors.value = {}; // Limpiar errores previos

  try {
    const response = await profileService.updatePassword(passwordForm);
    $toast?.success(response.message || 'Contraseña actualizada exitosamente.');

    // Limpiar campos después de un cambio exitoso
    passwordForm.current_password = '';
    passwordForm.password = '';
    passwordForm.password_confirmation = '';

    router.push({ name: 'profile-overview' }); // Redirigir de vuelta al perfil
  } catch (err) {
    console.error("Error al cambiar contraseña:", err);
    if (err.response && err.response.status === 422) {
      validationErrors.value = err.response.data.data.error;
      $toast?.error('Por favor, corrige los errores en el formulario.');
    } else {
      $toast?.error(err.response?.data?.data?.error || 'Error al actualizar la contraseña.');
    }
  } finally {
    isChangingPassword.value = false;
  }
};
</script>

<style scoped>
/* No se necesitan estilos específicos */
</style>