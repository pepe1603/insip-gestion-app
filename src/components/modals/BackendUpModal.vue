<script>
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'BackendUpModal',
  components: {
    FontAwesomeIcon,
  },
  props: {
    __onConfirm: Function,
    __onClose: Function,
    // Puedes añadir props para personalizar el título y mensaje si quieres
    // title: { type: String, default: '¡Servicio Restablecido!' },
    // message: { type: String, default: 'La conexión con el servidor ha sido recuperada. Todo debería funcionar con normalidad.' },
  },
  setup(props) {
    const handleUnderstood = () => {
      if (props.__onConfirm) {
        props.__onConfirm({ action: 'understood' });
      }
    };

    return {
      handleUnderstood,
    };
  },
});
</script>

<template>
  <div class="p-6 text-center">
    <div class="text-green-500 mb-4">
      <font-awesome-icon :icon="['fas', 'server']" size="3x" /> 
      <font-awesome-icon :icon="['fas', 'check-circle']" size="lg" class="relative -top-3 -left-2 text-green-600" />
    </div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">¡Servicio Restablecido!</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6">
      La conexión con el servidor ha sido recuperada. ¡Todo debería funcionar con normalidad de nuevo!
    </p>
    <button
      @click="handleUnderstood"
      class="px-6 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
    >
      Entendido
    </button>
  </div>
</template>

<style scoped>
/* No se necesitan estilos específicos aquí; Tailwind CSS y UiModal manejan el diseño. */
</style>