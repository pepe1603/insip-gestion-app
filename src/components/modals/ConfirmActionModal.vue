<script setup>

const props = defineProps({
  message: {
    type: String,
    default: '¿Estás seguro de que quieres realizar esta acción?',
  },
  confirmText: {
    type: String,
    default: 'Confirmar',
  },
  cancelText: {
    type: String,
    default: 'Cancelar',
  },
  // INYECTADO POR EL SERVICIO DE MODALES
  __onConfirm: Function,
  __onCancel: Function,
  __onClose: Function, // También para cerrar de forma genérica
});

// Ahora, tus manejadores llamarán a las funciones inyectadas
const handleConfirm = () => {
  if (props.__onConfirm) {
    props.__onConfirm(); // Llama a la función inyectada para resolver la promesa
  }
  // No necesitas emitir 'close' aquí, ya que la función __onConfirm/__onCancel del servicio
  // se encargará de llamar a hideModal.
};

const handleCancel = () => {
  if (props.__onCancel) {
    props.__onCancel(); // Llama a la función inyectada para resolver la promesa
  }
  // No necesitas emitir 'close' aquí.
};
</script>

<template>
  <div class="text-center p-4">
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">{{ message }}</p>
    <div class="flex justify-center gap-4 mt-6">
      <button
        @click="handleCancel"
        class="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        {{ cancelText }}
      </button>
      <button
        @click="handleConfirm"
        class="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {{ confirmText }}
      </button>
    </div>
  </div>
</template>