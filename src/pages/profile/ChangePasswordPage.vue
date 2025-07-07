<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cambiar Contraseña</h2>
    
    <form @submit.prevent="changePassword">
      <div class="space-y-4">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Actual</label>
          <UiInputPassword
            id="currentPassword"
            v-model="currentPassword"
            placeholder="Ingresa tu contraseña actual"
          />
          <p v-if="currentPasswordError" class="mt-1 text-sm text-red-500">{{ currentPasswordError }}</p>
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
          <UiInputPassword
            id="newPassword"
            v-model="newPassword"
            placeholder="Mínimo 8 caracteres"
          />
          <p v-if="newPasswordError" class="mt-1 text-sm text-red-500">{{ newPasswordError }}</p>
        </div>

        <div>
          <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
          <UiInputPassword
            id="confirmNewPassword"
            v-model="confirmNewPassword"
            placeholder="Repite tu nueva contraseña"
          />
          <p v-if="confirmNewPasswordError" class="mt-1 text-sm text-red-500">{{ confirmNewPasswordError }}</p>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <router-link :to="{ name: 'profile' }">
            <UiButton variant="secondary" type="button">Cancelar</UiButton>
          </router-link>
          <UiButton variant="primary" type="submit">Cambiar Contraseña</UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiInputPassword from '@/components/ui/UiInputPassword.vue'; // Asumo que tienes este componente

const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const currentPasswordError = ref('');
const newPasswordError = ref('');
const confirmNewPasswordError = ref('');

const validateForm = () => {
  currentPasswordError.value = '';
  newPasswordError.value = '';
  confirmNewPasswordError.value = '';

  let isValid = true;

  if (currentPassword.value.length < 1) {
    currentPasswordError.value = 'Ingresa tu contraseña actual.';
    isValid = false;
  }

  if (newPassword.value.length < 8) {
    newPasswordError.value = 'La nueva contraseña debe tener al menos 8 caracteres.';
    isValid = false;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    confirmNewPasswordError.value = 'Las contraseñas no coinciden.';
    isValid = false;
  }

  if (newPassword.value === currentPassword.value && newPassword.value.length >= 8) {
    newPasswordError.value = 'La nueva contraseña no puede ser igual a la actual.';
    isValid = false;
  }

  return isValid;
};

const changePassword = () => {
  if (!validateForm()) {
    alert('Por favor, corrige los errores en el formulario.');
    return;
  }

  // Lógica para cambiar la contraseña (futuramente con API)
  console.log('Cambiando contraseña:', {
    current: currentPassword.value,
    new: newPassword.value,
  });
  alert('Contraseña cambiada exitosamente (simulado)');
  // Limpiar campos después de un cambio exitoso simulado
  currentPassword.value = '';
  newPassword.value = '';
  confirmNewPassword.value = '';
  // router.push({ name: 'profile' }); // Redirigir de vuelta al perfil después de cambiar
};
</script>

<style scoped>
/* No se necesitan estilos específicos */
</style>