<template>
    <div class="">
      <h1 class="text-3xl text-[#FFA000] font-semibold text-end">Gestión de Estados de Solicitud</h1>
  
      <UiTab :tabs="estadosSolicitudTabs" :currentRoute="$route" />
  
      <div class="container sm:mx-auto md:mx-0 mt-8">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  import UiTab from '../../../components/ui/UiTab.vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const estadosSolicitudTabs = ref([
    { label: 'Lista', path: '/admin/estados-solicitud/lista' },
    { label: 'Crear Nuevo', path: '/admin/estados-solicitud/crear' },
  ]);
  
  const route = useRoute();
  </script>