<script setup>
import { defineProps } from 'vue';
import { useGlobalModal } from '../../composables/useGlobalModal'; // O inject('$modal')
import SecondModal from './SecondModal.vue'; // El modal que abrirá

const props = defineProps({
  __onClose: Function,
});

const $modal = useGlobalModal();

const openSecondModal = () => {
  $modal?.showModal(
    SecondModal,
    { message: '¡Soy el segundo modal! Me abriste desde el primero.' },
    { title: 'Segundo Modal' }
  );
};

const closeFirstModal = () => {
  props.__onClose();
};
</script>

<template>
  <div class="p-6 text-center">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Primer Modal</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6">Este modal puede abrir otro.</p>
    <div class="flex justify-center space-x-3">
      <button
        @click="openSecondModal"
        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Abrir Segundo Modal
      </button>
      <button
        @click="closeFirstModal"
        class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        Cerrar Primero
      </button>
    </div>
  </div>
</template>