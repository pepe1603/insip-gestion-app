<template>
  <div class="p-4 sm:p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md">
    <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Detalles Completos de la Solicitud de Vacaciones</h2>

    <div v-if="vacacion">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">ID Solicitud:</strong> #{{ vacacion.originalItem.id }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Estado Actual:</strong>
          <UiBadge :text="vacacion.originalItem.estado_solicitud?.estado || 'Desconocido'" :color="getEstadoColor(vacacion.originalItem.estado_solicitud?.estado)" size="sm" class="ml-2" />
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Fecha de Solicitud:</strong>
          {{ vacacion.originalItem.fecha_solicitud ? formatDate(vacacion.originalItem.fecha_solicitud) : 'N/A' }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Fecha de Inicio:</strong> {{ formatDate(vacacion.originalItem.fecha_inicio) }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Fecha de Fin:</strong> {{ formatDate(vacacion.originalItem.fecha_fin) }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Días Solicitados:</strong> <span class="font-medium text-blue-600">{{ vacacion.originalItem.dias_vacaciones_solicitados }}</span>
        </p>

        <div class="col-span-full border-t pt-4 mt-4">
          <h3 class="text-lg font-semibold text-center text-gray-800 mb-3">Información del Empleado</h3>
        </div>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Empleado:</strong> {{ `${vacacion.originalItem.empleado?.nombre || ''} ${vacacion.originalItem.empleado?.ape_paterno || ''} ${vacacion.originalItem.empleado?.ape_materno || ''}`.trim() }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">ID Empleado:</strong> {{ vacacion.originalItem.empleado?.id || 'Desconocido' }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Correo Electrónico:</strong> {{ vacacion.originalItem.empleado?.email || 'Desconocido' }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Teléfono:</strong> {{ vacacion.originalItem.empleado?.telefono || 'Desconocido' }}
        </p>
        <div class="col-span-full border-t pt-4 mt-4">
          <h3 class="text-lg font-semibold text-center text-gray-800 mb-3">Detalles de la Solicitud</h3>
        </div>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Días Vacaciones Totales:</strong> {{ vacacion.originalItem.dias_vacaciones_totales || 'N/A' }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Días Vacaciones Disfrutados:</strong> {{ vacacion.originalItem.dias_vacaciones_disfrutados || 'N/A' }}
          <span class="italic">Nota:  Se actualiza cuando la solicitud ha sido aprobada.</span>
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Días Vacaciones Disponibles:</strong> {{ vacacion.originalItem.dias_vacaciones_disponibles || 'N/A' }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Ciclo de Servicio :</strong> {{ vacacion.originalItem.ciclo_servicio?.anio || 'N/A' }}
        </p>
        <p class="text-base sm:text-lg col-span-full">
          <strong class="font-semibold">Motivo/Comentarios:</strong>
          {{ vacacion.originalItem.observaciones || 'No especificado' }}
        </p>
        <p class="text-base sm:text-lg col-span-full">
          <strong class="font-semibold">Descripción del Estado:</strong>
          {{ vacacion.originalItem.estado_solicitud?.descripcion || 'No disponible' }}
        </p>
        <div class="text-base sm:text-lg col-span-full">
          <strong class="font-semibold">Fecha de Aprobación:</strong>
          <p class="text-gray-500">
            {{ getMensajeFechaAprobacion() }}  
          </p>
        </div>

        <div class="col-span-full mt-4 border-t pt-4 text-sm text-gray-500">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Historial de Tiempos</h3>
          <p>
            <strong class="font-semibold">Creado el:</strong>
            {{ vacacion.originalItem.created_at ? formatDateTime(vacacion.originalItem.created_at) : 'N/A' }}
          </p>
          <p>
            <strong class="font-semibold">Última Actualización:</strong>
            {{ vacacion.originalItem.updated_at ? formatDateTime(vacacion.originalItem.updated_at) : 'N/A' }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
      No se han podido cargar los detalles de la vacación.
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import UiBadge from '../../ui/UiBadge.vue';
import { formatDate, formatDateTime } from '../../../utils/dateFormatter';

const props = defineProps({
  vacacion: {
    type: Object,
    default: null,
  },
});

// Función para determinar el color del badge según el estado
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

const getMensajeFechaAprobacion = () => {
  const { estado_solicitud, fecha_aprobacion } = props.vacacion; // Accede directamente a las propiedades del objeto original
  const estado = estado_solicitud?.estado;

  if (!fecha_aprobacion) {
    if (estado?.toUpperCase() === 'PENDIENTE') return 'Está pendiente por aprobar.';
    return 'La fecha de aprobación es desconocida.';
  }

  // Refina la lógica para la fecha de aprobación
  if (estado?.toUpperCase() === 'APROBADO') {
    return 'Ha sido aprobada el ' + formatDate(fecha_aprobacion); // Usar formatDate para asegurar formato
  } else if (estado?.toUpperCase() === 'RECHAZADO') {
    return 'Ha sido rechazada.';
  } else if (estado?.toUpperCase() === 'CANCELADO') {
    return 'Ha sido cancelada.';
  }
  return 'Estado no reconocido';
};


onMounted(() => {
  console.log('DetalleVacacion montado');
  console.log('Vacación recibida:', props.vacacion);
});
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
</style>