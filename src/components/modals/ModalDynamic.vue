<template>
  <TransitionRoot as="template" :show="isOpen" @close="handleClose">
    <Dialog class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex gap-2 sm:items-start relative">
                  <div
                    class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 absolute -top-4 -left-2"
                    :class="iconClass"
                  >
                    <component :is="icon" class="size-6" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 text-center mb-4">
                      {{ titleToShow }}
                    </DialogTitle>
                    <div class="mt-2">
                      <slot name="body">
                        <p class="text-sm text-gray-500">{{ contentToShow }}</p>
                      </slot>
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative bg-gray-50 px-4 py-3 flex flex-row-reverse gap-2 sm:px-6 ">
                <slot name="primary-action">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto"
                    :class="buttonClass"
                    @click="handlePrimaryAction"
                  >
                    Aceptar
                  </button>
                </slot>

                <template v-if="$slots['secondary-action']">
                  <slot name="secondary-action" />
                </template>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { ShieldCheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  type: { type: String, required: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' }
})

const emit = defineEmits(['update:isOpen', 'primary-action', 'secondary-action'])

const modalTypes = [
  {
    type: 'informative',
    icon: InformationCircleIcon,
    title: 'Información',
    content: 'Este es un mensaje informativo para el usuario.',
    buttonClass: 'bg-blue-600 hover:bg-blue-500',
    iconClass: 'bg-blue-100 text-blue-600'
  },
  {
    type: 'warning',
    icon: ExclamationTriangleIcon,
    title: 'Advertencia',
    content: 'Este es un mensaje de advertencia.',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-500',
    iconClass: 'bg-yellow-100 text-yellow-600'
  },
  {
    type: 'error',
    icon: XCircleIcon,
    title: 'Error',
    content: 'Ocurrió un error, por favor intente de nuevo.',
    buttonClass: 'bg-red-600 hover:bg-red-500',
    iconClass: 'bg-red-100 text-red-600'
  },
  {
    type: 'success',
    icon: CheckCircleIcon,
    title: 'Éxito',
    content: 'La operación se completó con éxito.',
    buttonClass: 'bg-green-600 hover:bg-green-500',
    iconClass: 'bg-green-100 text-green-600'
  },
  {
    type: 'neutral',
    icon: InformationCircleIcon,
    title: 'Neutral',
    content: 'Este es un mensaje neutral.',
    buttonClass: 'bg-gray-600 hover:bg-gray-500',
    iconClass: 'bg-gray-100 text-gray-600'
  },
  {
    type: 'dark',
    icon: ShieldCheckIcon,
    title: 'Modo Oscuro',
    content: 'Este es un mensaje en modo oscuro.',
    buttonClass: 'bg-black hover:bg-gray-800',
    iconClass: 'bg-slate-900 text-slate-50'
  },
  {
    type: 'orange',
    icon: InformationCircleIcon,
    title: 'Naranja',
    content: 'Este es un mensaje naranja.',
    buttonClass: 'bg-orange-600 hover:bg-orange-500',
    iconClass: 'bg-orange-100 text-orange-600'
  },
  {
    type: 'purple',
    icon: ChatBubbleLeftEllipsisIcon,
    title: 'Púrpura',
    content: 'Este es un mensaje púrpura.',
    buttonClass: 'bg-purple-600 hover:bg-purple-500',
    iconClass: 'bg-purple-100 text-purple-600'
  }
]

const modal = computed(() => modalTypes.find(m => m.type === props.type) || {})
const titleToShow = computed(() => props.title || modal.value.title || 'Modal')
const contentToShow = computed(() => props.content || modal.value.content || '')
const icon = computed(() => modal.value.icon)
const buttonClass = computed(() => modal.value.buttonClass)
const iconClass = computed(() => modal.value.iconClass)

const handleClose = () => emit('update:isOpen', false)
const handlePrimaryAction = () => {
  emit('primary-action')
  emit('update:isOpen', false)
}
const handleSecondaryAction = () => {
  emit('secondary-action')
  emit('update:isOpen', false)
}
</script>

<style scoped>
.size-10 { width: 40px; height: 40px; }
.size-12 { width: 48px; height: 48px; }
.size-6 { width: 24px; height: 24px; }
</style>
