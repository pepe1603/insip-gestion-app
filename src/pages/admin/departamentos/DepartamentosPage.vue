<template>
    <div class="">
  
      <UiTab :tabs="departamentosTabs" :currentRoute="$route" />
  
      <div class="container sm:mx-auto md:mx-0 mt-8">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  import UiTab from '../../../components/ui/UiTab.vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const departamentosTabs = ref([
    { label: 'Lista', path: '/admin/departamentos/lista' },
    { label: 'Crear Nuevo', path: '/admin/departamentos/crear' },
    { label: 'Generar Reporte', path: '/admin/departamentos/export' },
  ]);
  
  const route = useRoute();
  </script>