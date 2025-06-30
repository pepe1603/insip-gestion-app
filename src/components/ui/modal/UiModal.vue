<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { ref, watch } from 'vue'

// Definimos las props que recibirá nuestro modal base
const props = defineProps({
  // Controla si el modal está visible o no
  show: {
    type: Boolean,
    default: false,
  },
  // Título opcional del modal
  title: {
    type: String,
    default: '',
  },
  // Si el modal se cierra al hacer clic fuera de él
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
})

// Definimos los eventos que puede emitir este componente
const emit = defineEmits(['close'])

// Usamos una referencia local para controlar la visibilidad interna,
// ya que Headless UI espera una propiedad `open` bidireccional.
const isOpen = ref(props.show)

// Observa cambios en la prop 'show' y actualiza la ref local
watch(
  () => props.show,
  (newVal) => {
    isOpen.value = newVal
  }
)

// Función para cerrar el modal. Emite el evento 'close'
// para que el componente padre pueda reaccionar.
const closeModal = () => {
  isOpen.value = false
  emit('close')
}

// Puedes añadir una función onBeforeEnter si necesitas lógica
// justo antes de que la transición de entrada comience.
const onBeforeEnter = () => {
  // console.log('Antes de entrar el modal');
};

// Puedes añadir una función onAfterLeave si necesitas lógica
// justo después de que la transición de salida termine.
const onAfterLeave = () => {
  // console.log('Después de salir el modal');
};
</script>

<template>
  <TransitionRoot
    appear
    :show="isOpen"
    as="template"
    @before-enter="onBeforeEnter"
    @after-leave="onAfterLeave"
  >
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800"
            >
              <DialogTitle
                v-if="title"
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
              >
                {{ title }}
              </DialogTitle>

              <div class="mt-2">
                <slot></slot>
              </div>

              </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
/* No se necesitan estilos con scope aquí, ya que Headless UI
   y Tailwind CSS manejan la mayor parte de la estilización y transiciones. */
</style>