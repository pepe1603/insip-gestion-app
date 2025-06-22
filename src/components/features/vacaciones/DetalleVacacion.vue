<template>
  <div class="p-4 sm:p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Detalles Completos de la Solicitud de Vacaciones</h2>

    <div v-if="vacacion && vacacion.originalItem">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">ID Solicitud:</strong> #{{ vacacion.Id }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Estado Actual:</strong>
          <UiBadge :text="vacacion.Estado" :color="getEstadoColor(vacacion.Estado)" size="sm" class="ml-2" />
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Fecha de Solicitud:</strong>
          {{ vacacion.originalItem.fecha_solicitud ? formatDate(vacacion.originalItem.fecha_solicitud) : 'N/A' }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Fecha de Inicio:</strong> {{ vacacion.FechaInicio }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Fecha de Fin:</strong> {{ vacacion.FechaFin }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Días Solicitados:</strong> <span class="font-medium text-blue-600">{{ vacacion.DiasSolicitados }}</span>
        </p>

        <div class="col-span-full border-t pt-4 mt-4">
          <h3 class="text-lg font-semibold text-center text-gray-800 mb-3">Información del Empleado</h3>
        </div>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Empleado:</strong> {{ vacacion.Empleado }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">ID Empleado:</strong> {{ vacacion.originalItem.empleado?.id || 'Desconcido' }}
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
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Días Vacaciones Disponibles:</strong> {{ vacacion.originalItem.dias_vacaciones_disponibles || 'N/A' }}
        </p>
        <p class="text-base sm:text-lg">
          <strong class="font-semibold">Ciclo de Servicio :</strong> {{ vacacion.originalItem.ciclo_servicio.anio || 'N/A' }}
        </p>
        <p class="text-base sm:text-lg col-span-full">
          <strong class="font-semibold">Motivo/Comentarios:</strong>
          {{ vacacion.originalItem.observaciones || 'No especificado' }}
        </p>
        <p class="text-base sm:text-lg col-span-full">
          <strong class="font-semibold">Descripción del Estado:</strong>
          {{ vacacion.originalItem.estado_solicitud?.descripcion || 'No disponible' }}
        </p>
        <p class="text-base sm:text-lg col-span-full">
          <strong class="font-semibold">Fecha de Aprobación:</strong>
          <p class="text-gray-500">
          <span v-if="vacacion.originalItem.fecha_aprobacion===null"> La fecha de aprobación es desconocida. </span>
          <span v-if="vacacion.Estado === 'PENDIENTE'">{{ vacacion.originalItem.fecha_aprobacion === 'PENDIENTE' ? formatDateTime(vacacion.originalItem.fecha_aprobacion) : ' Esta pendiente por aprobar' }}</span>
          <span v-else-if="vacacion.Estado === 'RECHAZADO'">{{ vacacion.originalItem.fecha_aprobacion === 'RECHAZADO' ? formatDateTime(vacacion.originalItem.fecha_aprobacion) : ' Ha sido rechazada' }}</span>
          <span v-else-if="vacacion.Estado === 'CANCELADO'">{{ vacacion.originalItem.fecha_aprobacion === 'CANCELADO' ? formatDateTime(vacacion.originalItem.fecha_aprobacion) : ' Ha sido cancelada' }}</span>
          <span v-else-if="vacacion.Estado === 'APROBADO'">{{ vacacion.originalItem.fecha_aprobacion === 'APROBADO' ? formatDateTime(vacacion.originalItem.fecha_aprobacion) : ' Ha sido aprobada el ' + vacacion.originalItem.fecha_aprobacion }}</span>
          </p>
        </p>

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
import UiBadge from '../../ui/UiBadge.vue'; // Asegúrate de que esta ruta sea correcta para tu proyecto
import { formatDate, formatDateTime } from '../../../utils/dateFormatter'; // Asegúrate de que estas rutas sean correctas

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

// No es necesario onMounted en este caso si solo haces un console.log,
// pero lo mantengo si tienes planes futuros para él.
// import { onMounted } from 'vue';
onMounted(() => {
  console.log('DetalleVacacion montado');
  console.log('Vacación recibida:', props.vacacion);
});
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
</style>