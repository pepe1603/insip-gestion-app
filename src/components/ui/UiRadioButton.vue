<template>
    <div class="flex items-center">
      <input
        :id="id"
        type="radio"
        class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        :value="value"
        :checked="modelValue === value"
        @change="handleRadioChange"
        :disabled="disabled"
      />
      <label v-if="label" :for="id" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {{ label }}
      </label>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  // Definimos las propiedades que recibe el componente
  const props = defineProps({
    id: {
      type: String,
      default: 'radio-' + Math.random().toString(36).substring(2, 9),
    },
    label: String,
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
    value: {
      type: [String, Number, Boolean],
      required: true,  // El valor de cada radio button será obligatorio
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  // Función para manejar el cambio de estado del radio button
  const handleRadioChange = () => {
    emit('update:modelValue', props.value)
  }
  
  </script>
  