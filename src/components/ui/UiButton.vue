<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled"
    :class="[baseClasses, sizeClasses, variantClasses, buttonFlexDirectionClass]"
  >
    <component
      v-if="hasIcon"
      :is="resolvedIconComponent"
      :class="[iconSizeClass, iconMarginClass]"
      aria-hidden="true"
    />
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
    validator: (value) => ['primary', 'notify', 'secondary', 'success', 'error', 'warning', 'info', 'neutral', 'loading', 'outline-primary', 'outline-secondary', 'outline-success', 'outline-error', 'outline-warning', 'outline-info', 'download'].includes(value), // Agregué 'download' aquí
  },
  size: {
    type: String,
    default: 'sm', // Valor por defecto a 'sm'
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: [String, Function, Object],
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'right', // Por defecto, el ícono estará a la derecha del texto
    validator: (value) => ['left', 'right'].includes(value),
  },
  // 🚀 NUEVA PROP: Controla la visibilidad del icono 🚀
  showIcon: {
    type: Boolean,
    default: false, // Por defecto, el icono no se mostrará a menos que se especifique true
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
    case 'xs':
      return ['px-2', 'py-1', 'text-xs'];
    case 'sm':
      return ['px-3', 'py-1.5', 'text-sm'];
    case 'lg':
      return ['px-5', 'py-3', 'text-lg'];
    case 'xl':
      return ['px-6', 'py-3.5', 'text-xl'];
    default: // md
      return ['px-4', 'py-2', 'text-base'];
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return ['bg-indigo-600', 'hover:bg-indigo-700', 'focus:ring-indigo-300', 'text-white', 'dark:bg-indigo-700', 'dark:hover:bg-indigo-800', 'dark:focus:ring-indigo-900'];
    case 'secondary':
      return ['bg-gray-200', 'hover:bg-gray-400', 'focus:ring-gray-300', 'text-gray-700', 'dark:bg-gray-400', 'dark:hover:bg-gray-500', 'dark:text-gray-200', 'dark:focus:ring-gray-800'];
    case 'success':
      return ['bg-green-500', 'hover:bg-green-600', 'focus:ring-green-300', 'text-white', 'dark:bg-green-600', 'dark:hover:bg-green-700', 'dark:focus:ring-green-800'];
    case 'error':
      return ['bg-red-500', 'hover:bg-red-600', 'focus:ring-red-300', 'text-white', 'dark:bg-red-600', 'dark:hover:bg-red-700', 'dark:focus:ring-red-800'];
    case 'warning':
      return ['bg-yellow-600', 'hover:bg-yellow-700', 'focus:ring-yellow-500', 'text-white', 'dark:bg-yellow-500', 'dark:hover:bg-yellow-600', 'dark:focus:ring-yellow-400'];
    case 'info':
      return ['bg-blue-500', 'hover:bg-blue-600', 'focus:ring-blue-300', 'text-white', 'dark:bg-blue-600', 'dark:hover:bg-blue-700', 'dark:focus:ring-blue-800'];
    case 'neutral':
      return ['bg-slate-100', 'border', 'border-slate-200', 'hover:bg-slate-400', 'focus:ring-slate-300', 'text-slate-800', 'dark:bg-slate-600', 'dark:hover:bg-slate-700', 'dark:focus:ring-slate-800'];
    case 'download': // ¡Asegúrate de que este caso tenga estilos si es diferente a 'neutral'!
      return ['bg-slate-100', 'border', 'border-slate-200', 'hover:bg-slate-400', 'focus:ring-slate-300', 'text-slate-800', 'dark:bg-slate-600', 'dark:hover:bg-slate-700', 'dark:focus:ring-slate-800'];
    case 'loading':
      return ['bg-indigo-600', 'text-white', 'cursor-wait', 'dark:bg-indigo-700'];
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

const defaultIconComponent = computed(() => {
  switch (props.variant) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return XCircleIcon;
    case 'warning':
      return ExclamationCircleIcon;
    case 'info':
      return InformationCircleIcon;
    case 'loading':
      return ArrowPathIcon;
    case 'download':
      return ArrowDownTrayIcon;
    default:
      return null;
  }
});

// 🚀 Lógica de hasIcon ajustada para incluir showIcon 🚀
const hasIcon = computed(() => {
  // Solo muestra el icono si showIcon es true Y hay un icono (ya sea pasado por prop o por defecto de variante)
  return props.showIcon && (props.icon !== null || defaultIconComponent.value !== null);
});

const resolvedIconComponent = computed(() => {
  if (props.icon) {
    if (typeof props.icon === 'function') {
      return props.icon();
    } else if (typeof props.icon === 'object' && props.icon.__file) {
      return props.icon;
    }
  }
  return defaultIconComponent.value;
});

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-3 w-3';
    case 'sm':
      return 'h-4 w-4';
    case 'md':
      return 'h-5 w-5';
    case 'lg':
      return 'h-6 w-6';
    case 'xl':
      return 'h-7 w-7';
    default:
      return 'h-5 w-5'; // Default para 'md'
  }
});

const buttonFlexDirectionClass = computed(() => {
  // Aplicamos flex-row-reverse solo si el ícono está a la derecha Y hay un ícono para mostrar.
  return props.iconPosition === 'right' && hasIcon.value ? 'flex-row-reverse' : '';
});

const iconMarginClass = computed(() => {
  if (!hasIcon.value) return ''; // Si no hay ícono, no hay margen

  if (props.iconPosition === 'left') {
    return 'mr-2';
  } else if (props.iconPosition === 'right') {
    return 'ml-2';
  }
  return '';
});
</script>