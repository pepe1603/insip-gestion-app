<template>
  <div class="p-6 text-center">
    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/20">
      <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
    </div>
    <h3 class="mt-5 text-lg font-bold leading-6 text-gray-900 dark:text-white" id="modal-title">
      {{ $t('logoutModal.title') }}
    </h3>
    <div class="mt-2">
      <p class="text-sm text-gray-500 dark:text-gray-300">
        {{ $t('logoutModal.description') }}
      </p>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {{ $t('logoutModal.warning') }}
      </p>
    </div>

    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm transition-colors duration-200"
        @click="handleConfirm"
      >
        {{ $t('logoutModal.confirmButton') }}
      </button>
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm transition-colors duration-200"
        @click="handleCancel"
      >
        {{ $t('logoutModal.cancelButton') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
// No necesitas `useI18n` directamente en Options API si ya tienes `$t` disponible globalmente
// o si lo inyectas de otra forma. Asumo que `$t` funciona globalmente o a través de `this`.

export default {
  // *** DEFINICIÓN DE NOMBRE EXPLÍCITA PARA OPTIONS API ***
  name: 'LogoutConfirmModal',
  components: {
    ExclamationTriangleIcon, // Importa el icono aquí
  },
  // *** DEFINICIÓN DE PROPS PARA OPTIONS API ***
  props: {
  modalId: { 
      type: [String, Number], // Puede ser string o number si el ID es numérico
      default: null // Opcional: un valor por defecto
    },
    __onConfirm: Function, // Función para confirmar y resolver la promesa del modal
    __onCancel: Function,  // Función para cancelar y resolver la promesa del modal
    __onClose: Function,   // Función genérica para cerrar el modal
  },
  methods: {
    handleConfirm() {
      if (this.__onConfirm) {
        // Llama a la función inyectada y pasa el resultado, incluyendo el modalId
        this.__onConfirm({ id: this.modalId, action: 'confirm', payload: { logout: true } });
      }
    },
    handleCancel() {
      if (this.__onCancel) {
        // Llama a la función inyectada y pasa el resultado, incluyendo el modalId
        this.__onCancel({ id: this.modalId, action: 'cancel', payload: { logout: false } });
      }
    },
  },
  // Si necesitas acceder a `$t` y no está disponible globalmente, puedes usar `inject`
  // o configurar `vue-i18n` para que lo sea. Si ya funciona, no necesitas cambios aquí.
  // mounted() {
  //   console.log('LogoutConfirmModal mounted', this.modalId);
  // }
};
</script>