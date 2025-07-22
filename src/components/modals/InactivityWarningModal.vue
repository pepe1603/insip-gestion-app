<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Actividad Detectada',
  },
  message: {
    type: String,
    default: 'Parece que no has estado activo por un tiempo. ¿Deseas continuar tu sesión?',
  },
  // Funciones inyectadas por el servicio de modales
  __onConfirm: Function, // Para 'Continuar Sesión'
  __onCancel: Function,  // Para 'Cerrar Sesión'
  __onClose: Function,   // Para cierre genérico (ej. por escape, aunque lo bloquearemos si queremos)
});

const handleConfirm = () => {
  if (props.__onConfirm) {
    props.__onConfirm({ action: 'continue_session' });
  }
};

const handleCancel = () => {
  if (props.__onCancel) {
    props.__onCancel({ action: 'logout' });
  }
};
</script>

<template>
  <div class="p-6 text-center">
    <div class="text-orange-500 mb-4">
      <font-awesome-icon :icon="['fas', 'clock']" size="3x" />
    </div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ title }}</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6">{{ message }}</p>

    <div class="flex justify-center gap-4 mt-6">
      <UiButton
        variant="secondary"
        @click="handleCancel"
        class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        Cerrar Sesión
      </UiButton>
      <UiButton
        @click="handleConfirm"
        class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Continuar Sesión
      </UiButton>
    </div>
  </div>
</template>
