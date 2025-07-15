<template>
    <div class="bg-gray-200 h-6 rounded-md animate-pulse" :style="{ width: width }"></div>
  </template>
  
  <script setup>
  
  defineProps({
    width: {
      type: String,
      default: '80%'
    }
  });
  </script>