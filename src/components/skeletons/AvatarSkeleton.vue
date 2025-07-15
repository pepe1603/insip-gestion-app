<template>
    <div class="rounded-full bg-gray-200 animate-pulse" :style="{ width: size, height: size }"></div>
  </template>
  
  <script setup>
  
  defineProps({
    size: {
      type: String,
      default: '40px'
    }
  });
  </script>