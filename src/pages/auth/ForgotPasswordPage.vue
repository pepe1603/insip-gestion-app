<template>
  <div class="flex flex-col items-center">
    <div class="p-4 grid place-items-center text-center space-y-4">
      <h1 class="text-4xl font-semibold mb-14">Recupera tu cuenta</h1>
      <p class="text-gray-600">
        Ingresa el correo electrónico para recibir el Código de verificación y continuar con la recuperación.
        <router-link class="hover:text-blue-600 underline" to="/auth/login">Regresar</router-link>
      </p>
      <UiInputEmail class="mb-6 max-w-md " v-model="email" placeholder="empleado@example.com" />
      <UiButton :icon="paperAirplaneIcon" variant="primary" class="my-4" @click="sendRecoveryRequest" :is-loading="isLoading">
        Enviar
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'; // Importamos onMounted
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid';
import UiButton from '../../components/ui/UiButton.vue';
import UiInputEmail from '../../components/ui/UiInputEmail.vue';
import { useRouter } from 'vue-router';
import { usePasswordResetStore } from '@/stores/passwordResetStore'; // Importamos el store de Pinia
import { authService } from '@/services/authService'; // Importamos tu servicio
import { useGlobalModal } from '../../composables/useGlobalModal';
import InfoMessageModal from '../../components/modals/InfoMessageModal.vue';
import { useGlobalToast } from '../../composables/useGlobalToast';
const router = useRouter();
const email = ref('');
const paperAirplaneIcon = PaperAirplaneIcon;
const isLoading = ref(false); // Para mostrar un estado de carga en el botón

// Obtenemos la instancia de nuestro store de Pinia
const passwordResetStore = usePasswordResetStore();
const $modal = useGlobalModal(); //<-- Obtbenemos instancia del modal global
const $toast = useGlobalToast();

// Limpiamos el estado de Pinia cada vez que se carga este componente
// Esto asegura que cada intento de recuperación de contraseña comienza "limpio"
onMounted(() => {
  passwordResetStore.clearState();
});

const sendRecoveryRequest = async () => {
  if (!email.value) {
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Por favor, ingressa tu correo electronico.',
        buttonText: 'Entendido'
      },
      {title: 'Campo Requerido'}
    );
    return;
  }

  isLoading.value = true; // Activar el estado de carga

  try {
    // Llamar al servicio de autenticación para solicitar el código
    await authService.forgotPassword(email.value);

    // Si la solicitud es exitosa, guardar el email en el store de Pinia
    passwordResetStore.setEmail(email.value);

    //alert(`Se ha enviado un código de verificación a ${email.value}. Revisa tu bandeja de entrada.`);
    $modal?.showModal(
      InfoMessageModal,
      {
        message: `Se ha enviado un código de verificación a ${email.value}. Revisa tu bandeja de entrada.`,
        buttonText: 'Aceptar'
      },
      {title: 'Coddigo Enviado'}
    );
    // Redirigir a la página de verificación SIN pasar el email en la URL
    router.push({
      path: '/auth/verify-reset-code'
    });

  } catch (error) {
    console.error('Error al solicitar el código de recuperación:', error);
    // Manejo de errores: mostrar un mensaje al usuario
    // Podrías tener un sistema de notificación más robusto aquí
    //alert('Hubo un error al enviar la solicitud. Por favor, verifica tu correo e inténtalo de nuevo.');
    $toast?.error('Hubo un error al enviar la solicitud. Por favor, verifica tu correo e inténtalo de nuevo.');
    $toast?.error(error.response.data?.message);
  } finally {
    isLoading.value = false; // Desactivar el estado de carga
  }
};
</script>

<style>
/* Tus estilos aquí */
</style>