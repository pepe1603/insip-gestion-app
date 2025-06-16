<template>
  <div class="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
    <h2 class="text-lg font-semibold mb-3 text-gray-800">Buscar Solicitudes Aprobadas por Empleado</h2>
    <div class="max-w-md flex items-center gap-2 mb-4">
      <UiInputSearchwithResult
        v-model="searchTermEmpleado"
        :searchServiceMethod="searchEmpleadosAprobados"
        :formatResult="formatEmpleadoResult"
        result-key="empleado_id"
        placeholder="Buscar por nombre de empleado..."
        @selected="handleEmpleadoSelected"
      >
        <template #icon>
          <MagnifyingGlassIcon class="w-5 h-5" />
        </template>
      </UiInputSearchwithResult>
      <UiButton
        v-if="selectedEmpleadoForSearch"
        size="xs"
        variant="outline-secondary"
        @click="clearEmpleadoSearch"
      >
        Limpiar Búsqueda
      </UiButton>
    </div>

    <div v-if="selectedEmpleadoForSearch && !loadingEmpleadoSearch" class="mt-4">
      <h3 class="text-md font-semibold mb-2 text-gray-700">Solicitudes Aprobadas para {{ formatEmpleadoResult(selectedEmpleadoForSearch) }}</h3>

      <div v-if="vacationAvailability !== null" class="mb-4 p-3 border rounded-md bg-blue-50 text-blue-800 shadow-sm">
        <p class="font-semibold">Disponibilidad de Vacaciones:</p>
        <p>Días Totales: <span class="font-bold">{{ vacationAvailability.total_asignado }}</span></p>
        <p>Días Disfrutados: <span class="font-bold">{{ vacationAvailability.usado }}</span></p>
        <p>Días Disponibles Restantes: <span class="font-bold">{{ vacationAvailability.disponible }}</span></p>
      </div>
      <div v-else-if="loadingAvailability" class="text-blue-500 text-center py-2">Cargando disponibilidad...</div>
      <div v-else-if="errorAvailability" class="text-red-500 text-center py-2">Error al cargar disponibilidad: {{ errorAvailability }}</div>
      <div v-if="employeeApprovedRequests.length > 0">
        <UiDescriptionList
          v-for="request in employeeApprovedRequests"
          :key="request.Id"
          :title="`Solicitud #${request.Id}`"
          :description="`Periodo: ${request.FechaInicio} - ${request.FechaFin}`"
          :items="formatRequestForDescriptionList(request)"
          class="mb-4 p-3 border rounded-md bg-white shadow-sm"
        />
      </div>
      <div v-else class="text-gray-500 text-center py-4">
        No se encontraron solicitudes aprobadas para este empleado.
      </div>
    </div>
    <div v-if="loadingEmpleadoSearch" class="text-center text-blue-500 py-4">Cargando solicitudes del empleado...</div>
    <div v-if="errorEmpleadoSearch" class="text-red-500 text-center py-4">Error al cargar solicitudes del empleado: {{ errorEmpleadoSearch }}</div>
    <p class="mt-2 text-sm text-gray-500">
      Esta sección permite buscar y visualizar las solicitudes de vacaciones **aprobadas** de un empleado específico en formato de lista de descripción.
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import UiInputSearchwithResult from '../../../components/ui/UiInputSearchWithResults.vue';
import UiButton from '../../../components/ui/UiButton.vue';
import UiDescriptionList from '../../../components/ui/UiDescriptionList.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { formatDate } from '../../../utils/dateFormatter';
// Importamos el servicio aquí, ya que se pasa como prop y lo vamos a usar.
import VacacionesService from '../../../services/vacacionesService';

const props = defineProps({
  // Prop para recibir todas las solicitudes de vacaciones desde el padre (para la búsqueda inicial)
  allVacationRequests: {
    type: Array,
    default: () => []
  },
  // NUEVA PROP: el servicio de vacaciones
  vacacionesService: {
    type: Object, // Debería ser una instancia del servicio
    required: true
  }
});

