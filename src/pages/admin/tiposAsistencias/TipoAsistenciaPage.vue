<template>
    <div class="">
      <h1 class="text-3xl text-[#9ABF49] font-semibold text-end">Gestión de Tipos de Asistencia</h1>
  
      <UiTab :tabs="tiposAsistenciaTabs" :currentRoute="$route" />
  
      <div class="container sm:mx-auto md:mx-0 mt-8">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script setup>
  import UiTab from '../../../components/ui/UiTab.vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const tiposAsistenciaTabs = ref([
    { label: 'Lista', path: '/admin/tipos-asistencia/lista' },
    { label: 'Crear Nuevo', path: '/admin/tipos-asistencia/crear' },
  ]);
  
  const route = useRoute();
  </script>