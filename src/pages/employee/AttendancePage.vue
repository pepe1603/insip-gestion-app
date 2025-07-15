<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
      <ClockIcon class="w-6 h-6 mr-3 text-blue-500" />
      Historial de Asistencias
    </h2>
    
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      
      <div class="mb-6 border-b border-gray-200 dark:border-gray-600 pb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-3">
          <CalendarDaysIcon class="w-5 h-5 mr-2 text-blue-400" /> Tu Última Asistencia
        </h3>
        <div v-if="loadingLastAttendance" class="flex items-center text-gray-600 dark:text-gray-400">
          <UiSpinner class="h-5 w-5 text-teal-600 animate-spin mr-2" />
          Cargando última asistencia...
        </div>
        <div v-else-if="lastAttendanceError" class="bg-red-50 dark:bg-red-900 border-red-500 border-l-4 text-red-700 dark:text-red-200 p-3 rounded">
          <p class="font-bold">Error:</p>
          <p>{{ lastAttendanceError }}</p>
        </div>
        <div v-else-if="lastAttendance">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-200">
            <div>
              <p class="font-semibold">Fecha:</p>
              <p>{{ formatDate(lastAttendance.fecha) }}</p>
            </div>
            <div>
              <p class="font-semibold">Entrada:</p>
              <p>{{ formatTime(lastAttendance.hora_entrada) }}</p>
            </div>
            <div>
              <p class="font-semibold">Salida:</p>
              <p>{{ formatTime(lastAttendance.hora_salida) || 'Aún no marcada' }}</p>
            </div>
            <div>
              <p class="font-semibold">Horas Trabajadas:</p>
              <p>{{ calculateHours(lastAttendance.hora_entrada, lastAttendance.hora_salida) }}</p>
            </div>
            <div>
              <p class="font-semibold">Tipo:</p>
              <p>
                <span :class="getAttendanceStatusClass(lastAttendance.tipo_asistencia?.nombre)">
                  {{ lastAttendance.tipo_asistencia?.nombre || 'Desconocido' }}
                </span>
              </p>
            </div>
            <div v-if="lastAttendance.observaciones">
              <p class="font-semibold">Observaciones:</p>
              <p class="text-xs italic">{{ lastAttendance.observaciones }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 dark:text-gray-400 text-sm">
          No hay registros de asistencia recientes.
        </div>
      </div>

      <div class="mb-6 flex flex-wrap gap-4 items-center">
        <label for="month-select" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Filtrar por Mes:</label>
        <select 
          id="month-select" 
          v-model="selectedMonth" 
          @change="loadAttendanceData"
          class="block w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
        >
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>

        <label for="year-select" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Filtrar por Año:</label>
        <select 
          id="year-select" 
          v-model="selectedYear" 
          @change="loadAttendanceData"
          class="block w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
        >
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center p-8">
        <UiSpinner class="h-8 w-8 text-teal-600 animate-spin" />
        <p class="ml-3 text-gray-600 dark:text-gray-300 mt-4">Cargando historial de asistencias...</p>
      </div>

      <div v-else-if="fetchError" class="bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative shadow-md" role="alert">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="h-6 w-6 mr-3 flex-shrink-0" />
          <div>
            <strong class="font-bold mr-2">¡Error al cargar el historial!</strong>
            <span class="block sm:inline"> {{ fetchError }}</span>
            <p v-if="detailedError" class="text-sm mt-2 opacity-90">{{ detailedError }}</p>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button @click="loadAttendanceData" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm">
            Reintentar
          </button>
        </div>
      </div>

      <UiTableStriped
        v-else
        :headers="tableHeaders"
        :data="filteredAttendanceRecords"
        :caption-title="`Historial de Asistencias (${currentMonthYear})`"
        caption-description="Revisa tus registros de entrada y salida para el mes y año seleccionados."
        :show-filter="true"
        filter-placeholder="Buscar por fecha, hora o tipo de asistencia..."
        :sortable-headers="true"
        :cargando="false"  
        :error="null"      
      >
        <template #fecha="{ item }">
          {{ formatDate(item.fecha) }}
        </template>
        <template #hora_entrada="{ item }">
          {{ formatTime(item.hora_entrada) }}
        </template>
        <template #hora_salida="{ item }">
          {{ formatTime(item.hora_salida) || 'N/A' }}
        </template>
        <template #horas="{ item }">
          {{ calculateHours(item.hora_entrada, item.hora_salida) }}
        </template>
        <template #tipo_asistencia_nombre="{ item }">
          <span :class="getAttendanceStatusClass(item.tipo_asistencia?.nombre)">
            {{ item.tipo_asistencia?.nombre || 'N/A' }}
          </span>
        </template>
      </UiTableStriped>

      <div v-if="!isLoading && !fetchError && filteredAttendanceRecords.length > 0" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Total de registros encontrados para {{ currentMonthYear }}: {{ filteredAttendanceRecords.length }}</p>
      </div>
       <div v-else-if="!isLoading && !fetchError && filteredAttendanceRecords.length === 0" class="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        <p>No se encontraron registros de asistencia para el mes de {{ currentMonthYear }}.</p>
      </div>
    </div>
    <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded-md shadow-sm">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <PuzzlePieceIcon class="h-6 w-6 text-yellow-700 dark:text-yellow-300" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            ¿Necesitas ayuda o no puedes ver tus datos? Aquí te explicamos qué hacer:
          </p>
          <ul class="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>
              **Si tus datos no cargan:** Haz clic en el botón <UiKbd><ArrowPathIcon class="size-4 text-gray-600"/></UiKbd> ** que aparece arriba en el navegador. A veces, un pequeño problema de conexión se resuelve con un reintento.
            </li>
            <li>
              **Si el error persiste o no ves tu información:** Es posible que necesites **cerrar sesión y volver a iniciarla**. Esto refrescará tu información de usuario.
            </li>
            <li>
              **Si el problema continúa:** Por favor, contacta directamente al equipo de **Recursos Humanos**. Proporciona una captura de pantalla del error si es posible.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import asistenciasService from '@/services/asistenciaService';
import employeeDashboardService from '@/services/employeeDashboardService'; // Importar el nuevo servicio
import { useGlobalToast } from '@/composables/useGlobalToast';

// Componentes UI
import UiTableStriped from '@/components/ui/tables/UiTableStriped.vue';
import UiKbd from '@/components/ui/UiKbd.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue'; // Asegúrate de que este componente exista

// Heroicons
import { ClockIcon, CalendarDaysIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'; // Añadimos CalendarDaysIcon

const authStore = useAuthStore();
const $toast = useGlobalToast();

// Estado para la tabla de historial
const rawAttendanceRecords = ref([]);
const isLoading = ref(true); // Para la carga de la tabla principal
const fetchError = ref(null);
const detailedError = ref(null);

// Estado para la última asistencia
const lastAttendance = ref(null);
const loadingLastAttendance = ref(true); // Para la carga de la última asistencia
const lastAttendanceError = ref(null);

// Filtros de fecha para la tabla de historial
const today = new Date();
const selectedMonth = ref(today.getMonth() + 1); // Mes actual (1-12)
const selectedYear = ref(today.getFullYear()); // Año actual

// Generar lista de años para el selector (ej. últimos 5 años y próximo año)
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearsArray = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    yearsArray.push(i);
  }
  return yearsArray.sort((a, b) => b - a);
});

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const currentMonthYear = computed(() => {
  const monthName = months[selectedMonth.value - 1];
  return `${monthName} ${selectedYear.value}`;
});

