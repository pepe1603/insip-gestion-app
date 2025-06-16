<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Opciones Avanzadas de Vacaciones</h1>
    <p class="text-gray-700 mb-4 text-center">
      Aquí puedes registrar empleados con vacaciones históricas y realizar otras configuraciones avanzadas.
    </p>

    <RegistrarEmpleadoConVacaciones />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Importa los componentes hijo (ejemplo)
import RegistrarEmpleadoConVacaciones from '../../../components/features/vacaciones/CrearEmpleadoConVacaciones.vue'
import { RouterView } from 'vue-router';

</script>