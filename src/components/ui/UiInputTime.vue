<template>
    <div class="w-full">
      <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label }}
      </label>
      <input
        :id="id"
        type="time"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :placeholder="placeholder"
        :class="[
          'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-indigo-600 focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-900 dark:focus:border-indigo-500',
          inputSizeClasses,
        ]"
      >
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    id: String,
    label: String,
    placeholder: String,
    modelValue: String,
    required: Boolean,
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
  });
  const emit = defineEmits(['update:modelValue']);
  
  const inputSizeClasses = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'py-1.5 px-2'; // Ajusté el padding para que coincida con p-2.5
      case 'lg':
        return 'py-3.5 px-4'; // Ajusté el padding para que coincida con p-2.5
      default: // md
        return 'p-2.5';
    }
  });
  </script>