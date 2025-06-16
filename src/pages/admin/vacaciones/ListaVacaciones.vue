<template>
  <div>
    <div class="my-8 mx-auto text-center">
      <h1 class="text-2xl font-semibold mb-1">Administración de Solicitudes de Vacaciones</h1>
      <p class="text-gray-600">Gestiona las solicitudes de vacaciones de los empleados.</p>
    </div>


    <div class="my-8 flex justify-between items-center">
      <UiButton variant="outline-success" @click="goCreateVacacion">
        <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nueva Solicitud</span>
      </UiButton>
      <UiButton variant="outline-secondary" @click="cargarVacaciones">
        <CheckCircleIcon class="w-6 h-6 mr-2" />
        <span> Recargar Solicitudes</span>
      </UiButton>
    </div>

    <div class="my-6 flex flex-wrap gap-3 justify-center">
      <UiButton
        v-for="estado in estadosConteo"
        :key="estado.name"
        :variant="currentFilter === estado.name ? 'primary' : 'outline-secondary'"
        size="sm"
        @click="setFilter(estado.name)"
      >
        {{ estado.label }}
        <UiBadge
          :text="estado.count.toString()"
          :color="getEstadoColor(estado.name)"
          size="sm"
          class="ml-2"
        />
      </UiButton>
      <UiButton
        :variant="currentFilter === 'Todos' ? 'primary' : 'outline-secondary'"
        size="sm"
        @click="setFilter('Todos')"
      >
        Todos
        <UiBadge
          :text="vacaciones.length.toString()"
          color="gray"
          size="sm"
          class="ml-2"
        />
      </UiButton>
    </div>

    <UiTable
      :headers="tableHeaders"
      :data="filteredVacaciones"
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
            variant="outline-info"
            size="sm"
            @click="verDetallesVacacion(item)"
          >
            Detalles
          </UiButton>
          <UiButton
            variant="outline-primary"
            size="sm"
            @click="editarVacacion(item.Id)"
          >
            Editar
          </UiButton>
          <UiButton
            variant="outline-error"
            size="sm"
            @click="confirmarEliminarVacacion(item.originalItem)"
          >
            Eliminar
          </UiButton>
        </div>
      </template>
    </UiTable>
    <div class="w-full my-4 text-sm text-gray-600 text-center">
      <p class="text-gray-600">
        Recuerda que las solicitudes eliminadas no se pueden recuperar.</p>
      
    </div>

    <div class="my-4 h-14 text-base">
      <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando solicitudes de vacaciones...</div>
      <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar las vacaciones: {{ error }}</div>
      <div v-if="vacaciones.length === 0 && !cargando && !error && currentFilter === 'Todos'" class="text-center py-4 text-gray-500">No hay solicitudes de vacaciones disponibles.</div>
      <div v-if="filteredVacaciones.length === 0 && !cargando && !error && currentFilter !== 'Todos'" class="text-center py-4 text-gray-500">No se encontraron solicitudes con el estado "{{ currentFilter }}".</div>
    </div>

    <UiDivider class="my-8" label="Acciones Rápidas" :icon="checkCircleIcon" size="lg" />

    <div class="text-center mb-8">
      <UiButton variant="primary" @click="goToAdminSolicitudes" :icon="clipBoardDocumentIcon">
        Administrar Solicitudes (Estados)
      </UiButton>
      <p class="text-gray-600 mt-2">Accede a la sección de administración de estados de solicitudes de vacaciones.</p>
    </div>

    <!-- Contenedor de búsqueda rápida de disponibilidad de vacaciones -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-wrap items-center p-6 gap-6 min-h-40 max-h-max mb-8">
      <div class="flex md:flex-col items-center self-start gap-3 w-full sm:w-auto">

        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <SparklesIcon class="w-6 h-6 text-blue-500" />
          Disponibilidad de Vacaciones
        </h2>

        <article class="flex items-center gap-3 w-full sm:w-auto">
          <UiInputText
          v-model="busquedaEmpleado"
          placeholder="Buscar por ID o nombre del empleado..."
          @keydown.enter="buscarDisponibilidadEmpleado"
        />
        <UiButton
          variant="outline-secondary"
          
          @click="buscarDisponibilidadEmpleado"
        >
          Ver Disponibilidad
        </UiButton>
        </article>
      </div>
      <div class="flex-1 px-4 h-64">
      <div v-if="disponibilidadEmpleado === null" class="text-gray-400 text-base">
        <p class="mb-1">Busca un empleado por su ID o nombre para ver su disponibilidad de vacaciones.</p>
        <p class="mb-4">Puedes escribir el ID y presionar <UiKbd>Enter <ArrowTurnDownLeftIcon class="w-5 h-5 text-gray-400" /> </UiKbd> o el botón.</p>
        
        <span class="italic">No se ha buscado ningún empleado.</span>
      </div>
      <div v-if="disponibilidadEmpleado !== null" class="mt-2 text-left">
        <div v-if="disponibilidadEmpleado.error" class="text-red-500 font-medium">
        {{ disponibilidadEmpleado.error }}
        </div>
        <div v-else class="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 shadow p-5 border border-blue-100">
        <p class="font-semibold text-lg mb-3 text-blue-800 flex items-center gap-2">
          <SparklesIcon class="w-5 h-5 text-blue-400" />
          <span >Disponibilidad de</span>
          <span class="text-blue-700">{{ disponibilidadEmpleado.empleado }}</span>
        </p>
        <ul class="divide-y divide-blue-100">
          <li class="py-1 flex justify-between items-center">
          <span class="text-gray-500">Días arrastrados</span>
          <span class="font-semibold text-blue-700">{{ disponibilidadEmpleado.dias_arrastrados }}</span>
          </li>
          <li class="py-1 flex justify-between items-center">
          <span class="text-gray-500">Días disponibles</span>
          <span class="font-semibold text-green-600">{{ disponibilidadEmpleado.disponible }}</span>
          </li>
          <li class="py-1 flex justify-between items-center">
          <span class="text-gray-500">Días asignados</span>
          <span class="font-semibold text-blue-600">{{ disponibilidadEmpleado.total_asignado }}</span>
          </li>
          <li class="py-1 flex justify-between items-center">
          <span class="text-gray-500">Días solicitados</span>
          <span class="font-semibold text-yellow-600">{{ disponibilidadEmpleado.total_base_por_antiguedad }}</span>
          </li>
          <li class="py-1 flex justify-between items-center">
          <span class="text-gray-500">Días usados</span>
          <span class="font-semibold text-red-600">{{ disponibilidadEmpleado.usado }}</span>
          </li>
        </ul>
        </div>
      </div>
      </div>
    </div>


    <UiDivider class="my-8" label="Información Adicional" :icon="FireIcon" size="lg" />
    <div class="text-center mb-8">
      <p class="text-gray-600">Para más información sobre las políticas de vacaciones, consulta el manual del empleado o contacta al departamento de recursos humanos.</p>
      <p class="text-gray-600">También puedes revisar las guías de uso del sistema en la sección de ayuda.</p>
    </div>

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

    <ModalDynamic
      :isOpen="isDetallesModalOpen"
      @update:isOpen="isDetallesModalOpen = $event"
      type="info"
      :title="'Detalles de la Solicitud'"
      size="lg"
    >
      <template #body>
        <DetalleVacacion :vacacion="vacacionSeleccionada" />
      </template>
      <template #primary-action>
        <UiButton type="button" variant="outline-secondary" @click="cerrarDetallesModal">
          Cerrar
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
import UiKbd from '../../../components/ui/UiKbd.vue';
import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import DetalleVacacion from '../../../components/features/vacaciones/DetalleVacacion.vue'; // <-- Importa el nuevo componente
import { ClipboardDocumentCheckIcon, ExclamationTriangleIcon, FireIcon, PlusCircleIcon, SparklesIcon, TruckIcon,  } from '@heroicons/vue/20/solid';

