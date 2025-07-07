<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Verifica tu código</h1>
      <p class="text-gray-600 mb-8">
        Ingresa el código de seguridad de 6 dígitos que enviamos a tu correo electrónico:
        <span class="font-semibold text-gray-800">{{ currentEmailDisplay }}</span>
      </p>

      <div class="flex justify-center gap-3 mb-8">
        <input
          v-for="(digit, index) in code"
          :key="index"
          type="text"
          maxlength="1"
          @input="handleInput($event, index)"
          @keydown="handleKeyDown($event, index)"
          :ref="el => inputRefs[index] = el"
          class="w-12 h-14 text-3xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
          :class="{'border-blue-500 ring-1 ring-blue-500': code[index] !== ''}"
        />
      </div>

      <UiButton
        class="w-full py-3 mb-6"
        variant="primary"
        @click="verifyCode"
        :disabled="!isCodeComplete || isLoading"
        :is-loading="isLoading"
      >
        Verificar
      </UiButton>

      <div class="text-sm">
        <p v-if="remainingTime > 0" class="text-gray-700">
          Puedes reenviar el código en
          <span class="font-semibold">{{ remainingTime }}s</span>
        </p>
        <p v-else class="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer" @click="resendCode" :class="{'opacity-50 cursor-not-allowed': isLoadingResend}">
          Reenviar código
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // Ya no necesitamos useRoute directamente para el email
import UiButton from '../../components/ui/UiButton.vue';
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
// Si no hay email en el store (ej. llegó directamente, lo que no debería pasar con el flujo correcto),
// se redirigirá o se mostrará un mensaje adecuado.
const currentEmailDisplay = computed(() => {
  const emailFromStore = passwordResetStore.email;
  // Si no hay email en el store, probablemente el usuario no pasó por ForgotPasswordPage
  // O el email es un dato crítico, podrías redirigir o mostrar un error.
  if (!emailFromStore) {
    console.warn('Email no encontrado en el store de Pinia. Redirigiendo a ForgotPasswordPage.');

    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'No se encontró un correo electronico asociado. Por favor, inicie el proceso de recuperación desde el principio.',
        buttonText: 'Aceptar'
      },
      {title: 'Flujo Incompleto'}
    ).then(()=>{
      router.push('/auth/forgot-password')
    });
    return 'cargando...'; // Texto temporal
  }
  // Ofusca el email para mostrar solo el inicio y el dominio para seguridad
  const [name, domain] = emailFromStore.split('@');
  const maskedName = name.slice(0, 3) + '...' + name.slice(-3);
  return `${maskedName}@${domain}`;
});

const code = ref(['', '', '', '', '', '']);
const inputRefs = ref<Array<HTMLInputElement | null>>([]);
const remainingTime = ref(0); // Tiempo inicial en segundos para el contador
let timer: ReturnType<typeof setTimeout> | null = null;
const isLoading = ref(false); // Para el botón de verificar
const isLoadingResend = ref(false); // Para el botón de reenviar

const isCodeComplete = computed(() => {
  return code.value.every(digit => digit !== '');
});

const startTimer = () => {
  if (timer) clearInterval(timer);
  remainingTime.value = 60; // Reiniciar tiempo a 60 segundos
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timer as ReturnType<typeof setTimeout>);
      timer = null;
    }
  }, 1000);
};

const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  if (value.length > 1) {
    input.value = value[0];
  }

  const digit = input.value.replace(/[^0-9]/g, '');
  code.value[index] = digit;

  if (digit && index < code.value.length - 1) {
    inputRefs.value[index + 1]?.focus();
  } else if (!digit && index > 0 && event.inputType === 'deleteContentBackward') {
    // Solo mover el foco hacia atrás al borrar si la celda actual está vacía
    inputRefs.value[index - 1]?.focus();
  }
};

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && code.value[index] === '' && index > 0) {
    inputRefs.value[index - 1]?.focus();
    code.value[index - 1] = ''; // Limpiar el dígito anterior al borrar
  }
  // Permite la navegación con flechas
  if (event.key === 'ArrowRight' && index < code.value.length - 1) {
    inputRefs.value[index + 1]?.focus();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
};

