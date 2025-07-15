<template>
    <div class="bg-gray-200 h-4 rounded-md animate-pulse" :style="{ width: width }"></div>
  </template>
  
  <script setup>
  
  defineProps({
    width: {
      type: String,
      default: '100%'
    }
  });
  </script>