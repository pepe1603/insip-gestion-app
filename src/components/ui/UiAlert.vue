<template>
  <div :class="[baseClasses, typeClasses, extraClasses]" role="alert">
    <div v-if="showIcon" :class="['flex-shrink-0', iconColorClass]">
      <component :is="iconComponent" class="h-5 w-5" aria-hidden="true" />
    </div>
    <div class="ml-3 text-sm font-medium flex-grow">
      <slot></slot>
    </div>
    <div v-if="dismissible" class="ml-auto pl-3">
      <div class="mx-auto">
        <button
          type="button"
          :class="['inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2', dismissButtonClasses]"
          @click="dismissAlert"
        >
          <span class="sr-only">Dismiss</span>
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  SparklesIcon,
  ShieldExclamationIcon,
  StarIcon,
  XMarkIcon // Para el botón de cerrar
} from '@heroicons/vue/20/solid';

const props = defineProps({
  /**
   * Tipo de alerta (info, success, warning, error).
   */
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error', 'danger', 'ghost', 'purple-power'].includes(value),
  },
  /**
   * Clases CSS adicionales para personalizar el estilo.
   */
  extraClasses: {
    type: String,
    default: '',
  },
  /**
   * Si se debe mostrar un ícono.
   */
  showIcon: {
    type: Boolean,
    default: true,
  },
  /**
   * Si la alerta puede ser cerrada por el usuario.
   */
  dismissible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['dismiss']);

const baseClasses = 'p-4 rounded-md flex items-start';

const typeClasses = computed(() => {
  switch (props.type) {
    case 'info':
      return 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ring-blue-600/20';
    case 'success':
      return 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200 ring-green-600/20';
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 ring-yellow-600/20';
    case 'error':
      return 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200 ring-red-600/20';
    case 'danger':
      return 'bg-orange-50 text-orange-800 dark:bg-orange-900 dark:text-orange-200 ring-orange-600/20';
    case 'ghost':
      return 'bg-transparent border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300 shadow-sm';
    case 'purple-power':
      // Un estilo más impactante con colores morados.
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 ring-purple-600/20 border border-purple-300';
    
    default:
      return '';
  }
});

const iconComponent = computed(() => {
  switch (props.type) {
    case 'info':
      return InformationCircleIcon;
    case 'success':
      return CheckCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'error':
      return XCircleIcon;
    case 'danger':
      return ShieldExclamationIcon;
    case 'ghost':
      return StarIcon; // O un icono más sutil como 'LinkIcon', 'MinusIcon'
    case 'purple-power':
      return SparklesIcon; // Un icono llamativo para "purple-power"
    default:
      return null;
  }
});

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'info':
      return 'text-blue-400';
    case 'success':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    case 'error':
      return 'text-red-400';
    case 'danger':
      return 'text-orange-400';
    case 'ghost':
      return 'text-gray-400'; // Color sutil para el icono ghost
    case 'purple-power':
      return 'text-purple-600'; // Color del icono para purple-power
    default:
      return '';
  }
});

const dismissButtonClasses = computed(() => {
  switch (props.type) {
    case 'info':
      return 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50';
    case 'success':
      return 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50';
    case 'warning':
      return 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50';
    case 'error':
      return 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50';
    case 'danger':
      return 'text-orange-500 hover:bg-orange-100 focus:ring-orange-600 focus:ring-offset-orange-50';
    case 'ghost':
      // Botón de cerrar para el modo ghost, sutil pero visible al hover
      return 'text-gray-500 hover:bg-gray-100 focus:ring-gray-600 focus:ring-offset-gray-50 dark:hover:bg-gray-700 dark:text-gray-400 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-800';
    case 'purple-power':
      // Botón de cerrar para el modo purple
      return 'text-purple-500 hover:bg-purple-200 focus:ring-purple-600 focus:ring-offset-purple-50 dark:hover:bg-purple-800 dark:text-purple-300 dark:focus:ring-purple-500 dark:focus:ring-offset-purple-900';
    default:
      return '';
  }
});

const dismissAlert = () => {
  emit('dismiss');
};
</script>

<style scoped>
/* No se requiere CSS adicional si Tailwind CSS está configurado */
</style>