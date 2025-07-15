<template>
  <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Verificar tu Correo Electrónico</h2>

    <div v-if="isLoading" class="flex flex-col items-center justify-center p-8">
      <UiSpinner class="h-10 w-10 text-indigo-500" />
      <p class="mt-4 text-gray-600 dark:text-gray-300">Cargando estado de verificación...</p>
    </div>

    <div v-else>
      <div v-if="isEmailVerified" class="text-green-600 dark:text-green-400">
        <svg class="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="text-lg font-semibold">¡Tu correo electrónico ha sido verificado!</p>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Gracias por verificar tu cuenta. Ya puedes disfrutar de todas las funcionalidades.</p>
        <UiButton @click="$router.push({ name: 'profile-overview' })" class="mt-6">
          Volver a Mi Perfil
        </UiButton>
      </div>

      <div v-else class="text-amber-600 dark:text-amber-400">
        <svg class="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="text-lg font-semibold">Tu correo electrónico no ha sido verificado.</p>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Por favor, verifica tu bandeja de entrada para un enlace de verificación.</p>

        <UiButton
          @click="resendVerification"
          :disabled="isResending"
          class="mt-6"
          :class="{ 'opacity-50 cursor-not-allowed': isResending }"
        >
          <UiSpinner v-if="isResending" class="inline h-4 w-4 mr-2" />
          {{ isResending ? 'Enviando...' : 'Reenviar Enlace de Verificación' }}
        </UiButton>

        <p v-if="resendMessage" :class="resendSuccess ? 'text-green-500' : 'text-red-500'" class="mt-4 text-sm">{{ resendMessage }}</p>

        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Si no encuentras el email, revisa tu carpeta de spam.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { profileService } from '@/services/profileService';
import UiButton from '@/components/ui/UiButton.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import { useGlobalToast } from '@/composables/useGlobalToast';

const $toast = useGlobalToast();

const userData = ref(null);
const isLoading = ref(true);
const isEmailVerified = ref(false);
const isResending = ref(false);
const resendMessage = ref('');
const resendSuccess = ref(false);

const fetchProfileStatus = async () => {
  isLoading.value = true;
  try {
    const response = await profileService.getProfile();
    userData.value = response;
    isEmailVerified.value = response.email_verified;
  } catch (error) {
    console.error("Error al cargar el estado de verificación:", error);
    $toast?.error("Error al cargar el estado de verificación.");
  } finally {
    isLoading.value = false;
  }
};

const resendVerification = async () => {
  isResending.value = true;
  resendMessage.value = '';
  resendSuccess.value = false;
  try {
    const response = await profileService.sendVerificationEmail();
    resendSuccess.value = response.success;
    resendMessage.value = response.message || 'Enlace de verificación enviado. Revisa tu bandeja de entrada.';
    $toast?.success('¡Enlace de verificación enviado!');
    // Opcional: Después de enviar, podrías querer recargar el estado del perfil
    // setTimeout(() => fetchProfileStatus(), 3000); // Dar tiempo para que el email llegue y sea procesado si es el caso
  } catch (error) {
    console.error("Error al reenviar el email de verificación:", error);
    resendSuccess.value = false;
    resendMessage.value = error.response?.data?.message || 'Error al enviar el enlace. Intenta de nuevo.';
    $toast?.error('Error al enviar el enlace de verificación.');
  } finally {
    isResending.value = false;
  }
};

onMounted(fetchProfileStatus);
</script>

<style scoped>
/* Estilos adicionales si fueran necesarios, Tailwind CSS es suficiente */
</style>