<template>
  <div class="w-full sm:w-auto">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      @change="updateValue($event.target.value)"
      :disabled="disabled" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-700 outline-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-900 dark:focus:border-indigo-700"
      :class="{ 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 opacity-60': disabled }" >
      <option disabled value="">Selecciona una opción</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  modelValue: String, // Vinculación de v-model con el valor
  options: {
    type: Array,
    default: () => []
  },
  disabled: {         type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue']) // Emitir evento de actualización

const updateValue = (newValue) => {
  emit('update:modelValue', newValue) // Emitir evento de actualización del valor
}
</script>