import VacacionesService from '../../../services/vacacionesService';
import { formatDate } from '../../../utils/dateFormatter';
import UiDivider from '../../../components/ui/UiDivider.vue';
import { ArrowTurnDownLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import UiInputText from '../../../components/ui/UiInputText.vue';
// UiTag no se está usando en este componente, puedes removerlo si no lo necesitas.
// import UiTag from '../../../components/ui/UiTag.vue';

// Variables y métodos para la búsqueda de disponibilidad de vacaciones
const busquedaEmpleado = ref('');
const disponibilidadEmpleado = ref(null);

const buscarDisponibilidadEmpleado = async () => {
  disponibilidadEmpleado.value = null;
  if (!busquedaEmpleado.value || !busquedaEmpleado.value.trim()) {
    disponibilidadEmpleado.value = { error: 'Por favor ingresa un ID o nombre de empleado.' };
    return;
  }
  try {
    // Aquí deberías llamar a tu servicio real para obtener la disponibilidad
    // Por ejemplo: 
    const data = await VacacionesService.getDisponibilidad(busquedaEmpleado.value);
    // Simulación de respuesta:
    // Si no se encuentra el empleado, puedes simular un error:
    disponibilidadEmpleado.value = { error: 'Empleado no encontrado.' };
    disponibilidadEmpleado.value = data;
    console.log('Disponibilidad del empleado:', disponibilidadEmpleado.value);
  } catch (err) {
    disponibilidadEmpleado.value = { error: err.message || 'Error al buscar disponibilidad.' };
  }
};


const router = useRouter();

const vacaciones = ref([]);
const cargando = ref(false);
const error = ref(null);
const globalFilterApplied = ref(false);

const checkCircleIcon = CheckCircleIcon;
const clipBoardDocumentIcon = ClipboardDocumentCheckIcon;
const sparklesIcon = SparklesIcon;

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

// --- NUEVAS PROPIEDADES Y FUNCIONES PARA EL MODAL DE DETALLES ---
const isDetallesModalOpen = ref(false); // Controla la visibilidad del modal de detalles
const vacacionSeleccionada = ref(null); // Almacena la vacación seleccionada para mostrar en el modal

const verDetallesVacacion = (item) => {

  // Formatear el objeto para el modal de detalles
  if (!item || !item.originalItem) {
    console.error('No se pudo obtener la vacación original para mostrar los detalles.');
    return;
  }
  // Asignamos el objeto formateado a la propiedad vacacionSeleccionada
  vacacionSeleccionada.value = item; // item ya es el objeto formateado para la tabla
  isDetallesModalOpen.value = true;
};

const cerrarDetallesModal = () => {
  isDetallesModalOpen.value = false;
  vacacionSeleccionada.value = null; // Limpiar los datos al cerrar el modal
};
// --- FIN NUEVAS PROPIEDADES Y FUNCIONES PARA EL MODAL DE DETALLES ---

const currentFilter = ref('Todos');

const setFilter = (estado) => {
  currentFilter.value = estado;
};

const estadosConteo = computed(() => {
  const counts = {
    'PENDIENTE': 0,
    'APROBADO': 0,
    'RECHAZADO': 0,
    'CANCELADO': 0,
  };
  vacaciones.value.forEach(v => {
    const estado = v.estado_solicitud?.estado?.toUpperCase();
    if (counts.hasOwnProperty(estado)) {
      counts[estado]++;
    }
  });

  return [
    { name: 'PENDIENTE', label: 'Pendientes', count: counts['PENDIENTE'] },
    { name: 'APROBADO', label: 'Aprobadas', count: counts['APROBADO'] },
    { name: 'RECHAZADO', label: 'Rechazadas', count: counts['RECHAZADO'] },
    { name: 'CANCELADO', label: 'Canceladas', count: counts['CANCELADO'] },
  ];
});

const filteredVacaciones = computed(() => {
  let data = vacacionesFormatted.value;
  if (currentFilter.value !== 'Todos') {
    data = data.filter(v => v.Estado.toUpperCase() === currentFilter.value.toUpperCase());
  }
  return data;
});

const cargarVacaciones = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const data = await VacacionesService.getAll();
    vacaciones.value = data;
    currentFilter.value = 'Todos';
  } catch (err) {
    error.value = err.message || 'Error desconocido al cargar las vacaciones.';
    console.error('Error al cargar las solicitudes de vacaciones:', err);
  } finally {
    cargando.value = false;
    globalFilterApplied.value = false;
  }
};

