<template>
    <div>
      <h1 class="text-3xl text-[#4CAF50] font-semibold text-end">Gestión de Asistencias</h1>
  
      <UiTab :tabs="asistenciasTabs" :currentRoute="$route" />
  
      <div class="container sm:mx-auto md:mx-0 mt-8">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  //este archivo se ubnica en src/pages/admin/asistencias/AsistenciasPage.vue
  import UiTab from '../../../components/ui/UiTab.vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const asistenciasTabs = ref([
    { label: 'Lista', path: '/admin/asistencias/lista' },
    { label: 'Crear Nuevo', path: '/admin/asistencias/crear' },
    { label: 'Reportes', path: '/admin/asistencias/reportes' }
  ]);
  
  const route = useRoute();
  </script>