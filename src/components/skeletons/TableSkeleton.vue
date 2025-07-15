<template>
    <div class="w-full rounded-md overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-100">
            <th v-for="i in columnCount" :key="`header-${i}`" class="py-2 px-4 text-left">
              <div class="bg-gray-300 h-4 rounded-md animate-pulse w-1/2"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowCount" :key="`row-${row}`">
            <td v-for="index in columnCount" :key="`cell-${row}-${index}`" class="py-2 px-4">
              <div class="bg-gray-200 h-4 rounded-md animate-pulse"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  
  defineProps({
    rowCount: {
      type: Number,
      default: 3
    },
    columnCount: {
      type: Number,
      default: 4
    }
  });
  </script>