<template>
    <kbd
      :class="[
        'inline-flex items-center justify-center px-2.5 py-1.5  gap-1 text-sm font-mono text-white  rounded-md',
        customClass
      ]"
    >
      <slot />
    </kbd>
  </template>
  
  <script setup>
  defineProps({
    customClass: {
      type: String,
      default: 'bg-gray-200'
    }
  });
  </script>
  
  <style scoped>
  /* Estilo opcional adicional si es necesario */
  </style>
  