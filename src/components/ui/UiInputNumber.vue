<template>
  <div class="w-full">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <input
      :id="id"
      type="number" :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :disabled="disabled" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-indigo-600 focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-900 dark:focus:border-indigo-500"
      :class="{ 'cursor-not-allowed bg-gray-100 dark:bg-gray-800': disabled }" />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: [String, Number], // Puede ser String o Number para v-model en inputs numéricos
  required: Boolean,
  disabled: {                  type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])
</script>