<template>
    <div class="flex space-x-2 animate-pulse">
      <div v-for="i in itemCount" :key="`breadcrumb-${i}`" class="bg-gray-200 h-4 rounded-md w-16"></div>
    </div>
  </template>
  
  <script setup>
  
  defineProps({
    itemCount: {
      type: Number,
      default: 3
    }
  });
  </script>