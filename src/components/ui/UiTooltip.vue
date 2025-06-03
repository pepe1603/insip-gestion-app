<template>
  <div v-tippy="tooltipOptions" class="relative inline-block">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  tooltipOptions: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
/* Aquí puedes agregar estilos personalizados si es necesario para el contenedor */
</style>