<template>
  <div>
    <div class="my-8 mx-auto text-center">
      <h1 class="text-2xl font-semibold mb-1">Administración de Solicitudes de Vacaciones</h1>
      <p class="text-gray-600">Gestiona las solicitudes de vacaciones de los empleados.</p>
    </div>

    <div class="my-4 flex justify-between">
      <UiButton variant="outline-success" @click="goCreateVacacion">
        <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nueva Solicitud</span>
      </UiButton>
    </div>

    <UiTable
      :headers="tableHeaders"
      :data="vacacionesFormatted"
      :show-filter="true"
      filter-placeholder="Buscar solicitudes de vacaciones..."
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
        <div class="w-fit flex gap-1 flex-wrap">
          <UiButton
            variant="outline-primary"
            size="small"
            @click="editarVacacion(item.Id)" >
            Editar
          </UiButton>
          <UiButton
            variant="outline-error"
            size="small"
            @click="confirmarEliminarVacacion(item.originalItem)"
          >
            Eliminar
          </UiButton>
          </div>
      </template>
    </UiTable>

    <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando solicitudes de vacaciones...</div>
    <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar las vacaciones: {{ error }}</div>
    <div v-if="vacaciones.length === 0 && !cargando && !error && !globalFilterApplied" class="text-center py-4 text-gray-500">No hay solicitudes de vacaciones disponibles.</div>
    <div v-if="vacaciones.length === 0 && globalFilterApplied && !cargando && !error" class="text-center py-4 text-gray-500">No se encontraron resultados para la búsqueda.</div>


    <ModalDynamic
      :isOpen="isDeleteConfirmOpen"
      @update:isOpen="isDeleteConfirmOpen = $event"
      type="error"
      :title="'¿Eliminar solicitud de vacación?'"
    >
      <template #body>
        <p class="text-gray-700">
          ¿Estás seguro de que deseas eliminar la solicitud de vacación para
          <strong class="mr-1">{{ empleadoAEliminarNombreCompleto }}</strong>
          con fecha de inicio:
          <strong class="mr-1">{{ fechaInicioAEliminarFormatted }}</strong> y fecha de fin:
          <strong class="mr-1">{{ fechaFinAEliminarFormatted }}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </template>
      <template #primary-action>
        <UiButton type="button" variant="error" @click="eliminarVacacion">
          Eliminar
        </UiButton>
      </template>
      <template #secondary-action>
        <UiButton type="button" variant="outline-secondary" @click="cancelarEliminar">
          Cancelar
        </UiButton>
      </template>
    </ModalDynamic>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UiTable from '../../../components/ui/UiTable.vue';
import UiButton from '../../../components/ui/UiButton.vue';
import UiBadge from '../../../components/ui/UiBadge.vue';
import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import { PlusCircleIcon } from '@heroicons/vue/20/solid';
import VacacionesService from '../../../services/vacacionesService';
import { formatDate } from '../../../utils/dateFormatter';

const router = useRouter();

const vacaciones = ref([]);
const cargando = ref(false);
const error = ref(null);
const globalFilterApplied = ref(false);

const tableHeaders = [
  'Id',
  'Empleado',
  'FechaInicio',
  'FechaFin',
  'DiasSolicitados',
  'Estado',
  'Acciones'
];

const isDeleteConfirmOpen = ref(false);
const vacacionAEliminarId = ref(null);
const empleadoAEliminarNombreCompleto = ref(null);
const fechaInicioAEliminar = ref(null);
const fechaFinAEliminar = ref(null);

const fechaInicioAEliminarFormatted = computed(() => formatDate(fechaInicioAEliminar.value));
const fechaFinAEliminarFormatted = computed(() => formatDate(fechaFinAEliminar.value));

/**
 * Carga todas las solicitudes de vacaciones desde el servicio.
 */
