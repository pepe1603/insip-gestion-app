<template>
  <transition
    name="toast-fade"
    @before-leave="beforeLeave"
    @leave="onLeave"
  ><div
      v-if="visible"
      class="relative z-50 flex items-center gap-2  mb-4  rounded-md border-l-4 px-3 py-4 transition duration-200 ease-in-out transform hover:scale-105 pointer-events-auto"
      :class="[typeClasses, { 'animate-vibrate': props.type === 'notify' }]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
    <!--Si es una notificacion vamsoa mostrar el incono , y aplicar la animacion de campana timbrarndo y termine antes de que se elimine el toast -->
      <component :is="icon" :class="title ? 'w-7' : 'w-7'" v-if="icon" />

      <div class="flex-1 flex flex-col items-center">
        <p v-if="title" class="font-semibold text-base">{{ title }}</p> <p class="font-normal font-sans text-gray-700 dark:text-gray-100 text-sm">{{ message }}</p>
      </div>

      <button
        type="button"
        class="flex-col items-center justify-center transition-300 transform hover:scale-110"
        @click="closeToast"
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
//importat los estios


import { ref, computed, onMounted } from 'vue';
import {
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
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
    validator: (value) => ['success', 'error', 'warning', 'info', 'notify'].includes(value),
  },
  position: {
    type: String,
    default: 'top-right',
  },
  duration: {
    type: Number,
    default: 5000, // Aumentamos la duración predeterminada a 5000 ms (5 segundos)
  },
  // outline: { // Eliminamos la prop outline
  //   type: Boolean,
  //   default: false, // Por defecto el toast tendrá borde
  // },
});

const emit = defineEmits(['close']);
const visible = ref(true); // Mantener visible como true inicialmente
const timeoutId = ref(null); // Variable para almacenar el ID del timeout

const beforeLeave = () => {
  // Puedes añadir lógica antes de que la transición de salida comience
};

const onLeave = () => {
  // Esta función se ejecuta cuando la transición de salida termina
  // Puedes dejarla vacía si no necesitas lógica aquí
};


const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 text-sm';
    case 'error':
      return 'border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm';
    case 'warning':
      return 'border-yellow-500 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-sm';
    case 'notify':
      return 'border-none dark:border-sky-700 bg-sky-100 dark:bg-sky-900 hover:outline text-sky-600 dark:text-sky-300 text-base';
    case 'info':
    default:
      return 'border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm';
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
    case 'notify':
      return BellAlertIcon;
    case 'info':
    default:
      return InformationCircleIcon;
  }
});


onMounted(() => {
  // Reproducir sonido según el tipo de notificación
  let audio;
  switch (props.type) {
    case 'success':
      audio = new Audio('/audios/tada.wav'); // Ruta al sonido de éxito
      break;
    case 'error':
      audio = new Audio('/audios/error.wav'); // Ruta al sonido de error
      break;
    case 'warning':
      audio = new Audio('/audios/exclamation.wav'); // Ruta al sonido de advertencia
      break;
    case 'notify':
      audio = new Audio('/audios/notify.wav'); // Ruta al sonido de campana
      break;
    case 'info':
    default:
      audio = new Audio('/audios/MessageNudge.wav'); // Ruta al sonido de información
      break;
  }

  // Reproducir el sonido si se asignó un archivo
  if (audio) {
    audio.play();
  }

  // Cerrar el toast después de la duración
  if (props.duration > 0) {
    timeoutId.value = setTimeout(() => {
      closeToast();
    }, props.duration);
  }
});


const closeToast = () => {
//  console.log('Función closeToast() llamada');
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }
  visible.value = false;
  //emit('close', props.id); // Emitir el evento 'close' inmediatamente
   setTimeout(() => { // Comenta o elimina este setTimeout
     emit('close', props.id);
   }, 5000);
};

// Clases para el borde (outline) - YA NO SE USAN AQUÍ DIRECTAMENTE
// const outlineClasses = 'border-2 border-solid border-gray-300 dark:border-gray-600'; // Borde visible (outline)
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


/* Animación de vibración (temblor) para el toast de notificación */
@keyframes vibrate {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  50% {
    transform: translateX(3px);
  }
  75% {
    transform: translateX(-3px);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-vibrate {
  animation: vibrate 0.5s ease-in-out infinite; /* 0.5s es la duración de un ciclo de vibración */
}

</style>