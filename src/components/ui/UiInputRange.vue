<template>
  <div class="w-full">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <input
      :id="id"
      type="range"
      :value="modelValue"
      :min="normalizedMin"
      :max="normalizedMax"
      :step="normalizedStep"
      :disabled="disabled"
      @input="updateValue($event.target.value)"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-indigo-700 focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-700 dark:focus:border-indigo-700"
    />
    <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>{{ normalizedMin }}</span>
      <span class="hover:font-medium">{{ modelValue }}</span>
      <span>{{ normalizedMax }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits();

const props = defineProps({
  label: String,
  id: String,
  modelValue: {
    type: [Number, String],
    default: 50
  },
  min: {
    type: [Number, String],
    default: 0
  },
  max: {
    type: [Number, String],
    default: 100
  },
  step: {
    type: [Number, String],
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

// Computed properties para garantizar que los valores sean numéricos
const normalizedMin = computed(() => Number(props.min));
const normalizedMax = computed(() => Number(props.max));
const normalizedStep = computed(() => Number(props.step));

const updateValue = (value) => {
  emit("update:modelValue", Number(value));
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>