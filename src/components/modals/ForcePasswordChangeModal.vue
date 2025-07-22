<script setup>
import { KeyIcon } from '@heroicons/vue/24/outline'; // Icono de llave para cambio de contraseña
import UiButton from '../ui/UiButton.vue';

// Props inyectadas por el modalService para gestionar el cierre y resultados
const props = defineProps({
  message: {
    type: String,
    default: 'Por motivos de seguridad, debe cambiar su contraseña para continuar.',
  },
  buttonText: {
    type: String,
    default: 'Ir a Cambiar Contraseña',
  },
  // __onClose es la función que el modalService inyecta para cerrar el modal
  __onClose: Function, 
});

// Manejador del clic en el botón de acción
const handleAction = () => {
  // Al hacer clic, cerramos el modal. El guardián de ruta se encargará de la redirección.
  if (props.__onClose) {
    props.__onClose({ action: 'go_to_change_password' });
  }
};
</script>

<template>
  <div class="text-center p-6">
    <div class="mb-6 flex justify-center">
      <KeyIcon class="h-16 w-16 text-yellow-500 dark:text-yellow-400" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Cambio de Contraseña Requerido</h2>
    <p class="text-gray-700 dark:text-gray-300 text-base mb-6">
      {{ message }}
    </p>

    <UiButton
      variant="warning"
      @click="handleAction"
    >
      {{ buttonText }}
    </UiButton>
  </div>
</template>

<style scoped>
/* No se necesitan estilos con scope, Tailwind CSS lo maneja */
</style>