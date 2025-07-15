<template>
  <div class="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b pb-4">
      Dashboard de Análisis Administrativo
    </h1>

    <div v-if="isLoading" class="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <UiSpinner class="h-12 w-12 text-indigo-500 mb-4" />
      <p class="ml-4 text-xl font-medium text-gray-700 dark:text-gray-300">Cargando datos del dashboard...</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Esto puede tomar unos segundos mientras se recopila la información más reciente.</p>
    </div>

    <div v-else-if="fetchError" class="bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg shadow-md" role="alert">
      <strong class="font-bold text-xl">¡Error al cargar el Dashboard!</strong>
      <p class="block sm:inline mt-2">{{ fetchError }}</p>
      <p v-if="detailedError" class="text-sm mt-3 opacity-90">Detalles: {{ detailedError }}</p>
      <div class="mt-4">
        <button @click="loadDashboardData" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Reintentar Carga
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-8">

      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Empleados</p>
            <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{{ employeeStatus.total }}</p>
          </div>
          <UsersIcon class="h-10 w-10 text-indigo-500" />
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Empleados Activos</p>
            <p class="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">{{ employeeStatus.activo }}</p>
          </div>
          <UserGroupIcon class="h-10 w-10 text-green-500" />
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Asistencias Hoy</p>
            <p class="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-400">{{ asistenciasHoy.length }}</p>
          </div>
          <ClockIcon class="h-10 w-10 text-blue-500" />
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Vacaciones Pendientes</p>
            <p class="mt-1 text-3xl font-semibold text-yellow-600 dark:text-yellow-400">{{ vacacionesStatus.Pendiente || 0 }}</p>
          </div>
          <CalendarIcon class="h-10 w-10 text-yellow-500" />
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <UserPlusIcon class="w-6 h-6 mr-3 text-purple-600" />
            Empleados Recién Ingresados (Últimos {{ daysForRecent }} días)
          </h2>
          <div v-if="recentlyHiredEmployees.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Puesto
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Fecha Ingreso
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="employee in recentlyHiredEmployees" :key="employee.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ employee.nombre }} {{ employee.ape_paterno }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ employee.puesto }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatDate(employee.fecha_ingreso) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center text-gray-600 dark:text-gray-400 py-4">
            <p>No hay empleados recién ingresados en los últimos {{ daysForRecent }} días.</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <ChartPieIcon class="w-6 h-6 mr-3 text-cyan-600" />
            Usuarios por Rol
          </h2>
          <div class="h-64">
            <UiChart
              v-if="!isLoading && usersCountByRoleData.datasets[0].data.length > 0"
              :chart-data="usersCountByRoleData"
              :chart-options="pieChartOptions"
              chart-type="pie"
            />
            <div v-else class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
              No hay datos para el gráfico de usuarios por rol.
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <ClockIcon class="w-6 h-6 mr-3 text-orange-600" />
            Últimas Asistencias Registradas
          </h2>
          <div v-if="latestAsistencias.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="asistencia in latestAsistencias" :key="asistencia.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ asistencia.empleado }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ asistencia.tipo_asistencia }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatDateTime(asistencia.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center text-gray-600 dark:text-gray-400 py-4">
            <p>No hay asistencias recientes para mostrar.</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <CalendarDaysIcon class="w-6 h-6 mr-3 text-fuchsia-600" />
            Próximas Vacaciones Aprobadas
          </h2>
          <div v-if="proximasVacaciones.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Inicio
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Fin
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Dias solicitados
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="vacacion in proximasVacaciones" :key="vacacion.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ vacacion.empleado ? vacacion.empleado : 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatDate(vacacion.fecha_inicio) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatDate(vacacion.fecha_fin) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {{ vacacion.dias_solicitados }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center text-gray-600 dark:text-gray-400 py-4">
            <p>No hay próximas vacaciones aprobadas.</p>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <CalendarDaysIcon class="w-6 h-6 mr-3 text-teal-600" />
            Días de Vacaciones por Mes ({{ currentYear }})
          </h2>
          <div class="h-64">
            <UiChart
              v-if="!isLoading && diasVacacionesPorMesData.datasets[0] && diasVacacionesPorMesData.datasets[0].data.length > 0"
              :chart-data="diasVacacionesPorMesData"
              :chart-options="barChartOptions"
              chart-type="bar"
            />
            <div v-else class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
              No hay datos para el gráfico de días de vacaciones por mes.
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <ChartPieIcon class="w-6 h-6 mr-3 text-amber-600" />
            Estado de Solicitudes de Vacaciones
          </h2>
          <div class="h-64">
            <UiChart
              v-if="!isLoading && vacacionesStatusData.datasets[0].data.length > 0"
              :chart-data="vacacionesStatusData"
              :chart-options="pieChartOptions"
              chart-type="bar"
            />
            <div v-else class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
              No hay datos para el gráfico de estado de solicitudes de vacaciones.
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <UserIcon class="w-6 h-6 mr-3 text-blue-600" />
            Estadísticas de Usuarios
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</p>
              <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ totalUsersCount }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios Activos</p>
              <p class="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{{ activeInactiveUsers.active_users }}</p>
            </div>
            <div class="col-span-2 text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios Inactivos</p>
              <p class="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{{ activeInactiveUsers.inactive_users }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <UserIcon class="w-6 h-6 mr-3 text-emerald-600" />
            Usuarios Recién Registrados (Últimos {{ daysForRecent }} días)
          </h2>
          <div v-if="recentlyRegisteredUsers.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Nombre de Usuario
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in recentlyRegisteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ user.role }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatDate(user.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center text-gray-600 dark:text-gray-400 py-4">
            <p>No hay usuarios recién registrados en los últimos {{ daysForRecent }} días.</p>
          </div>
        </div>
      </section>

      <section class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <BriefcaseIcon class="w-6 h-6 mr-3 text-emerald-600" /> Empleados con Mayor Antigüedad
        </h2>
        <div v-if="topEmpleadosAntiguos.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Antigüedad
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Próximo Aniversario
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="employee in topEmpleadosAntiguos" :key="employee.fecha_ingreso" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ employee.empleado }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ formatDate(employee.fecha_ingreso) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ calculateAntiquity(employee.fecha_ingreso) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ getNextAnniversary(employee.fecha_ingreso) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-gray-600 dark:text-gray-400 py-4">
          <p>No se encontraron empleados con mayor antigüedad.</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // Importar 'computed'
