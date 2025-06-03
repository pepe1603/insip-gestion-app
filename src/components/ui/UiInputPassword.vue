<template>
    <div class="w-full">
      <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ label }}
      </label>
      <div class="relative">
        <input
          :id="id"
          :type="passwordVisible ? 'text' : 'password'"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :required="required"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-indigo-700 focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-700 dark:focus:border-indigo-700"
        />
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        >
          <IconEye v-if="!passwordVisible" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <IconEyeSlash v-else class="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { EyeIcon as IconEye, EyeSlashIcon as IconEyeSlash } from '@heroicons/vue/20/solid'; // Asegúrate de tener Heroicons instalado
  
  const passwordVisible = ref(false);
  
  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  
  defineProps({
    id: String,
    label: String,
    placeholder: String,
    modelValue: String,
    required: Boolean
  });
  
  defineEmits(['update:modelValue']);
  </script>