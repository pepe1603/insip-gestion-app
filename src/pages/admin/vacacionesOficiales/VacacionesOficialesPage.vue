<template>
    <div class="">
  
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