import adminDashboardService from '@/services/adminDashboardService';
import { useGlobalToast } from '@/composables/useGlobalToast';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiChart from '@/components/ui/UiChart.vue'; // Importar el nuevo componente de gráfico

// Importa los iconos específicos de Heroicons
import {
  UsersIcon, UserGroupIcon, UserPlusIcon, ClockIcon, CalendarIcon,
  CalendarDaysIcon, ChartPieIcon, UserIcon,BriefcaseIcon
} from '@heroicons/vue/24/outline';

// Data reactive states
const employeeStatus = ref({ activo: 0, inactivo: 0, total: 0 });
const recentlyHiredEmployees = ref([]);
const asistenciasHoy = ref([]);
const latestAsistencias = ref([]);
const vacacionesStatus = ref({});
const proximasVacaciones = ref([]);
const diasVacacionesPorMes = ref([]);
const usersCountByRole = ref({});
const recentlyRegisteredUsers = ref([]);
const totalUsersCount = ref(0);
const activeInactiveUsers = ref({ active_users: 0, inactive_users: 0 });
const topEmpleadosAntiguos= ref([]);

// UI states
const isLoading = ref(true);
const fetchError = ref(null);
const detailedError = ref(null);

// Configuration
const daysForRecent = 30;
const currentYear = new Date().getFullYear();

const $toast = useGlobalToast();

// Colores para los gráficos (puedes personalizar estos colores)
const chartColors = {
  primary: '#6366f1', // Indigo 500
  secondary: '#ec4899', // Pink 500
  tertiary: '#f59e0b', // Amber 500
  success: '#22c55e', // Green 500
  warning: '#eab308', // Yellow 500
  danger: '#ef4444', // Red 500
  info: '#3b82f6', // Blue 500
  purple: '#a855f7', // Purple 500
  cyan: '#06b6d4', // Cyan 500
  teal: '#14b8a6', // Teal 500
  blueDark: '#1e3a8a', // Dark blue for contrast
  grayLight: '#d1d5db', // Light gray
};

// --- Computed Properties para Formatear Datos de Gráficos ---

// Datos para el gráfico de Usuarios por Rol (Pastel/Dona)
const usersCountByRoleData = computed(() => {
  const labels = Object.keys(usersCountByRole.value);
  const data = Object.values(usersCountByRole.value);

  // Asignar colores a cada segmento del pastel
  const backgroundColors = labels.map((_, index) => {
    const colors = [chartColors.primary, chartColors.secondary, chartColors.success, chartColors.info, chartColors.purple, chartColors.cyan];
    return colors[index % colors.length]; // Cicla a través de los colores
  });

  return {
    labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)), // Capitalizar roles
    datasets: [
      {
        label: 'Usuarios',
        backgroundColor: backgroundColors,
        data: data,
        hoverOffset: 4, // Pequeño efecto al pasar el ratón
      },
    ],
  };
});

