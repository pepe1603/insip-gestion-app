<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalModal } from '@/composables/useGlobalModal';
import { useGlobalToast } from '@/composables/useGlobalToast';
import { authService } from '@/services/AuthService'; // Auth Store

import ConfirmActionModal from '@/components/modals/ConfirmActionModal.vue';

// UI components
import UiInputEmail from '@/components/ui/UiInputEmail.vue';
import UiInputPassword from '@/components/ui/UiInputPassword.vue';
import UiDivider from '@/components/ui/UiDivider.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiInputText from '@/components/ui/UiInputText.vue';

const router = useRouter();
const $modal = useGlobalModal();
const $toast = useGlobalToast();

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const validatePassword = (pwd) => {
  const minLength = pwd.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);

  return minLength && hasLetter && hasNumber;
};

// **INICIO DEL CÓDIGO CORREGIDO PARA handleRegister**
// Ahora, handleRegister acepta un argumento explícito para `confirmed`
// El `event` del formulario no se usa directamente aquí si se invoca con `submit.prevent`
const handleRegister = async (confirmed = false) => { // <-- CAMBIO CLAVE AQUÍ: `confirmed` es false por defecto
  // Validaciones frontend
  if (password.value !== passwordConfirmation.value) {
    return $toast?.error('Las contraseñas no coinciden.');
  }

  if (!validatePassword(password.value)) {
    return $toast?.error('La contraseña debe tener al menos 8 caracteres, incluir letras y números.');
  }

  // console.log para depuración: Ver el valor de `confirmed`
  console.log('parametro (confirmed) en el método handleRegister:', confirmed); // <-- Ahora verás 'false' o 'true'

  try {
    const payload = {
      name: username.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      // Solo añade confirmed_as_user si confirmed es true
      ...(confirmed ? { confirmed_as_user: true } : {}), // <-- Usa `confirmed` aquí
    };

    console.log('Payload enviado al servicio de registro:', payload);

    const response = await authService.register(payload);

    if (response?.action_required) {
      // Mostrar modal si requiere confirmación
      const result = await $modal?.showModal(
        ConfirmActionModal,
        {
          message: response.message || '¿Deseas continuar con el registro como usuario no empleado?',
          confirmText: 'Sí, continuar',
          cancelText: 'Cancelar',
        },
        {
          title: 'Confirmación requerida',
        }
      );

      if (result?.action === 'confirm') {
        // Llama a handleRegister de nuevo, esta vez pasando `true` explícitamente
        await handleRegister(true); // <-- Pasa `true` explícitamente para la segunda llamada
      } else {
        $toast?.info('Registro cancelado.');
      }

      return; // Importante: salir de la función después de manejar la acción requerida
    }

    // Registro exitoso (esto se ejecuta si no hubo `action_required` o después de la segunda confirmación)
    $toast?.success(response.message || 'Usuario registrado con éxito. Ahora puedes iniciar sesión.');
    router.push({ name: 'login' }); // Redirigir al login
  } catch (error) {
    const res = error.response;

    if (res?.status === 400 || res?.status === 422) {
      // Extrae el primer error de validación o el mensaje general del backend
      const firstError = Object.values(res.data.errors || {})?.[0]?.[0] || res.data.message;
      $toast?.error(firstError);
    } else {
      console.error('Ocurrió un error inesperado al registrar:', error);
      $toast?.error('Ocurrió un error inesperado al registrar.');
    }
  }
};
// **FIN DEL CÓDIGO CORREGIDO PARA handleRegister**
</script>

<template>
  <div class="w-full p-4 sm:max-w-md md:max-w-xl lg:max-w-3xl sm:px-8">
    <div class="space-x-4 mb-4 sm:mb-8">
      <h1 class="text-2xl sm:text-4xl font-bold">Crear una Cuenta Gratis</h1>
      <p class="text-gray-600 text-sm sm:text-base">your register with your dates to be part of teams</p>
    </div>

    <div class="flex flex-col-reverse">
      <form @submit.prevent="handleRegister()" class="mt-3 flex flex-col items-center text-sm sm:text-base"> 
        <UiInputText label="Username" class="mb-4" v-model="username" required placeholder="Tu nombre completo" />
        <UiInputEmail label="Correo electrónico" class="mb-4" v-model="email" required placeholder="example@example.com" />

        <div class="w-full flex flex-1 gap-2 sm:gap-4">
          <UiInputPassword label="Contraseña" class="mb-4" v-model="password" placeholder="Mínimo 8 caracteres" />
          <UiInputPassword label="Confirmar Contraseña" class="mb-4" v-model="passwordConfirmation" placeholder="Repite tu contraseña" />
        </div>

        <div class="w-full px-4 text-sm text-right mb-6">
          <p class="font-semibold">Ya tengo una cuenta, <router-link to="/auth/login" class="text-indigo-600 font-normal hover:text-indigo-700 hover:underline">Login</router-link></p>
        </div>

        <UiButton type="submit" class="mt-4" variant="primary">Registrar</UiButton>
      </form>

      <div class="bg-blue-50 dark:bg-blue-700 rounded-lg shadow-xs p-2.5 container">
        <p class="text-current font-semibold">Crea tu cuenta con tus propios datos</p>
        <p class="text-gray-600 dark:text-gray-400 text-sm">ingresa tu correo electronico de empleado para poder registrarte correctmante</p>
      </div>

      <UiDivider label="Or" class="my-6" />

      <div class="w-full self-center flex flex-col items-center gap-2 mb-3">
        <div class="text-xs sm:text-sm border border-gray-300 rounded-md px-4 py-2 5 text-gray-600 hover:bg-gray-600 hover:text-white text-center w-2/3">
          <font-awesome-icon :icon="['fab', 'google']" class="text-current text-lg" />
          use Google Account
        </div>
        <div class="text-xs sm:text-sm border border-gray-300 rounded-md px-4 py-2 5 text-gray-600 hover:bg-gray-600 hover:text-white text-center w-2/3">
          <font-awesome-icon :icon="['fab', 'facebook-square']" class="text-current text-lg" />
          use Facebook Account
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>