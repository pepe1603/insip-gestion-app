<template>
    <div class="bg-gray-200 rounded-md animate-pulse h-10" :style="{ width: width }"></div>
  </template>
  
  <script setup>
  
  defineProps({
    width: {
      type: String,
      default: '100%'
    }
  });
  </script>
  