<template>
    <label class="inline-flex items-center cursor-pointer">
      <input
        :id="id"
        type="checkbox"
        value=""
        class="sr-only peer"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        :disabled="disabled"
      >
      <div
        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600"
      ></div>
      <span v-if="label" class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {{ label }}
      </span>
    </label>
  </template>
  
  <script setup>
  defineProps({
    id: {
      type: String,
      default: 'switch-' + Math.random().toString(36).substring(2, 9),
    },
    label: String,
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  
  defineEmits(['update:modelValue']);
  </script>