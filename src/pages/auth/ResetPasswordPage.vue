<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Restablecer Contraseña</h1>
      <p class="text-gray-600 mb-8">
        Ingresa tu nueva contraseña segura para la cuenta:
        <span class="font-semibold text-gray-800">{{ currentEmailDisplay }}</span>
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
          :is-loading="isLoading"
        >
          Restablecer Contraseña
        </UiButton>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'; // Agregamos onMounted
import { useRouter } from 'vue-router'; // Ya no necesitamos useRoute directamente
import UiButton from '../../components/ui/UiButton.vue';
import UiInputPassword from '../../components/ui/UiInputPassword.vue';
import { usePasswordResetStore } from '@/stores/passwordResetStore'; // Importamos el store de Pinia
import { authService } from '@/services/authService'; // Importamos tu servicio
import { useGlobalModal } from '../../composables/useGlobalModal';
import { useGlobalToast } from '../../composables/useGlobalToast';
import InfoMessageModal from '../../components/modals/InfoMessageModal.vue';

const router = useRouter();

// Obtenemos la instancia de nuestro store de Pinia
const passwordResetStore = usePasswordResetStore();
const $modal = useGlobalModal();
const $toast = useGlobalToast();

// Usamos el email del store de Pinia para mostrarlo
// Y el verificationCode también lo obtendremos del store
const currentEmailDisplay = computed(() => {
  const emailFromStore = passwordResetStore.email;
  // Si no hay email o código en el store, redirige al inicio del flujo
  if (!emailFromStore) {
    console.warn('Email no encontrado en el store de Pinia. Redirigiendo a ForgotPasswordPage.');
    $modal?.showModal(
        InfoMessageModal,
        {
          message: 'Información de recuperación incompleta. Por favor, inicia el proceso desde el principio.',
          buttonText: 'Aceptar'
        },
        {
          title: 'Error de Datos'
        }
      ).then(() => {
        router.replace('/auth/forgot-password');
      });
    return 'cargando...'; // Texto temporal
  }
  // Ofusca el email para mostrar solo el inicio y el dominio para seguridad
  const [name, domain] = emailFromStore.split('@');
  const maskedName = name.slice(0, 3) + '...' + name.slice(-3);
  return `${maskedName}@${domain}`;
});

const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const isLoading = ref(false); // Para mostrar estado de carga en el botón

// Validaciones
const validatePassword = () => {
  passwordError.value = '';
  if (password.value.length < 8) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres.';
  }
  // Añade más reglas de contraseña aquí si es necesario (ej. mayúsculas, números, símbolos)
  // Re-validar la confirmación cuando la contraseña principal cambia
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
  // Asegúrate de que las contraseñas no estén vacías y que no haya errores de validación
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

  // Doble verificación de que el email y el código estén en el store
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
      router.replace('/auth/forgot-password');
    });
    router.replace('/auth/forgot-password'); // Redirige al inicio del flujo
    return;
  }

  isLoading.value = true; // Activar el estado de carga

  try {
    const dataToSend = {
      email: emailToReset,
      code: codeToReset, // El backend espera 'code', no 'verificationCode'
      password: password.value,
      password_confirmation: confirmPassword.value, // Asegúrate que el backend espera este nombre de campo
    };

    // Llama a tu API para restablecer la contraseña
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
      // Navega DESPUÉS de que el usuario cierre el modal de éxito
      router.push('/auth/login');
      passwordResetStore.clearState(); // Limpiar el estado de Pinia aquí, después de la navegación
    });
    
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    // Manejo de errores: mostrar un mensaje al usuario
    // El backend podría indicar si el código expiró, si el email no coincide con el código, etc.
    $toast?.error('Hubo un error al restablecer la contraseña. Asegúrate que el código es válido y que las contraseñas coinciden.');
    // Si el error es debido a un código inválido/expirado, podríamos redirigir al paso de verificación o incluso al inicio.
    // router.replace('/auth/verify-reset-code'); // O incluso '/auth/forgot-password'
  } finally {
    isLoading.value = false; // Desactivar el estado de carga
  }
};

onMounted(() => {
  // Asegurarse de que el email y el código estén en el store al montar
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

<style scoped>
/* Tus estilos aquí */
</style>