// Headers para UiTableStriped
const tableHeaders = ref([
  { label: 'Fecha', key: 'fecha' },
  { label: 'Entrada', key: 'hora_entrada' },
  { label: 'Salida', key: 'hora_salida' },
  { label: 'Horas', key: 'horas' },
  { label: 'Tipo', key: 'tipo_asistencia_nombre' },
]);

// Computed para filtrar los registros por mes y año seleccionados para la tabla
const filteredAttendanceRecords = computed(() => {
  return rawAttendanceRecords.value.filter(record => {
    const recordDate = new Date(record.fecha);
    return recordDate.getMonth() + 1 === selectedMonth.value &&
           recordDate.getFullYear() === selectedYear.value;
  }).sort((a, b) => { // Ordenar por fecha, más reciente primero
    return new Date(b.fecha) - new Date(a.fecha);
  });
});

// --- Funciones Auxiliares ---

// Formatea una fecha a "DD/MM/YYYY"
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    console.error("Error al formatear fecha:", e);
    return dateString;
  }
};

// Formatea una hora a "HH:MM AM/PM"
const formatTime = (timeString) => {
  if (!timeString) return null;
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    console.error("Error al formatear hora:", e);
    return timeString;
  }
};

// Calcula las horas trabajadas
const calculateHours = (timeIn, timeOut) => {
  if (!timeIn || !timeOut) return 'N/A';
  try {
    const [hIn, mIn] = timeIn.split(':').map(Number);
    const [hOut, mOut] = timeOut.split(':').map(Number);

    const dateIn = new Date();
    dateIn.setHours(hIn, mIn, 0, 0);

    const dateOut = new Date();
    dateOut.setHours(hOut, mOut, 0, 0);

    let diffMs = dateOut - dateIn;

    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000;
    }

    const diffHours = diffMs / (1000 * 60 * 60);
    
    const hours = Math.floor(diffHours);
    const minutes = Math.round((diffHours - hours) * 60);

    return `${hours}h ${minutes}m`;
  } catch (e) {
    console.error("Error al calcular horas:", e);
    return 'N/A';
  }
};