const verifyCode = async () => {
  if (!isCodeComplete.value) {
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Por favor, ingresa el codigo completo.',
        buttonText: 'Entendido'
      },
      {title: 'Requerido'}
    );
    return;
  }

  const enteredCode = code.value.join('');
  const emailToVerify = passwordResetStore.email;

  if (!emailToVerify) {
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'No se pudo encontrar el correo electrónico. Por favor, reinicia el proceso de recuperación.',
        title: 'Aceptar'
      },
      {title: 'Error de Datos'}
    ).then(()=>{
        router.replace('/auth/forgot-password'); // Redirigir al inicio del flujo
    });
    return;
  }

  isLoading.value = true; // Activar estado de carga

  try {
    // Llamar al servicio para verificar el código
    await authService.verifyResetCode({ email: emailToVerify, code: enteredCode });

    // Si la verificación es exitosa, guardar el código en el store de Pinia
    passwordResetStore.setVerificationCode(enteredCode);

// Reemplaza alert por modal de éxito
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Código verificado correctamente. Ahora puedes restablecer tu contraseña.',
        buttonText: 'Continuar'
      },
      {
        title: 'Verificación Exitosa'
      }
    ).then(() => {
      // Solo redirige después de que el usuario cierre el modal
      router.push({
        path: '/auth/reset-password'
      });
    });
  } catch (error) {
    $toast?.error('Error al verificar el código:', error);
    // Manejo de errores: código inválido, caducado, etc.
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'El código es inválido o ha caducado. Por favor, intenta de nuevo o solicita uno nuevo.',
        buttonText: 'Cerrar'
      },
      {
        title: 'Error de Verificación'
      }
    );
    code.value = ['', '', '', '', '', ''];
    inputRefs.value[0]?.focus();
  } finally {
    isLoading.value = false; // Desactivar estado de carga
  }
};

const resendCode = async () => {
  if (remainingTime.value > 0 || isLoadingResend.value) {
    return; // Evitar reenvío si el tiempo no ha terminado o ya está enviando
  }

  const emailToResend = passwordResetStore.email;

  if (!emailToResend) {
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'No se pudo encontrar el correo electrónico para reenviar el código. Por favor, reinicia el proceso.',
        buttonText: 'Aceptar'
      },
      {
        title: 'Error de Datos'
      }
    ).then(() => {
      router.replace('/auth/forgot-password');
    });
    return;
  }

  isLoadingResend.value = true; // Activar estado de carga para el reenvío
  code.value = ['', '', '', '', '', '']; // Limpiar los campos del código
  inputRefs.value[0]?.focus(); // Poner el foco en el primer campo

  try {
    // Llamar al servicio para reenviar el código
    await authService.forgotPassword(emailToResend); // Reusamos forgotPassword para reenviar

    // Es una buena práctica limpiar el estado del código anterior en Pinia si es posible,
    // aunque el backend generará uno nuevo.
    passwordResetStore.setVerificationCode(null);
     $modal?.showModal(
        InfoMessageModal,
        {
          message: `Se ha reenviado un nuevo código a ${emailToResend}. Revisa tu bandeja de entrada.`,
          buttonText: 'Aceptar'
        },
        {
          title: 'Código Reenviado'
        }
      );
    startTimer(); // Reiniciar el contador de tiempo
  } catch (error) {
    console.error('Error al reenviar el código:', error);
    $toast?.error('Hubo un error al reenviar el código. Por favor, inténtalo de nuevo más tarde.');
  } finally {
    isLoadingResend.value = false; // Desactivar estado de carga del reenvío
  }
};


onMounted(() => {
  // Asegurarse de que el email esté en el store al montar
  if (!passwordResetStore.email) {
    $modal?.showModal(
      InfoMessageModal,
      {
        message: 'No se encontró un correo electrónico asociado. Por favor, inicie el proceso de recuperación desde el principio.',
        buttonText: 'Aceptar'
      },
      {
        title: 'Flujo Incompleto'
      }
    ).then(() => {
      router.replace('/auth/forgot-password');
    });
  } else {
    inputRefs.value[0]?.focus();
    startTimer();
  }
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
/* Tus estilos aquí */
</style>