<script>
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'OnlineReconnectedModal', // Aquí definimos el nombre del componente
  components: {
    FontAwesomeIcon,
  },
  props: {
    // Función para confirmar que el usuario ha 'entendido'
    __onConfirm: Function,
    __onClose: Function, // También para un cierre genérico
  },
  setup(props) {
    // Cuando el usuario hace clic en "Entendido"
    const handleUnderstood = () => {
      if (props.__onConfirm) {
        // Resolvemos la promesa que espera el 'App.vue' con una acción específica
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
      <font-awesome-icon :icon="['fas', 'wifi']" size="3x" /> 
    </div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">¡Conexión Restablecida!</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6">
      Has vuelto a tener conexión a Internet. ¡Todo está funcionando con normalidad de nuevo!
    </p>
    <button
      @click="handleUnderstood"
      class="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      Entendido
    </button>
  </div>
</template>

<style scoped>
/* No se necesitan estilos específicos aquí; Tailwind CSS y UiModal manejan el diseño. */
</style>