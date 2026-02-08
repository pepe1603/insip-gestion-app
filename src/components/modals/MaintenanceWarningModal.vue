<template>
  <div class="p-6 text-center">
    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800/20">
      <WrenchScrewdriverIcon class="h-8 w-8 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
    </div>

    <h3 class="mt-5 text-lg font-bold leading-6 text-gray-900 dark:text-white" id="modal-title">
      Mantenimiento en Curso
    </h3>

    <div class="mt-2">
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Nuestro sistema se encuentra en mantenimiento programado.Estaremos de vuelta en unos minutos.
  Gracias por tu paciencia. 
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
        Algunas funciones pueden no estar disponibles.
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Puedes acceder a la página de mantenimiento para más detalles.
      </p>
    </div>

    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-yellow-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm transition-colors duration-200"
        @click="handleConfirm"
      >
        Ir a Mantenimiento
      </button>

      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm transition-colors duration-200"
        @click="handleCancel"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script>
import { WrenchScrewdriverIcon } from '@heroicons/vue/24/outline';
import { ref, computed } from 'vue';

export default {
  name: 'MaintenanceWarningModal',
  components: {
    WrenchScrewdriverIcon
  },
  props: {
    modalId: {
      type: [String, Number],
      default: null
    },
    __onConfirm: Function,
    __onCancel: Function,
    __onClose: Function,
  },
  methods: {
    handleConfirm() {
      if (this.__onConfirm) {
        this.__onConfirm({ id: this.modalId, action: 'confirm', payload: { go_to_maintenance: true } });
      }
    },
    handleCancel() {
      if (this.__onCancel) {
        this.__onCancel({ id: this.modalId, action: 'cancel', payload: { go_to_maintenance: false } });
      }
    },
  },
};
</script>
