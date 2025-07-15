<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
      <CalendarDaysIcon class="w-6 h-6 mr-3 text-blue-500" />
      Mis Vacaciones
    </h2>
    
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen de Días de Vacaciones</h3>
      
      <div v-if="loadingVacationSummary" class="flex flex-col items-center justify-center p-4">
        <UiSpinner class="h-6 w-6 text-teal-600 animate-spin" />
        <p class="ml-3 text-gray-600 dark:text-gray-300 mt-2">Cargando resumen de vacaciones...</p>
      </div>
      <div v-else-if="vacationSummaryError" class="bg-red-100 dark:bg-red-800 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="h-5 w-5 mr-3 flex-shrink-0" />
          <div>
            <p class="font-bold">Error al cargar el resumen:</p>
            <p class="text-sm">{{ vacationSummaryError }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col sm:flex-row items-center justify-around p-4 bg-blue-50 dark:bg-blue-800 rounded-md shadow">
          <div class="text-center sm:text-left mb-4 sm:mb-0">
            <p class="text-sm text-blue-700 dark:text-blue-300">Días Disponibles:</p>
            <p class="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
              {{ vacationSummary.dias_disponibles }}
            </p>
          </div>
          <div class="text-center sm:text-right">
            <p class="text-sm text-blue-700 dark:text-blue-300">Días Tomados (año actual):</p>
            <p class="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
              {{ totalDaysUsedThisYear }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <router-link :to="{ name: 'employee-request-vacation' }">
          <UiButton variant="primary">Solicitar Nuevas Vacaciones</UiButton>
        </router-link>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          Mis Solicitudes de Vacaciones
          <UiBadge v-if="vacationRequests.length > 0 && !loadingVacationRequests" 
                   :text="vacationRequests.length.toString()" 
                   color="blue" 
                   size="sm" 
                   class="ml-2" />
        </h3>
      </div>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Aquí puedes ver el historial de todas tus solicitudes de vacaciones. Revisa su estado actual y planifica tus próximos descansos.
      </p>

      <div v-if="loadingVacationRequests" class="flex flex-col items-center justify-center p-4">
        <UiSpinner class="h-6 w-6 text-teal-600 animate-spin" />
        <p class="ml-3 text-gray-600 dark:text-gray-300 mt-2">Cargando solicitudes de vacaciones...</p>
      </div>
      <div v-else-if="vacationRequestsError" class="bg-red-100 dark:bg-red-800 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="h-5 w-5 mr-3 flex-shrink-0" />
          <div>
            <p class="font-bold">Error al cargar solicitudes:</p>
            <p class="text-sm">{{ vacationRequestsError }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="vacationRequests.length > 0">
        <ul class="divide-y divide-gray-200 dark:divide-gray-600">
          <li v-for="request in displayedVacationRequests" :key="request.id" class="py-3 flex flex-col sm:flex-row justify-between sm:items-center text-gray-700 dark:text-gray-300">
            <div class="mb-2 sm:mb-0">
              <span class="font-medium">
                {{ request.fecha_inicio ? formatDate(request.fecha_inicio) : 'N/A' }} 
              </span>
              - 
              <span class="font-medium">
                {{ request.fecha_fin ? formatDate(request.fecha_fin) : 'N/A' }}
              </span>
              <span class="block text-sm text-gray-500 dark:text-gray-400">
                ({{ request.dias_vacaciones_solicitados || 0 }} días)
              </span>
            </div>
            <UiBadge :text="formatStatus(request.estado_solicitud?.estado)" 
                     :color="getBadgeColor(request.estado_solicitud?.estado)" 
                     size="sm" />
          </li>
        </ul>
        
        <div v-if="vacationRequests.length > initialDisplayLimit" class="mt-4 text-center">
          <UiButton 
            variant="secondary" 
            @click="toggleShowAllRequests"
            class="w-full sm:w-auto"
          >
            {{ showAllRequests ? 'Ver Menos Solicitudes' : `Ver Todas las Solicitudes (${vacationRequests.length})` }}
          </UiButton>
        </div>
      </div>
      <div v-else class="text-gray-500 dark:text-gray-400 text-center p-4">
        No tienes solicitudes de vacaciones registradas.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalToast } from '@/composables/useGlobalToast';
import employeeDashboardService from '@/services/employeeDashboardService';
import vacacionesService from '@/services/vacacionesService';

// Componentes UI
import UiButton from '@/components/ui/UiButton.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiBadge from '@/components/ui/UiBadge.vue'; // Importar el componente UiBadge

// Heroicons
import { CalendarDaysIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const $toast = useGlobalToast();

// --- Estados para el Resumen de Vacaciones ---
const vacationSummary = ref({ dias_disponibles: 0 }); 
const loadingVacationSummary = ref(true);
const vacationSummaryError = ref(null);

// --- Estados para las Solicitudes de Vacaciones ---
const vacationRequests = ref([]); 
const loadingVacationRequests = ref(true);
const vacationRequestsError = ref(null);

// --- Estado para controlar la visualización de solicitudes ---
const showAllRequests = ref(false);
const initialDisplayLimit = 5; // Número de solicitudes a mostrar inicialmente

// --- Funciones de Carga de Datos ---

const loadVacationSummary = async () => {
  loadingVacationSummary.value = true;
  vacationSummaryError.value = null;
  const empleadoId = authStore.user?.empleado_id;

  if (!empleadoId) {
    vacationSummaryError.value = 'No se pudo obtener el ID del empleado.';
    $toast?.error('ID de empleado no disponible para el resumen de vacaciones.', { duration: 5000 });
    loadingVacationSummary.value = false;
    return;
  }

  try {
    const data = await employeeDashboardService.getDiasVacacionesDisponibles(empleadoId);
    vacationSummary.value.dias_disponibles = data.dias_disponibles || 0;
  } catch (error) {
    console.error('Error al cargar los días de vacaciones disponibles:', error);
    vacationSummaryError.value = error.message || 'Error desconocido al cargar los días disponibles.';
    $toast?.error('Error al cargar los días disponibles de vacaciones.', { duration: 5000 });
  } finally {
    loadingVacationSummary.value = false;
  }
};

const loadVacationRequests = async () => {
  loadingVacationRequests.value = true;
  vacationRequestsError.value = null;
  const empleadoId = authStore.user?.empleado_id;

  if (!empleadoId) {
    vacationRequestsError.value = 'No se pudo obtener el ID del empleado para las solicitudes.';
    $toast?.error('ID de empleado no disponible para las solicitudes de vacaciones.', { duration: 5000 });
    loadingVacationRequests.value = false;
    return;
  }

  try {
    const data = await vacacionesService.getByEmpleado(empleadoId);
    vacationRequests.value = data
      .filter(request => request.fecha_inicio || request.fecha_solicitud) // Solo solicitudes con alguna fecha relevante
      .sort((a, b) => {
        // Ordena por la fecha más reciente (created_at es un buen candidato para orden de creación)
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
  } catch (error) {
    console.error('Error al cargar las solicitudes de vacaciones:', error);
    vacationRequestsError.value = error.message || 'Error desconocido al cargar las solicitudes de vacaciones.';
    $toast?.error('Error al cargar las solicitudes de vacaciones.', { duration: 5000 });
  } finally {
    loadingVacationRequests.value = false;
  }
};

// --- Propiedades Computadas y Funciones de Utilidad ---

const totalDaysUsedThisYear = computed(() => {
  const currentYear = new Date().getFullYear();
  let totalUsed = 0;
  vacationRequests.value.forEach(request => {
    // Usamos fecha_inicio o fecha_solicitud para determinar el año de la solicitud
    const requestDate = request.fecha_inicio || request.fecha_solicitud;
    if (requestDate) {
      const requestYear = new Date(requestDate).getFullYear();
      if (request.estado_solicitud?.estado === 'APROBADO' && requestYear === currentYear) {
        totalUsed += parseInt(request.dias_vacaciones_disfrutados || 0); 
      }
    }
  });
  return totalUsed;
});

const displayedVacationRequests = computed(() => {
  return showAllRequests.value ? vacationRequests.value : vacationRequests.value.slice(0, initialDisplayLimit);
});

const toggleShowAllRequests = () => {
  showAllRequests.value = !showAllRequests.value;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    console.error("Error al formatear fecha:", e);
    return dateString;
  }
};

const formatStatus = (status) => {
  switch (status) {
    case 'PENDIENTE': return 'Pendiente';
    case 'APROBADO': return 'Aprobada'; 
    case 'RECHAZADO': return 'Rechazada';
    case 'CANCELADO': return 'Cancelada';
    case 'ASIGNADO': return 'Histórico'; 
    default: return status || 'Desconocido';
  }
};

const getBadgeColor = (status) => {
  switch (status) {
    case 'APROBADO': return 'green';
    case 'PENDIENTE': return 'yellow';
    case 'RECHAZADO': return 'red';
    case 'CANCELADO': return 'gray';
    case 'ASIGNADO': return 'blue'; 
    default: return 'gray';
  }
};

// --- Carga Inicial ---
onMounted(() => {
  loadVacationSummary();
  loadVacationRequests();
});
</script>

<style scoped>
/* No se necesitan estilos específicos de `style` aquí si todo es Tailwind */
</style>