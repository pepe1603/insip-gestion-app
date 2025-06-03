<template>
  <div class="flex h-screen bg-gray-10">
    <Sidebar />
    <main class="flex-1 overflow-y-auto mr-2 my-2 p-4  border border-gray-200 rounded-lg">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/layout/Sidebar.vue'; // Asegúrate de que la ruta sea correcta
import { RouterView } from 'vue-router';
</script>