// Datos para el gráfico de Días de Vacaciones por Mes (Barras)
const diasVacacionesPorMesData = computed(() => {
  const monthNamesFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesShort = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  // Crear un mapa para facilitar el acceso a los días por mes, usando el nombre completo en inglés
  const dataMap = new Map();
  diasVacacionesPorMes.value.forEach(item => {
    // Convertir total_dias a número. Si es null/undefined o no es un número válido, usa 0.
    const totalDays = parseInt(item.total_dias, 10) || 0;
    dataMap.set(item.mes, totalDays); // Usar el nombre del mes de la API como clave
  });

  // Rellenar el array de datos para Chart.js en el orden correcto
  const data = monthNamesFull.map(monthName => dataMap.get(monthName) || 0);

  // console.log('diasVacacionesPorMesData labels:', monthNamesShort);
  // console.log('diasVacacionesPorMesData data:', data);

  return {
    labels: monthNamesShort, // Etiquetas abreviadas para el eje X
    datasets: [
      {
        label: `Días de Vacaciones ${currentYear}`,
        backgroundColor: chartColors.teal,
        borderColor: chartColors.teal,
        borderWidth: 1,
        data: data,
      },
    ],
  };
});


// Datos para el gráfico de Estado de Solicitudes de Vacaciones (Pastel/Dona)
const vacacionesStatusData = computed(() => {
  const labels = Object.keys(vacacionesStatus.value);
  const data = Object.values(vacacionesStatus.value);

  const backgroundColors = labels.map(status => {
    switch (status.toLowerCase ) {
      case 'pendiente': return chartColors.warning;
      case 'aprobado': return chartColors.success;
      case 'rechazado': return chartColors.danger;
      default: return chartColors.info;
    }
  });

  return {
    labels: labels,
    datasets: [
      {
        label: 'Solicitudes',
        backgroundColor: backgroundColors,
        data: data,
        hoverOffset: 4,
      },
    ],
  };
});


// --- Opciones de Gráficos Específicos ---

// Opciones generales para gráficos de pastel/dona
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        color: 'rgb(156 163 175 / var(--tw-text-opacity))' // text-gray-400 para modo oscuro
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += context.parsed;
          }
          return label;
        }
      }
    },
  },
};

// Opciones generales para gráficos de barras
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: 'rgb(156 163 175 / var(--tw-text-opacity))'
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'rgb(156 163 175 / var(--tw-text-opacity))'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)' // grid color for dark mode
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: 'rgb(156 163 175 / var(--tw-text-opacity))'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)' // grid color for dark mode
      }
    }
  }
};


// --- Utility Functions ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    console.error("Error formatting date/time:", e);
    return dateString;
  }
};

// --- Data Fetching Logic (sin cambios mayores aquí) ---
const loadDashboardData = async () => {
  isLoading.value = true;
  fetchError.value = null;
  detailedError.value = null;

  const dataPromises = [];

  // Empleados
  dataPromises.push(
    adminDashboardService.getEmpleadoStatusCounts()
      .then(data => { employeeStatus.value = data; })
      .catch(error => { $toast.error('No se pudo cargar el resumen de empleados.'); console.error(error); employeeStatus.value = { activo: 0, inactivo: 0, total: 0 }; })
  );
  dataPromises.push(
    adminDashboardService.getRecentlyHiredEmployees(daysForRecent)
      .then(data => { recentlyHiredEmployees.value = data; })
      .catch(error => { $toast.error('No se pudieron cargar empleados recién ingresados.'); console.error(error); recentlyHiredEmployees.value = []; })
  );

  // Asistencias
  dataPromises.push(
    adminDashboardService.getAsistenciasHoy()
      .then(data => { asistenciasHoy.value = data; })
      .catch(error => { $toast.error('No se pudo cargar asistencias de hoy.'); console.error(error); asistenciasHoy.value = []; })
  );
  dataPromises.push(
    adminDashboardService.getLatestAsistencias()
      .then(data => { latestAsistencias.value = data; })
      .catch(error => { $toast.error('No se pudieron cargar las últimas asistencias.'); console.error(error); latestAsistencias.value = []; })
  );

  // Vacaciones
  dataPromises.push(
    adminDashboardService.getResumenEstadosVacaciones(currentYear)
      .then(data => { vacacionesStatus.value = data; })
      .catch(error => { $toast.error(`No se pudo cargar el resumen de vacaciones para el año ${currentYear}.`); console.error(error); vacacionesStatus.value = {}; })
  );
  dataPromises.push(
    adminDashboardService.getProximasVacaciones()
      .then(data => { proximasVacaciones.value = data; })
      .catch(error => { $toast.error('No se pudieron cargar las próximas vacaciones.'); console.error(error); proximasVacaciones.value = []; })
  );
  dataPromises.push(
    adminDashboardService.getDiasVacacionesPorMes(currentYear)
      .then(data => { diasVacacionesPorMes.value = data; })
      .catch(error => { $toast.error(`No se pudo cargar días de vacaciones por mes para el año ${currentYear}.`); console.error(error); diasVacacionesPorMes.value = {}; })
  );

  // Usuarios
  dataPromises.push(
    adminDashboardService.getTotalUsersCount()
      .then(data => { totalUsersCount.value = data.total_users; })
      .catch(error => { $toast.error('No se pudo cargar el total de usuarios.'); console.error(error); totalUsersCount.value = 0; })
  );
  dataPromises.push(
    adminDashboardService.getUsersCountByRole()
      .then(data => { usersCountByRole.value = data; })
      .catch(error => { $toast.error('No se pudo cargar el conteo de usuarios por rol.'); console.error(error); usersCountByRole.value = {}; })
  );
  dataPromises.push(
    adminDashboardService.getActiveInactiveUsersCount()
      .then(data => { activeInactiveUsers.value = { active_users: data.active_users, inactive_users: data.inactive_users }; })
      .catch(error => { $toast.error('No se pudo cargar el conteo de usuarios activos/inactivos.'); console.error(error); activeInactiveUsers.value = { active_users: 0, inactive_users: 0 }; })
  );
  dataPromises.push(
    adminDashboardService.getRecentlyRegisteredUsers(daysForRecent)
      .then(data => { recentlyRegisteredUsers.value = data; })
      .catch(error => { $toast.error('No se pudieron cargar usuarios recién registrados.'); console.error(error); recentlyRegisteredUsers.value = []; })
  );

  dataPromises.push(
    adminDashboardService.getTopEmpleadosAntiguos()
      .then(data => { topEmpleadosAntiguos.value = data; })
      .catch(error => { $toast.error('No se pudieron cargar los empleados más antiguos.'); console.error(error); topEmpleadosAntiguos.value = []; })
  );

  try {
    await Promise.all(dataPromises);
  } catch (err) {
    console.error('Un error inesperado ocurrió durante la carga de datos del dashboard:', err);
    fetchError.value = 'Ha ocurrido un error inesperado al cargar el dashboard.';
    detailedError.value = err.message || 'Por favor, intente de nuevo.';
  } finally {
    isLoading.value = false;
  }
};


