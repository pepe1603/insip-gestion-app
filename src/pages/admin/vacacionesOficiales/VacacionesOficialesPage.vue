<template>
    <div class="">
      <h1 class="text-3xl text-[#1976D2] font-semibold text-end">Gestión de Vacaciones Oficiales</h1>
  
      <UiTab :tabs="vacacionesOficialesTabs" :currentRoute="$route" />
  
      <div class="container sm:mx-auto md:mx-0 mt-8">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  import UiTab from '../../../components/ui/UiTab.vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const vacacionesOficialesTabs = ref([
    { label: 'Lista', path: '/admin/vacaciones-oficiales/lista' },
    { label: 'Crear Nuevo', path: '/admin/vacaciones-oficiales/crear' },
  ]);
  
  const route = useRoute();
  </script>