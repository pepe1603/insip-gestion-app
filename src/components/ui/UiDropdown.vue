<template>
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
          :class="[
            'inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700',
            buttonClass,
          ]"
        >
          <slot name="button">
            {{ label }}
            <ChevronDownIcon class="-mr-1 size-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          </slot>
        </MenuButton>
      </div>
  
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          :class="[
            'absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600',
            menuClass,
          ]"
        >
          <div class="py-1">
            <MenuItem v-for="(item, index) in items" :key="index" v-slot="{ active }">
              <component
                :is="item.href ? 'a' : item.type === 'button' ? 'button' : 'div'"
                :href="item.href"
                :type="item.type"
                @click="item.onClick ? item.onClick(item) : () => {}"
                :class="[
                  active
                    ? 'bg-gray-100 text-gray-900 outline-none dark:bg-gray-700 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300',
                  'block w-full px-4 py-2 text-left text-sm cursor-pointer',
                  item.class, // Para estilos individuales de cada item
                ]"
              >
                <slot name="item" :item="item">
                  {{ item.label }}
                </slot>
              </component>
            </MenuItem>
            <slot name="footer"></slot>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </template>
  
  <script setup>
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
  import { ChevronDownIcon } from '@heroicons/vue/20/solid';
  import { defineProps } from 'vue';
  
  const props = defineProps({
    label: {
      type: String,
      default: 'Options',
    },
    items: {
      type: Array,
      default: () => [],
      validator: (items) => items.every(item => item.label),
    },
    buttonClass: {
      type: [String, Object, Array],
      default: '',
    },
    menuClass: {
      type: [String, Object, Array],
      default: '',
    },
  });
  </script>