const searchTermEmpleado = ref('');
const selectedEmpleadoForSearch = ref(null);
const employeeApprovedRequests = ref([]);
const loadingEmpleadoSearch = ref(false);
const errorEmpleadoSearch = ref(null);

// NUEVAS REF para disponibilidad
const vacationAvailability = ref(null);
const loadingAvailability = ref(false);
const errorAvailability = ref(null);


// Watch para cuando cambie el empleado seleccionado O la lista de solicitudes
watch([selectedEmpleadoForSearch, () => props.allVacationRequests], ([newSelectedEmpleado, newAllVacationRequests]) => {
  console.log('WATCH disparado en EmployeeApprovedRequestsSearch.vue');
  console.log('  newSelectedEmpleado:', newSelectedEmpleado);
  console.log('  newAllVacationRequests count:', newAllVacationRequests.length);

  if (newSelectedEmpleado && newAllVacationRequests.length > 0) {
    console.log('  Cargando solicitudes y disponibilidad para el empleado seleccionado...');
    loadEmployeeApprovedRequests(newSelectedEmpleado);
    loadEmployeeVacationAvailability(newSelectedEmpleado.empleado_id); // Cargar disponibilidad
  } else if (!newSelectedEmpleado) {
    console.log('  No hay empleado seleccionado o se ha limpiado la búsqueda. Limpiando resultados.');
    employeeApprovedRequests.value = [];
    vacationAvailability.value = null; // Limpiar también la disponibilidad
  } else if (newSelectedEmpleado && newAllVacationRequests.length === 0) {
    console.log('  Empleado seleccionado, pero allVacationRequests aún no ha cargado. Esperando...');
  }
}, { immediate: true, deep: true });

// Función auxiliar para cargar las solicitudes aprobadas del empleado
const loadEmployeeApprovedRequests = async (empleado) => {
  if (!empleado || !props.allVacationRequests) {
    console.log('loadEmployeeApprovedRequests: Datos incompletos, regresando.');
    return;
  }

  loadingEmpleadoSearch.value = true;
  errorEmpleadoSearch.value = null;
  employeeApprovedRequests.value = [];

  // Convertir empleado.empleado_id a string para la comparación
  const selectedEmpleadoId = String(empleado.empleado_id);

  console.log(`loadEmployeeApprovedRequests: Buscando solicitudes para empleado_id: ${selectedEmpleadoId}`);
  console.log('  Total allVacationRequests para filtrar:', props.allVacationRequests.length);

  try {
    const requests = props.allVacationRequests.filter(
      v => String(v.empleado_id) === selectedEmpleadoId && v.estado_solicitud?.estado?.toUpperCase() === 'APROBADO'
    );
    employeeApprovedRequests.value = formatVacacionesForDisplay(requests);
    console.log('  Solicitudes aprobadas encontradas para este empleado:', requests.length);
  } catch (err) {
    errorEmpleadoSearch.value = err.message || 'Error al obtener solicitudes del empleado.';
    console.error('Error al obtener solicitudes del empleado:', err);
  } finally {
    loadingEmpleadoSearch.value = false;
  }
};

// NUEVA FUNCIÓN: Cargar la disponibilidad de vacaciones del empleado
const loadEmployeeVacationAvailability = async (empleadoId) => {
  loadingAvailability.value = true;
  errorAvailability.value = null;
  vacationAvailability.value = null; // Limpiar disponibilidad anterior

  try {
    // Asegurarse de que empleadoId es un número para la API si la API lo espera así
    const availabilityData = await props.vacacionesService.getDisponibilidad(Number(empleadoId));
    vacationAvailability.value = availabilityData;
    console.log('Disponibilidad de vacaciones cargada:', availabilityData);
  } catch (err) {
    errorAvailability.value = err.message || 'Error al cargar la disponibilidad de vacaciones.';
    console.error('Error al cargar disponibilidad de vacaciones:', err);
  } finally {
    loadingAvailability.value = false;
  }
};


