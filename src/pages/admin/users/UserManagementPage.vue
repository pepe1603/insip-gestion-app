<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
      Gestión de Usuarios
    </h1>

    <UiTab :tabs="userTabs" :currentRoute="$route" />

    <div class="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import UiTab from '@/components/ui/UiTab.vue'; // Asegúrate de que la ruta sea correcta
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// Define las pestañas para la navegación de usuarios
const userTabs = ref([
  { label: 'Lista de Usuarios', path: '/admin/users/list' }, // Se mapeará a UserListPage.vue
  { label: 'Crear Usuario', path: '/admin/users/create' }, // Se mapeará a UserCreateEditPage.vue (modo crear)
  // Opcional: Si tienes una sección de roles o permisos, podrías añadirla aquí
  // { label: 'Roles y Permisos', path: '/admin/users/roles' },
]);

const route = useRoute(); // Para pasar a UiTab, aunque UiTab ya usa $route directamente
</script>

<style scoped>
/* Puedes añadir estilos específicos para UserManagementPage.vue aquí */
</style>