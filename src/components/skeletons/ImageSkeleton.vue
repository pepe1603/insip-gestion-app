<template>
    <div class="bg-gray-200 rounded animate-pulse" :style="{ width: width, height: height }"></div>
  </template>
  
  <script setup>
  
  defineProps({
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    }
  });
  </script>