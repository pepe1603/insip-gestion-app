<!-- components/ui/UiTextarea.vue -->
<template>
    <div class="w-full">
      <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label }}
      </label>
      <textarea
        :id="id"
        :rows="rows"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-600 outline-indigo-700 focus:border-indigo-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-900 dark:focus:border-indigo-700"
      />
    </div>
  </template>
  
  <script setup>
  defineProps({
    id: String,
    label: String,
    
    placeholder: String,
    rows: {
      type: Number,
      default: 5
    },
    modelValue: String,
    required: Boolean
  })
  
  defineEmits(['update:modelValue'])
  </script>
  