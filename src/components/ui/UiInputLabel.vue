<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
    </label>
    <div
      class="w-full px-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm 
             ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none"
    >
      {{ value || placeholder }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
});
</script>