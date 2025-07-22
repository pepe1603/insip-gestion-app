<template>
  <div class="w-full">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <input
      :id="id"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :disabled="disabled" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-indigo-700 focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-700 dark:focus:border-indigo-700"
      :class="{ 'cursor-not-allowed opacity-75': disabled }" />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: String,
  required: Boolean,
  disabled: { // Added new prop
    type: Boolean,
    default: false
  },
});

defineEmits(['update:modelValue']);
</script>