<template>
  <div class="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-600 pb-4 flex items-center">
      <SparklesIcon class="w-8 h-8 mr-3 text-indigo-500" />
      Bienvenido a tu Espacio {{ employeeNameFull }}
    </h1>

    <div v-if="isLoading" class="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <UiSpinner class="h-10 w-10 text-teal-600 animate-spin" />
      <p class="ml-4 text-lg text-gray-700 dark:text-gray-300 mt-4">Cargando tus datos del dashboard...</p>
    </div>

    <div v-else-if="fetchError" class="bg-red-100 dark:bg-red-800 border border-l-4 border-red-400 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg relative shadow-md" role="alert">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-6 w-6 mr-3 flex-shrink-0" />
        <div>
          <strong class="font-bold text-xl block">¡Error al cargar el Dashboard Personal!</strong>
          <span class="block sm:inline mt-1"> {{ fetchError }}</span>
          <p v-if="detailedError" class="text-sm mt-2 opacity-90">{{ detailedError }}</p>
        </div>
      </div>
      <div class="mt-4 text-right">
        <button @click="loadDashboardData" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm">
          Reintentar
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <CalendarDaysIcon class="absolute -top-4 -right-4 w-24 h-24 opacity-20 text-teal-300" />
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <HeartIcon class="w-14 h-14 mr-2" /> Días de Vacaciones Restantes
        </h3>
        <p class="text-5xl font-extrabold mt-3">
          {{ employeeDashboardData.diasVacacionesDisponibles !== null ? employeeDashboardData.diasVacacionesDisponibles : 'N/A' }}
        </p>
        <p class="text-sm opacity-90 mt-2">Días disponibles para tus próximas vacaciones.</p>
        <router-link :to="{ name: 'employee-request-vacation' }" class="mt-4 inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-teal-600 rounded-full text-sm hover:bg-opacity-30 transition-colors">
          <PlusCircleIcon class="w-7 h-7 mr-2" /> Solicitar ahora
        </router-link>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <ClockIcon class="absolute -top-4 -right-4 w-24 h-24 opacity-20 text-blue-300" />
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <ClipboardDocumentCheckIcon class="w-12 h-12 mr-2" /> Última Asistencia
        </h3>
        <p class="text-2xl font-extrabold mt-3">
          {{ employeeDashboardData.ultimaAsistencia ? formatDateTime(employeeDashboardData.ultimaAsistencia.created_at) : 'No se encontró registro' }}
        </p>
        <p class="text-sm opacity-90 mt-2">Fecha y hora de tu último registro.</p>
        <router-link :to="{ name: 'employee-attendance' }" class="mt-4 inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-blue-600 rounded-full text-sm hover:bg-opacity-30 transition-colors">
          <ChartBarIcon class="w-7 h-7 mr-2" /> Ver historial
        </router-link>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <BriefcaseIcon class="absolute -top-4 -right-4 w-24 h-24 opacity-20 text-purple-300" />
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <CalendarIcon class="w-14 h-14 mr-2" /> Antigüedad en la Empresa
        </h3>
        <p class="text-3xl font-extrabold mt-3">
          {{ employeeDashboardData.antiguedad ? employeeDashboardData.antiguedad.antiguedad_formato_humano : 'N/A' }}
        </p>
        <p class="text-sm opacity-90 mt-2">Tu trayectoria desde tu fecha de ingreso.</p>
        <span class="mt-4 inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-indigo-600 rounded-full text-sm">
          <CheckCircleIcon class="w-7 h-7 mr-2" /> Dato actualizado
        </span>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <PaperAirplaneIcon class="absolute -top-4 -right-4 w-24 h-24 opacity-20 text-green-300" />
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <SunIcon class="w-14 h-14 mr-2" /> Próxima Vacación Aprobada
        </h3>
        <div v-if="employeeDashboardData.proximaVacacionAprobada">
          <p class="text-xl font-extrabold mt-3">
            {{ formatDate(employeeDashboardData.proximaVacacionAprobada.fecha_inicio) }} - {{ formatDate(employeeDashboardData.proximaVacacionAprobada.fecha_fin) }}
          </p>
          <p class="text-sm opacity-90 mt-2">Días: {{ employeeDashboardData.proximaVacacionAprobada.dias_solicitados }}</p>
          <p class="text-sm opacity-90">Estado: <span class="font-semibold">{{ employeeDashboardData.proximaVacacionAprobada.estado }}</span></p>
        </div>
        <div v-else>
          <p class="text-xl font-extrabold mt-3">Ninguna programada</p>
          <p class="text-sm opacity-90 mt-2">¡Es un buen momento para solicitar!</p>
        </div>
        <router-link :to="{ name: 'employee-vacations' }" class="mt-4 inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-green-600 rounded-full text-sm hover:bg-opacity-30 transition-colors">
          <EyeIcon class="w-7 h-7 mr-2" /> Ver mis vacaciones
        </router-link>
      </div>
      
      <div class="lg:col-span-3 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <ClockIcon class="w-6 h-6 mr-3 text-orange-500" />
          Tus Solicitudes Pendientes
        </h2>
        <div v-if="employeeDashboardData.solicitudesPendientes.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Tipo</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Fecha de Solicitud</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Fechas/Detalles</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="request in employeeDashboardData.solicitudesPendientes" :key="request.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">{{ request.tipo_solicitud }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ formatDate(request.fecha_solicitud) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  <span v-if="request.tipo_solicitud === 'vacacion'">
                    {{ formatDate(request.fecha_inicio) }} - {{ formatDate(request.fecha_fin) }} ({{ request.dias_solicitados }} días)
                  </span>
                  <span v-else-if="request.tipo_solicitud === 'permiso'">
                    {{ formatDate(request.fecha_permiso) }}
                  </span>
                  <span v-else>N/A</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(request.estado)">
                    {{ request.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-gray-600 dark:text-gray-400 py-4">
          <p>¡No tienes solicitudes pendientes en este momento!</p>
        </div>
      </div>

      <div class="lg:col-span-3 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <MegaphoneIcon class="w-6 h-6 mr-3 text-cyan-500" />
          Anuncios Recientes
        </h3>
        <ul class="space-y-3 text-gray-700 dark:text-gray-300">
          <li>- Recordatorio: Envío de reportes mensuales el día 25.</li>
          <li>- Aviso: Mantenimiento del sistema el sábado 15 de julio.</li>
          <li>- Evento: Charla de bienestar el 20 de julio, sala 3.</li>
        </ul>
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
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import employeeDashboardService from '@/services/employeeDashboardService'; // ¡Importa el nuevo servicio!
import empleadoService from '../../services/empleadoService';
import { useGlobalToast } from '@/composables/useGlobalToast';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiKbd from '@/components/ui/UiKbd.vue';

// Heroicons - Importa los que vayas a usar
import { 
  SparklesIcon, 
  //LeafIcon, 
  CalendarDaysIcon, 
  PlusCircleIcon, 
  ClockIcon, 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  BriefcaseIcon, 
  CheckCircleIcon,
  //PlaneIcon,
  SunIcon,
  EyeIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon, // Para mensajes de error
  HeartIcon,
  PaperAirplaneIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'; // O '/24/solid' para iconos rellenos

const authStore = useAuthStore();
const $toast = useGlobalToast();

// Objeto único para almacenar todos los datos del dashboard del empleado
const employeeDashboardData = ref({
  diasVacacionesDisponibles: null,
  ultimaAsistencia: null,
  antiguedad: null,
  proximaVacacionAprobada: null,
  solicitudesPendientes: [],
});

const employeeNameFull = ref(null);

// UI states
const isLoading = ref(true);
const fetchError = ref(null);
const detailedError = ref(null);

// --- Funciones Auxiliares ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    console.error("Error al formatear fecha:", e);
    return dateString;
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return null;
  try {
    const date = new Date(dateTimeString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleDateString('es-MX', options);
  } catch (e) {
    console.error("Error al formatear fecha/hora:", e);
    return dateTimeString;
  }
};

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'pendiente':
    case 'solicitado': // Añadido 'solicitado' si tu backend usa este estado también para pendientes
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    case 'aprobado': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'rechazado': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'cancelado': return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default: return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};


// --- Lógica de Carga de Datos del Dashboard ---
const loadDashboardData = async () => {
  isLoading.value = true;
  fetchError.value = null;
  detailedError.value = null;

  const empleadoId = authStore.user?.empleado_id; // Asegúrate de que este es el campo correcto

  if (!empleadoId) {
    fetchError.value = 'Acceso Restringido o Perfil Incompleto.';
    detailedError.value = 'Tu usuario no está asociado a un empleado. Por favor, contacta a Recursos Humanos para vincular tu cuenta o verificar tu perfil.';
    $toast?.error('Tu usuario no tiene un ID de empleado asignado. No se pueden cargar los datos del dashboard.', { duration: 8000 });
    isLoading.value = false;
    return;
  }

  try {
    // 1. Días de Vacaciones Disponibles
    try {
      const data = await employeeDashboardService.getDiasVacacionesDisponibles(empleadoId);
      employeeDashboardData.value.diasVacacionesDisponibles = data.dias_disponibles;
    } catch (err) {
      console.error('Error al cargar días de vacaciones disponibles:', err);
      // El servicio ya gestiona el toast, solo actualizamos el estado local
      employeeDashboardData.value.diasVacacionesDisponibles = 'Error';
    }

    // 2. Última Asistencia
    try {
      const data = await employeeDashboardService.getUltimaAsistencia(empleadoId);
      employeeDashboardData.value.ultimaAsistencia = data; // La data ya es el objeto de asistencia o null
    } catch (err) {
      console.error('Error al cargar última asistencia:', err);
      employeeDashboardData.value.ultimaAsistencia = null; // En caso de error, aseguramos que sea null
    }

    // 3. Antigüedad en la Empresa
    try {
      const data = await employeeDashboardService.getAntiguedad(empleadoId);
      employeeDashboardData.value.antiguedad = data; // La data ya es el objeto de antigüedad
    } catch (err) {
      console.error('Error al cargar antigüedad:', err);
      employeeDashboardData.value.antiguedad = null;
    }

    // 4. Próxima Vacación Aprobada
    try {
      const data = await employeeDashboardService.getProximaVacacionAprobada(empleadoId);
      employeeDashboardData.value.proximaVacacionAprobada = data; // La data ya es el objeto de vacación o null
    } catch (err) {
      console.error('Error al cargar próxima vacación aprobada:', err);
      employeeDashboardData.value.proximaVacacionAprobada = null;
    }

    // 5. Solicitudes Pendientes
    try {
      const data = await employeeDashboardService.getSolicitudesPendientes(empleadoId);
      employeeDashboardData.value.solicitudesPendientes = data; // La data ya es un array de solicitudes
      console.log(employeeDashboardData.value);
    } catch (err) {
      console.error('Error al cargar solicitudes pendientes:', err);
      employeeDashboardData.value.solicitudesPendientes = [];
    }

    //6.-obtener nombre compeltod el empelado
    try{
      const data = await empleadoService.getById(empleadoId);
      console.log('data empeadio ById: data0', data);
      employeeNameFull.value = `${data.nombre} ${data.ape_paterno} ${data.ape_materno}`;

    }catch(err){
      console.error('No s epudo obntener losd atos del empleado', err);
    }

  } catch (error) {
    // Este catch general solo se activaría si algo muy inesperado falla, fuera de los try/catch individuales.
    console.error('Error inesperado en el dashboard al iniciar:', error);
    fetchError.value = 'Ocurrió un error inesperado al cargar tu dashboard.';
    detailedError.value = error.message || 'Por favor, recarga la página o contacta a soporte técnico.';
    $toast?.error('Un error grave impidió cargar el dashboard.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
/* Tailwind CSS es suficiente, las clases ya están aplicadas */
</style>