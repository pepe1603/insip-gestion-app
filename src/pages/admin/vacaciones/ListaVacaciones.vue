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
            size="xs"
            @click="verDetallesVacacion(item)"
          >
            Detalles
          </UiButton>
          <UiButton
            variant="outline-primary"
            size="xs"
            @click="editarVacacion(item.Id)"
          >
            Editar
          </UiButton>
          <UiButton
            variant="outline-error"
            size="xs"
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

    <div class="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col md:flex-row items-stretch p-6 gap-6 min-h-40 max-h-max mb-8">
      <div class="flex flex-col items-center self-start gap-3 w-full md:w-1/3">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <SparklesIcon class="w-6 h-6 text-blue-500" />
          Búsqueda de Empleado
        </h2>
        <article class="flex flex-col sm:flex-row items-center gap-3 w-full">
          <UiInputText
            v-model="busquedaEmpleado"
            placeholder="Buscar por ID o nombre del empleado..."
            @keydown.enter="triggerEmployeeSearch"
            class="flex-1"
          />
          <UiButton
            variant="outline-secondary"
            @click="triggerEmployeeSearch"
            class="w-full sm:w-auto"
          >
            Ver Historial
          </UiButton>
        </article>
        <p class="text-gray-400 text-sm italic mt-2">
          Ingresa el ID del empleado y presiona Enter o el botón.
        </p>
      </div>

      <div class="flex-1 w-full md:w-2/3">
        <EmployeeApprovedVacations
          v-if="empleadoIdParaHistorial"
          :empleado-id="empleadoIdParaHistorial"
          :empleado-nombre="empleadoNombreParaHistorial"
        />
        <div v-else class="text-gray-400 text-center py-8">
          <CalendarDaysIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Usa la búsqueda para ver el historial de vacaciones y la disponibilidad de un empleado.</p>
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
import DetalleVacacion from '../../../components/features/vacaciones/DetalleVacacion.vue';
import EmployeeApprovedVacations from '../../../components/features/vacaciones/EmployeeApprovedVacations.vue'; // ¡Nuevo componente!

import { ClipboardDocumentCheckIcon, ExclamationTriangleIcon, FireIcon, PlusCircleIcon, SparklesIcon, TruckIcon, CalendarDaysIcon, UserIcon } from '@heroicons/vue/20/solid'; // Agrega UserIcon si lo usas
import { ArrowTurnDownLeftIcon, CheckCircleIcon, CalendarDaysIcon as OutlineCalendarDaysIcon } from '@heroicons/vue/24/outline'; // OutlineCalendarDaysIcon para el placeholder

import VacacionesService from '../../../services/vacacionesService';
import { formatDate } from '../../../utils/dateFormatter';
import UiDivider from '../../../components/ui/UiDivider.vue';
import UiInputText from '../../../components/ui/UiInputText.vue';
import { useToastService } from '../../../services/toastService';

// --- Variables y métodos para la búsqueda de disponibilidad de vacaciones (MODIFICADO) ---
const busquedaEmpleado = ref('');
const empleadoIdParaHistorial = ref(null); // ID del empleado para pasar al nuevo componente
const empleadoNombreParaHistorial = ref(''); // Nombre del empleado para pasar al nuevo componente

const triggerEmployeeSearch = async () => {
  if (!busquedaEmpleado.value || !busquedaEmpleado.value.trim()) {
    empleadoIdParaHistorial.value = null; // Reiniciar el componente si no hay búsqueda
    empleadoNombreParaHistorial.value = '';
    return;
  }

  // Intenta determinar si la entrada es un ID numérico o un nombre
  const isNumeric = /^\d+$/.test(busquedaEmpleado.value);

  // NOTA: Para buscar por nombre, tu VacacionesService.getByEmpleado()
  // debería ser capaz de aceptar también un nombre y resolver el ID,
  // o necesitarías un nuevo servicio/endpoint para buscar empleados por nombre.
  // Por ahora, asumimos que 'busquedaEmpleado.value' es el ID.
  // Si necesitas buscar por nombre, tendrías que adaptar tu backend o añadir una lógica de búsqueda de empleado aquí.

  try {
    // Si la entrada es un ID numérico, úsalo directamente
    if (isNumeric) {
      empleadoIdParaHistorial.value = parseInt(busquedaEmpleado.value, 10);
      // Opcional: Si quieres el nombre, podrías hacer una llamada adicional a tu servicio de empleados
      // para obtener el nombre completo usando el ID.
      // Por ahora, lo dejaremos vacío o intentaremos obtenerlo de la primera vacación aprobada si ya se cargó.
      empleadoNombreParaHistorial.value = ''; // Se actualizará dentro de EmployeeApprovedVacations si hay datos
    } else {
      // Si no es numérico, asumimos que es un nombre.
      // Aquí necesitarías una lógica para convertir el nombre a un ID de empleado.
      // Por ejemplo, buscar en tu lista de 'vacaciones' cargadas o llamar a un servicio de empleados.
      // Por simplicidad, si no es un número, por ahora no pasaremos un ID válido.
      // Idealmente, tendrías un endpoint como `/empleados?nombre=X` que te devolvería el ID.
      //alert('La búsqueda por nombre aún no está completamente implementada. Por favor, ingrese el ID numérico del empleado.');
      useToastService.warning(
        'Búsqueda por nombre no implementada',
        'Por favor, ingresa el ID numérico del empleado.'
      );
      empleadoIdParaHistorial.value = null;
      empleadoNombreParaHistorial.value = '';
    }

  } catch (err) {
    console.error('Error al procesar la búsqueda del empleado:', err);
    empleadoIdParaHistorial.value = null;
    empleadoNombreParaHistorial.value = '';
  }
};
// --- FIN MODIFICACIÓN DE BÚSQUEDA ---

const router = useRouter();

const vacaciones = ref([]);
const cargando = ref(false);
const error = ref(null);
const globalFilterApplied = ref(false);

const checkCircleIcon = CheckCircleIcon;
const clipBoardDocumentIcon = ClipboardDocumentCheckIcon;
const sparklesIcon = SparklesIcon;
const calendarDaysIcon = OutlineCalendarDaysIcon; // Usamos la versión outline para el placeholder

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

// --- PROPIEDADES Y FUNCIONES PARA EL MODAL DE DETALLES ---
const isDetallesModalOpen = ref(false); // Controla la visibilidad del modal de detalles
const vacacionSeleccionada = ref(null); // Almacena la vacación seleccionada para mostrar en el modal

const verDetallesVacacion = (item) => {
  if (!item || !item.originalItem) {
    console.error('No se pudo obtener la vacación original para mostrar los detalles.');
    return;
  }
  vacacionSeleccionada.value = item.originalItem;
  isDetallesModalOpen.value = true;
};

const cerrarDetallesModal = () => {
  isDetallesModalOpen.value = false;
  vacacionSeleccionada.value = null; // Limpiar los datos al cerrar el modal
};
// --- FIN PROPIEDADES Y FUNCIONES PARA EL MODAL DE DETALLES ---

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