const searchEmpleadosAprobados = async (query) => {
  console.log('searchEmpleadosAprobados llamado con query:', query);
  if (!query || query.length < 2) return [];

  const aprobadas = props.allVacationRequests.filter(v => v.estado_solicitud?.estado?.toUpperCase() === 'APROBADO');
  console.log('  Total de solicitudes APROBADAS para buscar:', aprobadas.length);

  const uniqueEmpleados = new Map();
  aprobadas.forEach(v => {
    const empleado = v.empleado;
    if (empleado) {
      const fullName = `${empleado.nombre || ''} ${empleado.ape_paterno || ''} ${empleado.ape_materno || ''}`.trim();
      if (fullName.toLowerCase().includes(query.toLowerCase())) {
        if (!uniqueEmpleados.has(empleado.id)) {
          uniqueEmpleados.set(empleado.id, {
            empleado_id: String(empleado.id), // Asegura que se almacene como STRING
            nombre: empleado.nombre,
            ape_paterno: empleado.ape_paterno,
            ape_materno: empleado.ape_materno,
          });
        }
      }
    }
  });
  const results = Array.from(uniqueEmpleados.values());
  console.log('  Resultados de búsqueda de empleados:', results);
  return results;
};

const formatEmpleadoResult = (item) => {
  return `${item.nombre || ''} ${item.ape_paterno || ''} ${item.ape_materno || ''}`.trim();
};

const handleEmpleadoSelected = (empleado) => {
  console.log('handleEmpleadoSelected: Empleado seleccionado:', empleado);
  selectedEmpleadoForSearch.value = empleado;
  // La lógica de carga ahora se maneja en el `watch` combinado, así que no se llama directamente aquí.
};

const clearEmpleadoSearch = () => {
  console.log('clearEmpleadoSearch: Limpiando búsqueda.');
  searchTermEmpleado.value = '';
  selectedEmpleadoForSearch.value = null;
  employeeApprovedRequests.value = [];
  vacationAvailability.value = null; // Limpiar disponibilidad al limpiar búsqueda
  errorEmpleadoSearch.value = null;
  errorAvailability.value = null;
};

const formatVacacionesForDisplay = (data) => {
  return data.map(v => ({
    Id: v.id,
    Empleado: `${v.empleado?.nombre || ''} ${v.empleado?.ape_paterno || ''} ${v.empleado?.ape_materno || ''}`.trim(),
    FechaSolicitud: formatDate(v.fecha_solicitud || v.created_at),
    FechaInicio: formatDate(v.fecha_inicio),
    FechaFin: formatDate(v.fecha_fin),
    DiasSolicitados: v.dias_vacaciones_solicitados,
    Estado: v.estado_solicitud?.estado || 'Desconocido',
    originalItem: v, // Keep the full original object for details if needed
  }));
};

const formatRequestForDescriptionList = (request) => {
  if (!request) return [];
  const original = request.originalItem;
  return [
    { label: 'ID Solicitud', value: request.Id },
    { label: 'Empleado', value: request.Empleado },
    { label: 'Fecha de Solicitud', value: formatDate(original?.fecha_solicitud || original?.created_at) },
    { label: 'Fecha Inicio', value: request.FechaInicio },
    { label: 'Fecha Fin', value: request.FechaFin },
    { label: 'Días Solicitados', value: original?.dias_vacaciones_solicitados || request.DiasSolicitados },
    { label: 'Estado Actual', value: original?.estado_solicitud?.estado || request.Estado },
    ...(original?.motivo_solicitud ? [{ label: 'Motivo de Solicitud', value: original.motivo_solicitud }] : []),
    ...(original?.observaciones_empleado ? [{ label: 'Observaciones Empleado', value: original.observaciones_empleado }] : []),
    ...(original?.observaciones_administrador ? [{ label: 'Observaciones Administrador', value: original.observaciones_administrador }] : []),
    ...(original?.fecha_aprobacion ? [{ label: 'Fecha de Gestión', value: formatDate(original.fecha_aprobacion) }] : []),
    ...(original?.administrador_que_aprobo ? [{ label: 'Gestionado por', value: `${original.administrador_que_aprobo.nombre || ''} ${original.administrador_que_aprobo.ape_paterno || ''}`.trim() }] : []),
  ];
};
</script>