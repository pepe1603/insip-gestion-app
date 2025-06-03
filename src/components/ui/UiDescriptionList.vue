<template>
    <div class="border border-gray-200 py-8 px-4 rounded-lg">
      <div v-if="title" class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
        <p v-if="description" class="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">{{ description }}</p>
      </div>
      <div class="mt-6 border-t border-gray-200 dark:border-gray-800">
        <dl class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
          >
            <dt class="text-sm/6 font-medium text-gray-900 dark:text-white">{{ item.label }}</dt>
            <dd class="mt-1 text-sm/6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              <slot :name="item.key" :item="item">{{ item.value }}</slot>
            </dd>
          </div>
          <slot name="append"></slot>
        </dl>
      </div>
    </div>
  </template>
  
  <script setup>

  
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
      validator: (items) => items.every(item => item.label && (item.value !== undefined || item.key)),
    },
  });
  </script>