const vacacionesFormatted = computed(() => {
  const formattedData = vacaciones.value.map(v => ({
    Id: v.id,
    Empleado: `${v.empleado?.nombre || ''} ${v.empleado?.ape_paterno || ''} ${v.empleado?.ape_materno || ''}`.trim(),
    FechaInicio: formatDate(v.fecha_inicio),
    FechaFin: formatDate(v.fecha_fin),
    DiasSolicitados: v.dias_vacaciones_solicitados,
    Estado: v.estado_solicitud?.estado || 'Desconocido',
    originalItem: v, // Mantener el objeto original completo para detalles
  }));
  console.log('Datos formateados para UiTable (ListaVacaciones):', formattedData);
  return formattedData;
});

const getEstadoColor = (estado) => {
  switch (estado.toUpperCase()) {
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

const goCreateVacacion = () => {
  router.push({ name: 'crear-vacacion' });
};

const editarVacacion = (vacacionId) => {
  router.push({ name: 'editar-vacacion', params: { id: vacacionId } });
};

const goToAdminSolicitudes = () => {
  router.push({ name: 'administrar-estados-vacaciones' })
};

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
    await cargarVacaciones();
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

onMounted(() => {
  cargarVacaciones();
});
</script>

<style scoped>
/* Estilos específicos del componente si los hay */
</style>