<template>
  <div v-if="empleado" class="p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-inner text-gray-700">
    <h3 class="text-xl font-bold mb-4 text-blue-700">Información del Empleado</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="text-sm font-semibold text-gray-500">ID:</p>
        <p class="text-base font-medium">{{ empleado.id }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Nombre Completo:</p>
        <p class="text-base font-medium">{{ empleado.nombre }} {{ empleado.ape_paterno }} {{ empleado.ape_materno }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Correo:</p>
        <p class="text-base font-medium">{{ empleado.email || 'N/A' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Teléfono:</p>
        <p class="text-base font-medium">{{ empleado.telefono || 'N/A' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Fecha de Nacimiento:</p>
        <p class="text-base font-medium">{{ formatDate(empleado.fecha_nacimiento) || 'N/A' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Dirección:</p>
        <p class="text-base font-medium">{{ empleado.direccion || 'N/A' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Fecha de Ingreso:</p>
        <p class="text-base font-medium">{{ formatDate(empleado.fecha_ingreso) }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Puesto:</p>
        <p class="text-base font-medium">{{ empleado.puesto }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Departamento:</p>
        <p class="text-base font-medium">{{ empleado.departamento?.nombre || 'Sin departamento' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Salario:</p>
        <p class="text-base font-medium">${{ empleado.salario ? empleado.salario.toLocaleString('es-MX') : 'N/A' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Tipo de Contrato:</p>
        <p class="text-base font-medium">{{ empleado.tipo_contrato ? empleado.tipo_contrato.replace('_', ' ').toLowerCase() : 'N/A' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-500">Status:</p>
        <p class="text-base font-medium">
          <UiBadge :color="empleado.status === 'ACTIVO' ? 'green' : 'red'" :text="empleado.status"></UiBadge>
        </p>
      </div>
      </div>
  </div>
  <div v-else class="text-center text-gray-500 py-4">
    No se pudo cargar la información del empleado.
  </div>
</template>

<script setup>
import { formatDate } from '../../../utils/dateFormatter'; // Asegúrate de que la ruta sea correcta
import UiBadge from '../../../components/ui/UiBadge.vue'; // Asegúrate de que la ruta sea correcta

const props = defineProps({
  empleado: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
/* Puedes añadir estilos específicos para la visualización de los detalles aquí */
</style>