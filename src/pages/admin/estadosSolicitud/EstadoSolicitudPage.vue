<template>
    <div class="">
  
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