// Clases para el estado de asistencia
const getAttendanceStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'presente': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'ausente': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'tardía':
    case 'tardia': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    case 'permiso': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'vacación':
    case 'vacacion': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100';
    default: return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// --- Lógica de Carga de Datos ---

// Función para cargar la última asistencia
const loadLastAttendance = async () => {
  loadingLastAttendance.value = true;
  lastAttendanceError.value = null;
  const empleadoId = authStore.user?.empleado_id;
  const userName = authStore.user?.name || 'Usuario'; // Para mensajes más amigables

  if (!empleadoId) {
    lastAttendanceError.value = 'No se pudo obtener el ID del empleado para la última asistencia.';
    $toast.error(`Error: ID de empleado no disponible para ${userName}.`, { duration: 8000 });
    $toast?.error('ID de empleado no disponible para la última asistencia.', { duration: 5000 });
    loadingLastAttendance.value = false;
    return;
  }

  try {
    const data = await employeeDashboardService.getUltimaAsistencia(empleadoId);
    lastAttendance.value = data; // Puede ser null si no hay asistencia
  } catch (error) {
    console.error('Error al cargar la última asistencia:', error);
    lastAttendanceError.value = error.message || 'Error desconocido al cargar la última asistencia.';
    $toast.error(`Error: ID de empleado no disponible para ${userName}.`, { duration: 8000 });
  } finally {
    loadingLastAttendance.value = false;
  }
};

// Función para cargar el historial de asistencias (para la tabla)
const loadAttendanceData = async () => {
  isLoading.value = true;
  fetchError.value = null;
  detailedError.value = null;
  rawAttendanceRecords.value = [];

  const empleadoId = authStore.user?.empleado_id;

  if (!empleadoId) {
    fetchError.value = 'No se pudo obtener el ID del empleado.';
    detailedError.value = 'Asegúrate de haber iniciado sesión correctamente y de que tu perfil tenga un ID de empleado asignado.';
    $toast?.error('Tu usuario no tiene un ID de empleado asignado. No se puede cargar el historial de asistencias.', { duration: 8000 });
    isLoading.value = false;
    return;
  }

  try {
    const response = await asistenciasService.attendanceByEmployee(empleadoId);
    rawAttendanceRecords.value = response.data.data;
  } catch (error) {
    console.error('Error al cargar el historial de asistencias:', error);
    fetchError.value = 'Ocurrió un error al cargar tu historial de asistencias.';
    detailedError.value = error.message || 'Por favor, intenta recargar la página.';
    $toast?.error('Error al cargar el historial de asistencias.', { duration: 5000 });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadLastAttendance(); // Cargar la última asistencia al montar
  loadAttendanceData(); // Cargar el historial de asistencias al montar
});
</script>

<style scoped>
/* Tus estilos existentes o Tailwind */
</style>