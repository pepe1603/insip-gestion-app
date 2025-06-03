<template>
    <div class="space-y-2">
      <div v-for="i in itemCount" :key="i" class="bg-gray-200 h-4 rounded-md animate-pulse"></div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    itemCount: {
      type: Number,
      default: 3
    }
  });
  </script>