<script setup>

const props = defineProps({
  message: String,
  __onClose: Function,
});

const closeSecondModal = () => {
  props.__onClose();
};
</script>

<template>
  <div class="p-6 text-center">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Segundo Modal</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6">{{ message }}</p>
    <button
      @click="closeSecondModal"
      class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      Cerrar Segundo
    </button>
  </div>
</template>