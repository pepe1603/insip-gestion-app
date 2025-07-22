<!-- src/components/modals/AuthRequiredModal.vue -->
<script setup>
import { LockClosedIcon } from '@heroicons/vue/24/outline'; // Icono de candado para acceso restringido
import { useRouter } from 'vue-router'; // Para la navegación programática
import UiButton from '../ui/UiButton.vue';

// Props inyectadas por el modalService para gestionar el cierre y resultados
const props = defineProps({
  message: {
    type: String,
    default: 'Necesitas iniciar sesión para acceder a esta sección.',
  },
  buttonText: {
    type: String,
    default: 'Ir a Iniciar Sesión',
  },
  // __onClose es la función que el modalService inyecta para que este modal
  // pueda indicar que ha terminado su interacción y debe ser cerrado.
  __onClose: Function, 
});

const router = useRouter();

// Manejador del clic en el botón de acción
const handleAction = () => {
  // Cuando el usuario hace clic en el botón, cerramos el modal.
  // La promesa en el router.beforeEach se resolverá, y entonces el guardiá
  // podrá redirigir al usuario a la página de login.
  if (props.__onClose) {
    props.__onClose({ action: 'go_to_login' }); // Puedes pasar un payload si necesitas saber qué botón se presionó
  }
  // No redirigimos directamente aquí, ya que el router guard lo hará después de que el modal se cierre.
};
</script>

<template>
  <div class="text-center p-6">
    <div class="mb-6 flex justify-center">
      <LockClosedIcon class="h-16 w-16 text-blue-500 dark:text-blue-400" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Acceso Restringido</h2>
    <p class="text-gray-700 dark:text-gray-300 text-base mb-6">
      {{ message }}
    </p>

    <UiButton
      @click="handleAction"
      class="w-full px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
    >
      {{ buttonText }}
    </UiButton>
  </div>
</template>

<style scoped>
/* No se necesitan estilos con scope, Tailwind CSS lo maneja */
</style>