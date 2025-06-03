<template>
    <div class="flex items-center">
      <input
        :id="id"
        type="checkbox"
        class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        :value="value"
        :checked="isCheckedComputed"
        @change="handleCheckboxChange"
        :disabled="disabled"
      >
      <label v-if="label" :for="id" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {{ label }}
      </label>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  // Define las propiedades que recibe el componente
  const props = defineProps({
    id: {
      type: String,
      default: 'checkbox-' + Math.random().toString(36).substring(2, 9),
    },
    label: String,
    modelValue: {
      type: [Boolean, Array],
      default: false,
    },
    value: {
      type: [String, Number, Boolean],
      required: false, // Hacemos que 'value' sea opcional para checkboxes individuales
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  // Manejar el cambio de estado del checkbox
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked
  
    if (Array.isArray(props.modelValue)) {
      // Si modelValue es un array (checkboxes en grupo)
      if (isChecked) {
        emit('update:modelValue', [...props.modelValue, props.value])
      } else {
        emit('update:modelValue', props.modelValue.filter(v => v !== props.value))
      }
    } else {
      // Si modelValue es un booleano (checkbox individual)
      emit('update:modelValue', isChecked)
    }
  }
  
  // Computed para manejar el estado del checkbox
  const isCheckedComputed = computed(() => {
    return Array.isArray(props.modelValue)
      ? props.modelValue.includes(props.value)
      : props.modelValue
  })
  </script>
  