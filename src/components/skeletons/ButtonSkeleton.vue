<template>
    <div class="bg-gray-200 rounded-md animate-pulse py-2 px-4" :style="{ width: width }"></div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    width: {
      type: String,
      default: '60px'
    }
  });
  </script>