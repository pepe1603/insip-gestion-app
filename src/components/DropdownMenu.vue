<template>
    <Popover class="relative">
      <PopoverButton class="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
        <span>{{ buttonText }}</span>
        <ChevronDownIcon class="size-5" aria-hidden="true" />
      </PopoverButton>
  
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <PopoverPanel class="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
            <div class="p-4">
              <!-- Aquí puedes pasar cualquier tipo de contenido a través de slots -->
              <slot />
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </template>
  
  <script setup>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import { ChevronDownIcon } from '@heroicons/vue/20/solid'
  
  // Prop que se pasa para cambiar el texto del botón
  const props = defineProps({
    buttonText: {
      type: String,
      default: 'Menu',  // Default value for button text
    },
  })
  </script>
  
  <style scoped>
  /* Estilos para el Popover */
  </style>
  