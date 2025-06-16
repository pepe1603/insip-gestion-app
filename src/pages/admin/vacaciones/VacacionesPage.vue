<template>
  
    <h1 class="text-3xl text-[#4CAF50] font-semibold text-right">Gestión de Vacaciones</h1>

    <UiTab :tabs="vacacionesTabs" :currentRoute="$route" />

    <div class="container md:min-w-full mt-8">
      <router-view />
    </div>
  
</template>

<script setup>
import UiTab from '../../../components/ui/UiTab.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const vacacionesTabs = ref([
  { label: 'Lista', path: '/admin/vacaciones/lista' },
  { label: 'Crear Nuevo', path: '/admin/vacaciones/crear' },
  { label: 'Reportes', path: '/admin/vacaciones/reportes' },
  { label: 'Opciones Avanzadas', path: '/admin/vacaciones/opciones-avanzadas' }
])
</script>