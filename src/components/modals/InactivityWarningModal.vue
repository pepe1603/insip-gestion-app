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

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import UiButton from '../ui/UiButton.vue';

export default {
  name: 'InactivityWarningModal',
  props: {
    title: { type: String, default: 'Actividad Detectada' },
    message: { type: String, default: 'Parece que no has estado activo por un tiempo. ¿Deseas continuar tu sesión?' },
    __onConfirm: Function,
    __onCancel: Function,
    __onClose: Function,
  },
  components: {
    FontAwesomeIcon,
    UiButton,
  },
  methods: {
    handleConfirm() {
      if (this.__onConfirm) {
        // Envía el objeto con la propiedad 'payload'
        this.__onConfirm({ action: 'confirm', payload: { action: 'continue_session' } });
      }
    },
    handleCancel() {
      if (this.__onCancel) {
        // Envía el objeto con la propiedad 'payload'
        this.__onCancel({ action: 'cancel', payload: { action: 'logout' } });
      }
    },
  },
};
</script>

<style scoped>
/* No se necesitan estilos específicos de componente aquí si usas Tailwind */
</style>