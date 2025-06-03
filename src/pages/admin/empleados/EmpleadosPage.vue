<template>
    <div class="">
      <h1 class="text-3xl text-[#4CAF50] font-semibold text-end">Gestión de Empleados</h1>
  
      <UiTab :tabs="empleadosTabs" :currentRoute="$route" />
  
      <div class="container sm:mx-auto md:mx-0 mt-8">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  import UiTab from '../../../components/ui/UiTab.vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const empleadosTabs = ref([
    { label: 'Lista', path: '/admin/empleados/lista' },
    { label: 'Crear Nuevo', path: '/admin/empleados/crear' },
    { label: 'Generar Reporte', path: '/admin/empleados/export' }
  ]);
  
  const route = useRoute();
  </script>