const calculateAntiquity = (hireDateString) => {
  if (!hireDateString) return 'N/A';
  const hireDate = new Date(hireDateString);
  const now = new Date();

  let years = now.getFullYear() - hireDate.getFullYear();
  let months = now.getMonth() - hireDate.getMonth();
  let days = now.getDate() - hireDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); // Días en el mes anterior
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} año${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mes${months !== 1 ? 'es' : ''}`);
  if (days > 0 && years === 0) parts.push(`${days} día${days !== 1 ? 's' : ''}`); // Solo mostrar días si no hay años/meses para mayor brevedad

  return parts.length > 0 ? parts.join(', ') : 'Menos de 1 día';
};

const getNextAnniversary = (hireDateString) => {
  if (!hireDateString) return 'N/A';
  const hireDate = new Date(hireDateString);
  const now = new Date();

  let anniversaryYear = now.getFullYear();
  let nextAnniversary = new Date(anniversaryYear, hireDate.getMonth(), hireDate.getDate());

  // Si el aniversario de este año ya pasó, calcula el del próximo año
  if (nextAnniversary < now) {
    anniversaryYear++;
    nextAnniversary = new Date(anniversaryYear, hireDate.getMonth(), hireDate.getDate());
  }

  // Verificar si está próximo a cumplir el año (ej. dentro de los próximos 30 días)
  const oneYearFromHire = new Date(hireDate.getFullYear() + 1, hireDate.getMonth(), hireDate.getDate());
  const diffTime = nextAnniversary.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0 && diffDays <= 30) { // Próximo en 30 días o ya cumplió
    // Si la fecha de ingreso + 1 año es igual a la fecha actual o anterior
    if (oneYearFromHire <= now && nextAnniversary.getFullYear() === now.getFullYear()) {
        return `Cumplió ${anniversaryYear - hireDate.getFullYear()} año${(anniversaryYear - hireDate.getFullYear()) !== 1 ? 's' : ''} en ${formatDate(nextAnniversary)}`;
    }
    // Si la fecha de ingreso + 1 año es el próximo aniversario y está dentro de los 30 días
    if (anniversaryYear === hireDate.getFullYear() + 1 && diffDays > 0) {
        return `Próximo a 1 año (${diffDays} días)`;
    }
    // Si es un aniversario subsiguiente y está próximo
    return `Próximo a ${anniversaryYear - hireDate.getFullYear()} año${(anniversaryYear - hireDate.getFullYear()) !== 1 ? 's' : ''} (${diffDays} días)`;
  }

  return formatDate(nextAnniversary);
};


// --- Lifecycle Hook ---
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
/* Tailwind CSS utilities para styling */
/* Aseguramos que los contenedores de los gráficos tengan una altura fija para que el canvas se estire */
.h-64 {
  height: 16rem; /* 256px */
}
</style>