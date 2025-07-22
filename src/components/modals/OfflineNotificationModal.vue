<script>
import { defineComponent, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'OfflineNotificationModal', // Aquí definimos el nombre del componente
  components: {
    FontAwesomeIcon,
  },
  props: {
    // Inyectado por el servicio de modales para resolver la promesa
    __onConfirm: Function,
    __onClose: Function, // También para un cierre genérico
  },
  setup(props) {
    const hasAgreedToOffline = ref(false); // Estado para la casilla de confirmación

    // Se llamará cuando el usuario haga clic en "Continuar sin conexión"
    const handleContinueOffline = () => {
      if (props.__onConfirm) {
        // Resolvemos la promesa en App.vue con una acción específica
        props.__onConfirm({ action: 'continue_offline' });
      }
    };

    return {
      hasAgreedToOffline,
      handleContinueOffline,
    };
  },
});
</script>

<template>
  <div class="p-6 text-center">
    <div class="text-red-500 mb-4">
      <font-awesome-icon :icon="['fas', 'exclamation-triangle']" size="3x" />
    </div>
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">¡Sin Conexión!</h3>
    <p class="text-gray-700 dark:text-gray-300 mb-6">
      Parece que has perdido tu conexión a internet. Algunas funciones podrían no estar disponibles.
    </p>

    <div class="mb-6 flex items-center justify-center">
      <input 
        type="checkbox" 
        id="confirmOffline" 
        v-model="hasAgreedToOffline" 
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
      />
      <label for="confirmOffline" class="text-sm text-gray-700 dark:text-gray-300 select-none">
        Entiendo que puedo continuar sin conexión, pero algunas funciones no estarán disponibles.
      </label>
    </div>

    <button
      @click="handleContinueOffline"
      :disabled="!hasAgreedToOffline"
      class="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continuar sin conexión
    </button>
  </div>
</template>

<style scoped>
/* No se necesitan estilos aquí, Tailwind y UiModal manejan la mayoría */
</style>