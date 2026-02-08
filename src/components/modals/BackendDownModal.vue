<script>
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'BackendDownModal',
  components: {
    FontAwesomeIcon,
  },
  props: {
    __onConfirm: Function,
    __onClose: Function,
    // Puedes añadir props para personalizar el título y mensaje si quieres
    // title: { type: String, default: 'Servicio Temporalmente No Disponible' },
    // message: { type: String, default: 'No podemos conectar con nuestros servidores. Algunas funciones pueden no estar disponibles.' },
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
    <div class="text-red-500 mb-4">
      <font-awesome-icon :icon="['fas', 'server']" size="3x" /> 
      <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" class="relative -top-3 -left-2 text-red-600" />
    </div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Servicio Temporalmente No Disponible</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6">
      No podemos conectar con nuestros servidores en este momento. Algunas funciones de la aplicación pueden no estar disponibles. Por favor, inténtalo de nuevo más tarde.
    </p>
    <button
      @click="handleUnderstood"
      class="px-6 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
    >
      Entendido
    </button>
  </div>
</template>

<style scoped>
/* No se necesitan estilos específicos aquí; Tailwind CSS y UiModal manejan el diseño. */
</style>