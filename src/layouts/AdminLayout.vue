<template>
  <div class="h-screen bg-gray-100 text-gray-900 overflow-hidden p-0.5 flex flex-col md:flex-row">
    <Sidebar />

    <div class="flex-1 flex flex-col gap-2 p-2.5 overflow-hidden">
      <ProfileHeader />

      <main class="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-tl-lg shadow-inner">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// Importa los componentes hijos
import Sidebar from '@/components/layout/Sidebar.vue';
import ProfileHeader from '@/components/layout/ProfileHeader.vue';
</script>

<style scoped>
/* Puedes añadir estilos específicos para el AdminLayout aquí */
/* Por ejemplo, para el scrollbar en webkit si `overflow-y-auto` no es suficiente */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>