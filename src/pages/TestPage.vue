<script setup>
// *** CAMBIOS AQUÍ ***
// Ya NO necesitas `import { inject } from 'vue';`
// En su lugar, importas tu composable `useGlobalModal`.
import { useGlobalModal } from '../composables/useGlobalModal';
import { useGlobalToast } from '../composables/useGlobalToast'; // Si también usas el toast aquí

import ConfirmActionModal from '../components/modals/ConfirmActionModal.vue'; // Importa el componente de tu modal de ejemplo
import InfoMessageModal from '../components/modals/InfoMessageModal.vue';
import FirstModal from '../components/modals/FirstModal.vue';

// Accedemos a los servicios a través de nuestros composables
const $modal = useGlobalModal(); // ¡Usas tu composable aquí!
const $toast = useGlobalToast(); // Si lo usas, también lo obtienes de tu composable

// --- Funciones para abrir modales ---

const showWelcomeMessage = () => {
  // Asegúrate de usar el operador de encadenamiento opcional `?.`
  // por si el composable devuelve `undefined` en un entorno de prueba o SSR sin plugin
  $modal?.showModal(
    InfoMessageModal, // El componente a renderizar dentro del modal
    {
      // Props para ConfirmActionModal
      message: '¡Bienvenido a nuestra aplicación! Estamos encantados de tenerte aquí.',
      buttonText: '¡Empezar!',
    },
    {
      // Opciones para el UiModal base (el contenedor)
      title: 'Menssage dde Bienvenida',
    }
  ).then(modalId => {
    console.log('Modal de confirmación simple abierto con ID:', modalId);
  });
};

const deleteItem = async (itemId) => {
  try {
    const result = await $modal?.showModal(
      ConfirmActionModal,
      {
        message: `¿Estás seguro de que quieres eliminar el elemento #${itemId}? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
      },
      {
        title: 'Confirmar Eliminación',
      }
    );

    if (result?.action === 'confirm') {
      // Aquí iría tu lógica real para eliminar el elemento
      console.log(`Elemento ${itemId} confirmado para eliminación.`);
      $toast?.success(`¡Elemento ${itemId} eliminado con éxito!`);
    } else {
      console.log(`Eliminación del elemento ${itemId} cancelada.`);
      $toast?.info('Eliminación cancelada.');
    }
  } catch (error) {
    $toast?.error('Error al procesar la confirmación.');
    console.error('Error al confirmar eliminación:', error);
  }
};

const showChainModal = () => {
  $modal?.showModal(
    FirstModal, // Imagina que aquí iría un componente como 'UserFormModal.vue'
    {
      
    },
    {
      title: 'Modales encadenados',
    }
  );
};

// ... (El resto de tus funciones y comentarios permanecen igual) ...

</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">
      Página de Prueba de Modales
    </h1>

    <div class="space-y-4 ">
      <button
        @click="showWelcomeMessage"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors transform hover:scale-105"
      >
        Abrir Modal Simple
      </button>

      <button
        @click="deleteItem(123)"
        class="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors transform hover:scale-105"
      >
        eliminar Elemento 123
      </button>

      <button
        @click="showChainModal"
        class="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-colors transform hover:scale-105"
      >
        Abrir Otro Tipo de Modal
      </button>
    </div>

    <p class="mt-8 text-gray-600 dark:text-gray-400">
      Haz clic en los botones para probar los modales.
    </p>
  </div>
</template>

<style scoped>
/* Estilos específicos para esta página si los necesitas */
</style>