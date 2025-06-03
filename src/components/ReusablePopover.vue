<template>
    <Popover class="relative">
      <PopoverButton class="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900">
        <span>Solutions</span>
        <ChevronDownIcon class="size-5" aria-hidden="true" />
      </PopoverButton>
  
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <PopoverPanel class="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm shadow-lg ring-1 ring-gray-900/5">
            <div class="p-4">
              <!-- Enlaces dinámicos del popover -->
              <div v-for="item in menuLinks" :key="item.name" class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <component :is="item.icon" class="size-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <a :href="item.href" class="font-semibold text-gray-900">
                    {{ item.name }}
                    <span class="absolute inset-0" />
                  </a>
                  <p class="mt-1 text-gray-600">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </template>
  
  <script setup>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import { ChevronDownIcon } from '@heroicons/vue/20/solid'
  import { PlayCircleIcon, PhoneIcon } from '@heroicons/vue/24/outline'
  
  const menuLinks = [
    { name: 'Home', description: 'Return to home page', href: '/', icon: PlayCircleIcon },
    { name: 'About Us', description: 'Learn more about us', href: '/about', icon: PhoneIcon },
    { name: 'Admin', description: 'Go to the admin page', href: '/admin', icon: PlayCircleIcon },
  ]
  </script>
  
  <style scoped>
  /* Estilos adicionales para el popover */
  </style>
  