const cargarVacaciones = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const data = await VacacionesService.getAll();
    vacaciones.value = data;
  } catch (err) {
    error.value = err.message || 'Error desconocido al cargar las vacaciones.';
    console.error('Error al cargar las solicitudes de vacaciones:', err);
  } finally {
    cargando.value = false;
    globalFilterApplied.value = false;
  }
};

/**
 * Transforma los datos crudos de las vacaciones obtenidos de la API
 * a un formato más amigable para la tabla y sus slots.
 * Las propiedades creadas (ej. 'Id', 'Empleado', 'FechaInicio') DEBEN COINCIDIR EXACTAMENTE
 * con los nombres de los slots y los strings en `tableHeaders`.
 */
const vacacionesFormatted = computed(() => {
  const formattedData = vacaciones.value.map(v => ({
    Id: v.id,
    Empleado: `${v.empleado?.nombre || ''} ${v.empleado?.ape_paterno || ''} ${v.empleado?.ape_materno || ''}`.trim(),
    FechaInicio: formatDate(v.fecha_inicio),
    FechaFin: formatDate(v.fecha_fin),
    DiasSolicitados: v.dias_vacaciones_solicitados,
    Estado: v.estado_solicitud?.estado || 'Desconocido',
    originalItem: v,
  }));
  console.log('Datos formateados para UiTable (ListaVacaciones):', formattedData);
  return formattedData;
});

// Función para determinar el color del badge según el estado
const getEstadoColor = (estado) => {
  switch (estado.toUpperCase()) { // Ensure case-insensitivity
    case 'PENDIENTE':
      return 'yellow';
    case 'APROBADO':
      return 'green';
    case 'RECHAZADO':
      return 'red';
    case 'CANCELADO':
      return 'gray';
    default:
      return 'gray'; // Color por defecto si el estado es desconocido
  }
};

// --- Navegación ---
const goCreateVacacion = () => {
  router.push({ name: 'crear-vacacion' });
};

// CORRECTED: Pass the ID directly to the router
const editarVacacion = (vacacionId) => {
  router.push({ name: 'editar-vacacion', params: { id: vacacionId } });
};

const verDetallesVacacion = (vacacion) => {
  // Asumiendo que tienes una ruta para ver detalles de una vacación
  router.push({ name: 'ver-vacacion', params: { id: vacacion.id } });
  // Si no tienes una ruta específica, podrías abrir un modal con los detalles.
};

// --- Acciones CRUD y Modales (Estado de solicitud eliminado del frontend) ---
const confirmarEliminarVacacion = (vacacion) => {
  vacacionAEliminarId.value = vacacion.id;
  empleadoAEliminarNombreCompleto.value = `${vacacion.empleado?.nombre || ''} ${vacacion.empleado?.ape_paterno || ''}`.trim();
  fechaInicioAEliminar.value = vacacion.fecha_inicio;
  fechaFinAEliminar.value = vacacion.fecha_fin;
  isDeleteConfirmOpen.value = true;
};

const eliminarVacacion = async () => {
  try {
    await VacacionesService.delete(vacacionAEliminarId.value);
    await cargarVacaciones(); // Reload the list after deletion
    isDeleteConfirmOpen.value = false;
  } catch (err) {
    error.value = err.message || 'Error desconocido al eliminar la solicitud.';
    console.error('Error al eliminar la solicitud de vacación:', err);
  } finally {
    vacacionAEliminarId.value = null;
    empleadoAEliminarNombreCompleto.value = null;
    fechaInicioAEliminar.value = null;
    fechaFinAEliminar.value = null;
  }
};

const cancelarEliminar = () => {
  isDeleteConfirmOpen.value = false;
};

// State change functions are removed as requested.
// const aprobarVacacion = async (vacacion) => { /* ... */ };
// const rechazarVacacion = async (vacacion) => { /* ... */ };
// const cancelarVacacion = async (vacacion) => { /* ... */ };

onMounted(() => {
  cargarVacaciones();
});
</script>

<style scoped>
/* Estilos específicos del componente si los hay */
</style>