<template>
    <div class="space-y-4">
      <UiTable :headers="headers" :data="currentData" />
      <UiPaginator
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :max-visible-pages="maxVisiblePages"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import UiTable from './UiTable.vue'; // Asegúrate de la ruta correcta
  import UiPaginator from './UiPaginator.vue'; // Asegúrate de la ruta correcta
  
  const props = defineProps({
    headers: {
      type: Array,
      required: true,
    },
    allData: {
      type: Array,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    maxVisiblePages: {
      type: Number,
      default: 5,
    },
  });
  
  const emit = defineEmits(['update:page']);
  
  const currentPage = ref(1);
  const totalItems = computed(() => props.allData.length);
  
  const currentData = computed(() => {
    const startIndex = (currentPage.value - 1) * props.itemsPerPage;
    const endIndex = startIndex + props.itemsPerPage;
    return props.allData.slice(startIndex, endIndex);
  });
  
  watch(currentPage, (newValue) => {
    emit('update:page', newValue); // Opcional: Emitir el cambio de página al componente padre si es necesario
  });
  </script>