<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled"
    :class="[baseClasses, sizeClasses, variantClasses]"
  >
    <component v-if="iconComponent" :is="iconComponent" class="inline-flex align-middle mr-2" :class="iconSizeClass" aria-hidden="true" />
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import {
  ArrowPathIcon, // Loader / Progress
  CheckCircleIcon, // Success
  ExclamationCircleIcon, // Error / Warning
  InformationCircleIcon, // Info
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/solid';
import { XCircleIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  id: String,
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary','notify', 'secondary', 'success', 'error', 'warning', 'info', 'neutral', 'loading', 'outline-primary', 'outline-secondary', 'outline-success', 'outline-error', 'outline-warning', 'outline-info'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  iconSize: {
    type: String,
    default: 'h-5 w-5',
    validator: (value) => ['h-3 w-3', 'h-4 w-4', 'h-5 w-5', 'h-6 w-6'].includes(value),
  },
});

const baseClasses = computed(() => [
  'inline-flex',
  'items-center',
  'justify-center',
  'font-semibold',
  'rounded-md',
  'cursor-pointer',
  'text-center',
  'transition-colors',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
]);

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return ['px-2', 'py-1', 'text-xs'];
    case 'large':
      return ['px-5', 'py-3', 'text-base'];
    default: // medium
      return ['px-4', 'py-2', 'text-sm'];
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return ['bg-indigo-600', 'hover:bg-indigo-700', 'focus:ring-indigo-300', 'text-white', 'dark:bg-indigo-700', 'dark:hover:bg-indigo-800', 'dark:focus:ring-indigo-900'];
    case 'secondary':
      return ['bg-gray-500', 'hover:bg-gray-600', 'focus:ring-gray-300', 'text-white', 'dark:bg-gray-600', 'dark:hover:bg-gray-700', 'dark:focus:ring-gray-800'];
    case 'success':
      return ['bg-green-500', 'hover:bg-green-600', 'focus:ring-green-300', 'text-white', 'dark:bg-green-600', 'dark:hover:bg-green-700', 'dark:focus:ring-green-800'];
    case 'error':
      return ['bg-red-500', 'hover:bg-red-600', 'focus:ring-red-300', 'text-white', 'dark:bg-red-600', 'dark:hover:bg-red-700', 'dark:focus:ring-red-800'];
    case 'warning':
      return ['bg-yellow-400', 'hover:bg-yellow-500', 'focus:ring-yellow-300', 'text-gray-900', 'dark:bg-yellow-500', 'dark:hover:bg-yellow-600', 'dark:focus:ring-yellow-400'];
    case 'info':
      return ['bg-blue-500', 'hover:bg-blue-600', 'focus:ring-blue-300', 'text-white', 'dark:bg-blue-600', 'dark:hover:bg-blue-700', 'dark:focus:ring-blue-800'];
    case 'neutral':
      return ['bg-slate-100', 'border border-slate-200', 'hover:bg-slate-400', 'focus:ring-slate-300', 'text-slate-800', 'dark:bg-slate-600', 'dark:hover:bg-slate-700', 'dark:focus:ring-slate-800'];
      case 'download':
      return ['bg-slate-100', 'border border-slate-200', 'hover:bg-slate-400', 'focus:ring-slate-300', 'text-slate-800', 'dark:bg-slate-600', 'dark:hover:bg-slate-700', 'dark:focus:ring-slate-800'];
    case 'loading':
      return ['bg-indigo-600', 'text-white', 'cursor-wait', 'dark:bg-indigo-700']; // Estilos para el estado de carga
    case 'outline-primary':
      return ['text-indigo-600', 'border', 'border-indigo-600', 'hover:bg-indigo-100', 'focus:ring-indigo-300', 'dark:text-indigo-500', 'dark:border-indigo-500', 'dark:hover:bg-indigo-900', 'dark:focus:ring-indigo-800'];
    case 'outline-secondary':
      return ['text-gray-500', 'border', 'border-gray-500', 'hover:bg-gray-100', 'focus:ring-gray-300', 'dark:text-gray-400', 'dark:border-gray-400', 'dark:hover:bg-gray-800', 'dark:focus:ring-gray-700'];
    case 'outline-success':
      return ['text-green-500', 'border', 'border-green-500', 'hover:bg-green-100', 'focus:ring-green-300', 'dark:text-green-400', 'dark:border-green-400', 'dark:hover:bg-green-800', 'dark:focus:ring-green-700'];
    case 'outline-error':
      return ['text-red-500', 'border', 'border-red-500', 'hover:bg-red-100', 'focus:ring-red-300', 'dark:text-red-400', 'dark:border-red-400', 'dark:hover:bg-red-800', 'dark:focus:ring-red-700'];
    case 'outline-warning':
      return ['text-yellow-400', 'border', 'border-yellow-400', 'hover:bg-yellow-100', 'focus:ring-yellow-300', 'dark:text-yellow-300', 'dark:border-yellow-300', 'dark:hover:bg-yellow-800', 'dark:focus:ring-yellow-700'];
    case 'outline-info':
      return ['text-blue-500', 'border', 'border-blue-500', 'hover:bg-blue-100', 'focus:ring-blue-300', 'dark:text-blue-400', 'dark:border-blue-400', 'dark:hover:bg-blue-800', 'dark:focus:ring-blue-700'];
    default:
      return [];
  }
});

const iconSizeClass = computed(() => props.iconSize);

const iconComponent = computed(() => {
  switch (props.variant) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return XCircleIcon; // Icono de error
    case 'warning':
      return ExclamationCircleIcon;
    case 'info':
      return InformationCircleIcon;
    case 'neutral':
      return ;
    case 'download':
      return ;
    case 'loading':
      return ArrowPathIcon; // Icono de carga
    default:
      return null;
  }
});
</script>