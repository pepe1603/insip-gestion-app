<template>
    <div class="cursor-pointer p-0">
      

        <label :for="props.id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ props.label }}
        </label>

            <VueDatePicker
                :id="id"
                type="date"
                :model-value="modelValue"
                @update:model-value="$emit('update:modelValue', $event)"
                :placeholder="placeholder"
                :format="format"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />

        </div>
    
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'; // Importa los estilos de @vuepic/vue-datepicker
  
  const props = defineProps({
    id: {
      type: String,
      default: 'datepicker-' + Math.random().toString(36).substring(2, 9), // Generar un ID único por defecto
    },
    label: String, // Puedes agregar un label si lo necesitas
    modelValue: [String, Date],
    placeholder: {
      type: String,
      default: 'Select date',
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd', // Formato por defecto
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  </script>