<!-- components/ui/UiInputUrl.vue -->
<template>
    <div class="w-full">
      <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label }}
      </label>
      <input
        :id="id"
        type="url"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-indigo-700 focus:ring-indigo-800 focus:border-indigo-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-900 dark:focus:border-indigo-600"
        :pattern="urlPattern"
      />
    </div>
  </template>
  
  <script setup>
  defineProps({
    id: String,
    label: String,
    placeholder: String,
    modelValue: String,
    required: Boolean
  })
  
  defineEmits(['update:modelValue'])
  
  const urlPattern = "https?://.*"  // Validación simple para URL (http/https)
  </script>
  