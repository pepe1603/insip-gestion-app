<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center dark:bg-slate-800">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Restablecer Contraseña</h1>
      <p class="text-gray-600 mb-8">
        Ingresa tu nueva contraseña segura para la cuenta:
        <span class="font-semibold text-gray-800 dark:text-gray-500">{{ currentEmailDisplay }}</span>
      </p>

      <form @submit.prevent="resetPassword">
        <div class="mb-4">
          <UiInputPassword
            label="Nueva Contraseña"
            type="password"
            id="password"
            v-model="password"
            @input="validatePassword"
            class="text-left mb-1"
            :class="{ 'border-red-500': passwordError }"
            placeholder="Mínimo 8 caracteres"
          />
          <p v-if="passwordError" class="text-red-500 text-xs italic">{{ passwordError }}</p>
        </div>

        <UiInputPassword
          label="Confirmar Contraseña"
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          @input="validateConfirmPassword"
          class="text-left mb-1"
          :class="{ 'border-red-500': confirmPasswordError }"
          placeholder="Repite tu nueva contraseña"
        />
        <p v-if="confirmPasswordError" class="text-red-500 text-xs italic">{{ confirmPasswordError }}</p>

        <UiButton
          type="submit"
          class="mt-8"
          variant="primary"
          :disabled="!isFormValid || isLoading"
        >
        <UiSpinner v-if="isLoading" class="text-current size-5 mr-1" />
          Restablecer Contraseña
        </UiButton>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from '@/components/ui/UiButton.vue';
import UiInputPassword from '@/components/ui/UiInputPassword.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import { usePasswordResetStore } from '@/stores/passwordResetStore';
import { authService } from '@/services/authService';
import { useGlobalModal } from '@/composables/useGlobalModal';
import { useGlobalToast } from '@/composables/useGlobalToast';
import InfoMessageModal from '@/components/modals/InfoMessageModal.vue';

const router = useRouter();
const passwordResetStore = usePasswordResetStore();
const $modal = useGlobalModal();
const $toast = useGlobalToast();

const currentEmailDisplay = computed(() => {
  const emailFromStore = passwordResetStore.email;
  // Ya no es necesario este bloque de validación aquí, se hace en onMounted
  if (!emailFromStore) {
    return 'cargando...';
  }
  const [name, domain] = emailFromStore.split('@');
  const maskedName = name.slice(0, 3) + '...' + name.slice(-3);
  return `${maskedName}@${domain}`;
});

const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const isLoading = ref(false);

const validatePassword = () => {
  passwordError.value = '';
  if (password.value.length < 8) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (confirmPassword.value !== '') {
    validateConfirmPassword();
  }
};

const validateConfirmPassword = () => {
  confirmPasswordError.value = '';
  if (confirmPassword.value === '') {
    confirmPasswordError.value = 'Por favor, confirma tu contraseña.';
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Las contraseñas no coinciden.';
  }
};

const isFormValid = computed(() => {
  return password.value !== '' && confirmPassword.value !== '' &&
         !passwordError.value && !confirmPasswordError.value;
});

const resetPassword = async () => {
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) {
      $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Por favor, corrige los errores en el formulario.',
        buttonText: 'Entendido'
      },
      {
        title: 'Errores de Formulario'
      }
    );
    return;
  }

  const emailToReset = passwordResetStore.email;
  const codeToReset = passwordResetStore.verificationCode;

  if (!emailToReset || !codeToReset) {
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Información de recuperación incompleta. Por favor, reinicia el proceso desde el principio.',
        buttonText: 'Aceptar'
      },
      {
        title: 'Error de Datos'
      }
    ).then(() => {
      passwordResetStore.clearState(); // Limpiar el estado aquí si algo va mal
      router.replace('/auth/forgot-password');
    });
    return;
  }

  isLoading.value = true;

  try {
    const dataToSend = {
      email: emailToReset,
      code: codeToReset,
      password: password.value,
      password_confirmation: confirmPassword.value,
    };

    await authService.resetPassword(dataToSend);

    $modal?.showModal(
      InfoMessageModal,
      {
        message: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión con tu nueva contraseña.',
        buttonText: 'Ir a Iniciar Sesión'
      },
      {
        title: 'Restablecimiento Exitoso'
      }
    ).then(() => {
      // 🚨 CAMBIO CLAVE: Limpiamos el estado ANTES de navegar.
      passwordResetStore.clearState();
      router.push({ name: 'login' });
    });
    
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    $toast?.error('Hubo un error al restablecer la contraseña. Asegúrate que el código es válido.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Esta lógica se mantiene para validar que el estado existe al cargar el componente
  if (!passwordResetStore.email || !passwordResetStore.verificationCode) {
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Información de recuperación incompleta. Por favor, inicia el proceso desde el principio.',
        buttonText: 'Aceptar'
      },
      {
        title: 'Flujo Incompleto'
      }
    ).then(() => {
      router.replace('/auth/forgot-password');
    });
  }
});
</script>