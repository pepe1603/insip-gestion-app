<template>
  <div class="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-800 flex items-center">
        <CalendarDaysIcon class="w-7 h-7 mr-2 text-indigo-500" />
        Vacaciones Aprobadas (Disfrutadas)
      </h3>
      <span v-if="empleadoNombre" class="text-lg font-semibold text-blue-700">
        Empleado: {{ empleadoNombre }}
      </span>
    </div>

    <div v-if="cargando" class="text-center py-8 text-gray-500">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3"></div>
      Cargando historial de vacaciones y disponibilidad...
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">¡Error al cargar!</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
      <p class="mt-2 text-sm">Asegúrate de que el empleado exista y tenga solicitudes de vacaciones.</p>
    </div>

    <div v-else>
      <div v-if="disponibilidadEmpleado" class="mb-6">
        <div class="mx-auto rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 shadow p-4 border border-blue-100">
          <p class="font-semibold text-lg mb-2 text-blue-800 flex items-center gap-2">
            <SparklesIcon class="w-5 h-5 text-indigo-400" />
            <span class="underline">Disponibilidad Actual</span>
          </p>
          <ul class="divide-y divide-blue-100">
            <li class="py-1 flex justify-between items-center text-gray-700">
              <span class="text-gray-600">Días pendientes año anterior:</span>
              <span class="font-semibold text-blue-700">{{ disponibilidadEmpleado.dias_arrastrados }}</span>
            </li>

            <li class="py-1 flex justify-between items-center text-gray-700">
              <span class="text-gray-600">Días de vacaciones:</span>
              <span class="font-semibold text-blue-600">{{ disponibilidadEmpleado.total_asignado }}</span>
            </li>

            <!--
            <li class="py-1 flex justify-between items-center text-gray-700">
              <span class="text-gray-600">Vacaciones por antigüedad:</span>
              <span class="font-semibold text-yellow-600">{{ disponibilidadEmpleado.total_base_por_antiguedad }}</span>
            </li>
        -->
            <li class="py-1 flex justify-between items-center text-gray-700">
              <span class="text-gray-600">Días usados:</span>
              <span class="font-semibold text-red-600">{{ disponibilidadEmpleado.usado }}</span>
            </li>
          </ul>
            <li class="py-1 flex justify-between items-center text-gray-700">
              <span class="text-gray-600">Días disponibles:</span>
              <span class="font-semibold text-green-600">{{ disponibilidadEmpleado.disponible }}</span>
            </li>
        </div>
      </div>
      <div v-else-if="!disponibilidadEmpleado && !cargando && !error" class="text-gray-500 italic text-center py-4">
        No se pudo cargar la disponibilidad de vacaciones.
      </div>


      <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <ClipboardDocumentListIcon class="w-6 h-6 mr-2 text-gray-500" />
        Historial de Vacaciones Aprobadas
      </h4>
      <div v-if="vacacionesAprobadas.length === 0" class="text-gray-500 italic text-center py-4">
        No se encontraron vacaciones aprobadas para este empleado.
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="(vacacion, index) in vacacionesAprobadas"
          :key="vacacion.id"
          :class="{
            'bg-blue-50 border-blue-300 shadow-lg ring-2 ring-blue-200': isMostRecent(vacacion),
            'bg-white border-gray-200': !isMostRecent(vacacion)
          }"
          class="p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 ease-in-out"
        >
          <div class="flex-1 mb-2 md:mb-0">
            <p class="text-gray-800 font-medium text-lg">
              Desde <span class="text-indigo-600">{{ formatDate(vacacion.fecha_inicio) }}</span>
              hasta <span class="text-indigo-600">{{ formatDate(vacacion.fecha_fin) }}</span>
            </p>
            <p class="text-sm text-gray-600">
              Días solicitados: <span class="font-semibold">{{ vacacion.dias_vacaciones_solicitados }}</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Solicitud ID: #{{ vacacion.id }}
              <span v-if="isMostRecent(vacacion)" class="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full">Más Reciente</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <UiBadge :text="vacacion.estado_solicitud?.estado || 'Desconocido'" color="green" size="md" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import VacacionesService from '../../../services/vacacionesService'; // Tu servicio de vacaciones
import { formatDate } from '../../../utils/dateFormatter'; // Tu utilidad para formatear fechas
import UiBadge from '../../ui/UiBadge.vue'; // Tu componente de badge
import { CalendarDaysIcon, SparklesIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'; // Íconos

const props = defineProps({
  empleadoId: {
    type: [String, Number],
    required: true,
  },
  // Opcional: para mostrar el nombre del empleado si ya lo tienes en el padre
  empleadoNombre: {
    type: String,
    default: '',
  },
});

const vacacionesAprobadas = ref([]);
const disponibilidadEmpleado = ref(null);
const cargando = ref(true);
const error = ref(null);

const fetchEmployeeData = async (id) => {
  if (!id) {
    error.value = 'ID de empleado no proporcionado.';
    cargando.value = false;
    return;
  }

  cargando.value = true;
  error.value = null;
  try {
    // Fetch vacaciones aprobadas
    const allVacations = await VacacionesService.getByEmpleado(id);
    vacacionesAprobadas.value = allVacations.filter(v => v.estado_solicitud?.estado?.toUpperCase() === 'APROBADO');
    
    // Ordenar por fecha de fin descendente para encontrar la más reciente
    vacacionesAprobadas.value.sort((a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin));

    // Fetch disponibilidad
    disponibilidadEmpleado.value = await VacacionesService.getDisponibilidad(id);

  } catch (err) {
    console.error(`Error al cargar datos del empleado ${id}:`, err);
    error.value = err.message || 'No se pudo cargar la información del empleado.';
  } finally {
    cargando.value = false;
  }
};

// Computada para determinar si una vacación es la más reciente
const isMostRecent = (vacacion) => {
  if (vacacionesAprobadas.value.length === 0) return false;
  // La vacación más reciente será la primera en la lista después de ordenar
  return vacacion.id === vacacionesAprobadas.value[0].id;
};

// Cargar datos cuando el componente se monta o cuando el empleadoId cambia
watch(() => props.empleadoId, (newId) => {
  fetchEmployeeData(newId);
}, { immediate: true }); // `immediate: true` para que se ejecute al montar el componente con el ID inicial
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
</style>