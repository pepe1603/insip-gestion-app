<template>
  <div class="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
    <h2 class="text-lg font-semibold mb-3 text-gray-800">Últimas Solicitudes Pendientes de Aprobación</h2>
    <p class="text-gray-600 mb-4">
      Aquí se muestran las solicitudes de vacaciones más recientes que aún esperan tu aprobación.
      Prioriza la revisión de estas solicitudes para agilizar el proceso.
    </p>

    <div v-if="loading" class="text-center text-blue-500 py-4">Cargando solicitudes pendientes...</div>
    <div v-else-if="error" class="text-red-500 text-center py-4">Error al cargar solicitudes pendientes: {{ error }}</div>
    <div v-else-if="pendingRequests.length > 0">
      <UiTablestriped
        :headers="tableHeaders"
        :data="formattedPendingRequests"
        :show-filter="false"
        :sortable-headers="false"
        caption-title="Solicitudes Pendientes"
        caption-description="Revisa y gestiona las solicitudes pendientes de acción."
      >
        <template #Id="{ item }">
          <span>#{{ item.Id }}</span>
        </template>
        <template #Empleado="{ item }">
          <strong>{{ item.Empleado }}</strong>
        </template>
        <template #FechaInicio="{ item }">
          <span>{{ item.FechaInicio }}</span>
        </template>
        <template #FechaFin="{ item }">
          <span>{{ item.FechaFin }}</span>
        </template>
        <template #DiasSolicitados="{ item }">
          <span class="font-medium text-blue-600">{{ item.DiasSolicitados }}</span>
        </template>
        <template #Estado="{ item }">
          <UiBadge :text="item.Estado" :color="getEstadoColor(item.Estado)" size="sm" />
        </template>
        <template #Acciones="{ item }">
          <div class="w-full flex gap-1 flex-wrap justify-end">
            <UiButton
              variant="outline-success"
              size="xs"
              @click="$emit('request-action', item, 'APROBADO')"
            >
              Aprobar
            </UiButton>
            <UiButton
              variant="outline-warning"
              size="xs"
              @click="$emit('request-action', item, 'RECHAZADO')"
            >
              Rechazar
            </UiButton>
          </div>
        </template>
      </UiTablestriped>
    </div>
    <div v-else class="text-gray-500 text-center py-4">
      No hay solicitudes pendientes de aprobación en este momento. ¡Buen trabajo!
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import UiTablestriped from '@/components/ui/tables/UiTableStriped.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiBadge from '@/components/ui/UiBadge.vue';
import { formatDate } from '@/utils/dateFormatter';

const props = defineProps({
  pendingRequests: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['request-action']);

const tableHeaders = [
  { label: 'ID', key: 'Id' },
  { label: 'Empleado', key: 'Empleado' },
  { label: 'Fecha Solicitud', key: 'FechaSolicitud' },
  { label: 'Fecha Inicio', key: 'FechaInicio' },
  { label: 'Fecha Fin', key: 'FechaFin' },
  { label: 'Días', key: 'DiasSolicitados' },
  { label: 'Estado', key: 'Estado' },
  { label: 'Acciones', key: 'Acciones' }
];

const formattedPendingRequests = computed(() => {
  return props.pendingRequests.map(v => ({
    Id: v.id,
    Empleado: `${v.empleado?.nombre || ''} ${v.empleado?.ape_paterno || ''} ${v.empleado?.ape_materno || ''}`.trim(),
    FechaSolicitud: formatDate(v.fecha_solicitud || v.created_at),
    FechaInicio: formatDate(v.fecha_inicio),
    FechaFin: formatDate(v.fecha_fin),
    DiasSolicitados: v.dias_vacaciones_solicitados,
    Estado: v.estado_solicitud?.estado || 'Desconocido',
    originalItem: v, // Keep the full original object for details
  }));
});

const getEstadoColor = (estado) => {
  switch (estado?.toUpperCase()) {
    case 'PENDIENTE':
      return 'yellow';
    case 'APROBADO':
      return 'green';
    case 'RECHAZADO':
      return 'red';
    case 'CANCELADO':
      return 'gray';
    default:
      return 'gray';
  }
};
</script>

<style scoped>
/* Add any specific styles for this component here */
</style>