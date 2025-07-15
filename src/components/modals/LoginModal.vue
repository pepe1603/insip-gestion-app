<script setup>
import { ref } from 'vue';

// Recibe las funciones inyectadas por modalService para resolver la promesa
const props = defineProps({
  __onConfirm: Function, // Función para confirmar el login
  __onCancel: Function,  // Función para cancelar (cerrar)
  __onClose: Function,   // Función genérica de cierre
});

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  // Aquí iría tu lógica de autenticación real
  if (username.value === 'user' && password.value === 'pass') {
    // Si el login es exitoso, llama a __onConfirm con los datos del usuario o un token
    props.__onConfirm({ success: true, user: username.value });
  } else {
    errorMessage.value = 'Credenciales incorrectas.';
    // Podrías decidir no cerrar el modal y mostrar un mensaje de error
    // o cerrarlo como 'cancel' si hay un límite de intentos.
    // props.__onCancel({ success: false, reason: 'invalid_credentials' });
  }
};

const close = () => {
  props.__onClose(); // Usa la función de cierre inyectada
};
</script>

<template>
  <div class="p-6">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Iniciar Sesión</h3>
    <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuario</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="close"
          class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Acceder
        </button>
      </div>
    </form>
  </div>
</template>