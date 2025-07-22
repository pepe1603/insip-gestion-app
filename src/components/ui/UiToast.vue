<template>
  <transition
    name="toast-fade"
    @before-leave="beforeLeave"
    @leave="onLeave"
  >
    <div
      v-if="visible"
      class="relative z-50 flex items-center gap-2 mb-4 rounded-md px-3 py-4 transition duration-200 ease-in-out transform hover:scale-105 pointer-events-auto min-w-[280px] max-w-md"
      :class="[typeClasses, { 'border-l-4': showLeftBorder }]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <component :is="icon" :class="title ? 'w-7' : 'w-7'" v-if="icon && props.type !== 'notify'" />

      <div class="flex-1 flex flex-col">
        <p v-if="title" class="font-semibold text-base">{{ title }}</p>
        <p class="font-normal font-sans text-sm">{{ message }}</p>
      </div>

      <button
        type="button"
        class="flex-col items-center justify-center transition-300 transform hover:scale-110"
        @click="closeToast"
        v-if="dismissible" 
      >
        <span class="sr-only">Cerrar</span>
        <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  StarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from '@heroicons/vue/20/solid';

const props = defineProps({
  id: Number,
  message: String,
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info', 'notify', 'ghost', 'purple-power', 'highlight'].includes(value),
  },
  position: {
    type: String,
    default: 'top-right',
  },
  duration: {
    type: Number,
    default: 7000,
  },
  dismissible: { 
    type: Boolean,
    default: true,
  },
  showLeftBorder: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close']);
const visible = ref(true);
const timeoutId = ref(null);

const beforeLeave = () => {
  // Puedes añadir lógica antes de que la transición de salida comience
};

const onLeave = () => {
  // Esta función se ejecuta cuando la transición de salida termina
};

const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300';
    case 'error':
      return 'border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300';
    case 'warning':
      return 'border-yellow-500 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
    case 'notify': // Modificado para el tipo 'notify'
      return 'border-sky-500 dark:border-sky-700 bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-300 outline outline-1 outline-sky-500 dark:outline-sky-700'; // Añadido outline
    case 'ghost':
      return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    case 'purple-power':
      return 'border-purple-500 dark:border-purple-700 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
    case 'highlight':
      return 'border-indigo-500 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300';
    case 'info':
    default:
      return 'border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
  }
});

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return XCircleIcon;
    case 'warning':
      return ExclamationCircleIcon;
    case 'notify': // Ahora 'notify' no tiene icono en el template, pero mantenemos BellAlertIcon como su valor si se accediera directamente.
      return null; // Retorna null para que el v-if del template no lo renderice.
    case 'ghost':
      return LightBulbIcon;
    case 'purple-power':
      return RocketLaunchIcon;
    case 'highlight':
      return StarIcon;
    case 'info':
    default:
      return InformationCircleIcon;
  }
});

onMounted(() => {
  let audio;
  switch (props.type) {
    case 'success':
      audio = new Audio('/audios/tada.wav');
      break;
    case 'error':
      audio = new Audio('/audios/error.wav');
      break;
    case 'warning':
      audio = new Audio('/audios/exclamation.wav');
      break;
    case 'notify':
    case 'info':
    case 'ghost':
    case 'purple-power':
    case 'highlight':
    default:
      audio = new Audio('/audios/MessageNudge.wav');
      break;
  }

  if (audio) {
    audio.play();
  }

  if (props.duration > 0) {
    timeoutId.value = setTimeout(() => {
      closeToast();
    }, props.duration);
  }
});

const closeToast = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }
  visible.value = false;
  setTimeout(() => { 
    emit('close', props.id);
  }, 400); 
};
</script>

<style scoped>
/* Añadir transiciones de opacidad y transformación para hacer la animación más fluida */
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.toast-fade-enter, .toast-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}


</style>