<template>
  <div class="p-6">
    <div class="my-8 mx-auto text-center">
      <h1 class="text-2xl font-semibold mb-1">Administración de Estados de Solicitudes de Vacaciones</h1>
      <p class="text-gray-600">Revisa y gestiona el estado de las solicitudes de vacaciones de los empleados.</p>
    </div>

    <div class="my-4 flex justify-between items-center flex-wrap gap-2">
      <UiButton variant="outline-secondary" @click="cargarSolicitudes">
        <ArrowPathIcon class="w-5 h-5 mr-2" />
        <span> Recargar Todas las Solicitudes</span>
      </UiButton>
      <UiButton variant="outline-primary" @click="handleGenerateAprobadasReport">
        <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
        <span>Reporte Vacaciones Aprobadas</span>
      </UiButton>
      <UiButton variant="outline-error" @click="openCancelModal">
        <XCircleIcon class="w-5 h-5 mr-2" />
        <span>Cancelar Solicitud por ID/Empleado</span>
      </UiButton>
    </div>

    <UiDivider class="my-10" label="Búsqueda de Solicitudes Aprobadas por Empleado" :icon="search" size="lg" />

    <div class="my-6">
      <EmployeeApprovedRequestsSearch
        :allVacationRequests="vacacionesAdmin"
        :vacacionesService="VacacionesService" />
    </div>

    <UiDivider class="my-10" label="Últimas Solicitudes Pendientes de Aprobación" :icon="clock" size="lg" />

    <div class="my-6">
      <RecentPendingRequestsTable
        :pendingRequests="allPendingRequests"
        :loading="loadingPendingRequests"
        :error="errorPendingRequests"
        @request-action="abrirModalCambioEstado"
      />
    </div>

    <UiDivider label="Filtros de Estado en listado General" size="lg" :icon="listBullet" class="my-10" />

    <div class="my-6">
      <div class="my-4 flex flex-wrap gap-3 justify-center">
        <UiButton
          v-for="estado in estadosFiltroConteo"
          :key="estado.name"
          :variant="generalFilter === estado.name ? 'primary' : 'outline-secondary'"
          size="sm"
          @click="setGeneralFilter(estado.name)"
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
          :variant="generalFilter === 'Todos' ? 'primary' : 'outline-secondary'"
          size="sm"
          @click="setGeneralFilter('Todos')"
        >
          Todos
          <UiBadge
            :text="vacacionesAdmin.length.toString()"
            color="gray"
            size="sm"
            class="ml-2"
          />
        </UiButton>
      </div>

      <UiTablestriped
        :headers="tableHeaders"
        :data="filteredGeneralVacations"
        :show-filter="true"
        filter-placeholder="Buscar solicitudes por empleado o ID en la tabla general..."
        :sortable-headers="true"
        :cargando="cargando"
        :error="error"
        caption-title="Listado General de Solicitudes de Vacaciones (Administración Completa)"
        caption-description="Gestiona todos los estados de las solicitudes de vacaciones, incluyendo cancelaciones y detalles."
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
          <div class="w-full flex gap-1 flex-wrap justify-end">
            <UiButton
              variant="outline-info"
              size="xs"
              @click="verDetallesAdmin(item)"
            >
              Ver Detalles
            </UiButton>
            <UiButton
              v-if="item.Estado === 'PENDIENTE'"
              variant="outline-success"
              size="xs"
              @click="abrirModalCambioEstado(item, 'APROBADO')"
            >
              Aprobar
            </UiButton>
            <UiButton
              v-if="item.Estado === 'PENDIENTE'"
              variant="outline-warning"
              size="xs"
              @click="abrirModalCambioEstado(item, 'RECHAZADO')"
            >
              Rechazar
            </UiButton>
            <UiButton
              v-if="item.Estado !== 'CANCELADO' && item.Estado !== 'RECHAZADO'"
              variant="outline-error"
              size="xs"
              @click="abrirModalCambioEstado(item, 'CANCELADO')"
            >
              Cancelar
            </UiButton>
          </div>
        </template>
      </UiTablestriped>
      <div v-if="filteredGeneralVacations.length === 0 && !cargando && !error" class="text-center py-4 text-gray-500">
        No hay solicitudes disponibles con este filtro en la tabla general.
      </div>
      <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando solicitudes...</div>
      <div v-if="error" class="text-red-500 py-4 text-center">Error: {{ error }}</div>
    </div>

    <ModalDynamic
      :isOpen="isCambioEstadoModalOpen"
      @update:isOpen="isCambioEstadoModalOpen = $event"
      :type="modalType"
      :title="modalTitle"
      size="md"
    >
      <template #body>
        <p class="text-gray-700 mb-4">
          Está a punto de cambiar el estado de la solicitud #<strong class="mr-1">{{ vacacionAAdministrar?.Id }}</strong>
          de <strong class="mr-1">{{ vacacionAAdministrar?.Empleado }}</strong>
          para el periodo del <strong class="mr-1">{{ vacacionAAdministrar?.FechaInicio }}</strong>
          al <strong class="mr-1">{{ vacacionAAdministrar?.FechaFin }}</strong>.
        </p>
        <div class="mb-4">
          <label for="observaciones" class="block text-sm font-medium text-gray-700 mb-1">
            Comentarios del Administrador (Opcional)
          </label>
          <textarea
            id="observaciones"
            v-model="observacionesAdmin"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Añade un comentario sobre el cambio de estado (ej. motivo de rechazo, condiciones de aprobación)."
          ></textarea>
        </div>
        <div v-if="loadingCambioEstado" class="text-center text-blue-500 mt-4">Aplicando cambio de estado...</div>
        <div v-if="errorCambioEstado" class="text-red-500 text-center mt-4">{{ errorCambioEstado }}</div>
      </template>
      <template #primary-action>
        <UiButton
          type="button"
          :variant="modalButtonVariant"
          @click="confirmarCambioEstado"
          :disabled="loadingCambioEstado"
        >
          {{ modalButtonText }}
        </UiButton>
      </template>
      <template #secondary-action>
        <UiButton
          type="button"
          variant="outline-secondary"
          @click="cancelarCambioEstado"
          :disabled="loadingCambioEstado"
        >
          Cancelar
        </UiButton>
      </template>
    </ModalDynamic>

    <ModalDynamic
      :isOpen="isDetallesModalOpen"
      @update:isOpen="isDetallesModalOpen = $event"
      type="info"
      :title="'Detalles Completos de la Solicitud'"
      size="lg"
    >
      <template #body>
        <DetalleVacacion :vacacion="vacacionSeleccionada" />
        <template v-if="vacacionSeleccionada">
          <hr class="my-6 border-gray-200 dark:border-gray-700" />
          <UiDescriptionList
            title="Detalles Administrativos"
            description="Información adicional relevante para la administración de la solicitud."
            :items="adminDetailsForDescriptionList"
          />
        </template>
      </template>
      <template #primary-action>
        <UiButton type="button" variant="outline-secondary" @click="cerrarDetallesModal">
          Cerrar
        </UiButton>
      </template>
    </ModalDynamic>

    <ModalDynamic
      :isOpen="isCancelModalOpen"
      @update:isOpen="isCancelModalOpen = $event"
      type="warning"
      title="Cancelar Solicitud de Vacaciones"
      size="md"
    >
      <template #body>
        <p class="text-gray-700 mb-4">
          Ingrese el ID de la solicitud o busque por empleado para cancelar una solicitud de vacaciones.
          Solo las solicitudes Pendientes o Aprobadas pueden ser canceladas.
        </p>
        <div class="mb-4">
          <label for="cancel-search" class="block text-sm font-medium text-gray-700 mb-1">
            Buscar Solicitud por ID o Empleado
          </label>
          <UiInputSearchwithResult
            v-model="cancelSearchTerm"
            :searchServiceMethod="searchCancellableRequests"
            :formatResult="formatCancellableRequestResult"
            result-key="Id"
            placeholder="Buscar por ID o nombre de empleado..."
            @selected="handleCancellableRequestSelected"
          >
            <template #icon>
              <MagnifyingGlassIcon class="w-5 h-5" />
            </template>
          </UiInputSearchwithResult>
        </div>

        <div v-if="selectedRequestToCancel" class="mt-4 p-3 border rounded-md bg-white shadow-sm">
          <h3 class="text-md font-semibold mb-2 text-gray-700">Solicitud Seleccionada:</h3>
          <UiDescriptionList
            :items="formatRequestForDescriptionList(selectedRequestToCancel)"
          />
          <div class="mb-4 mt-4">
            <label for="cancel-observaciones" class="block text-sm font-medium text-gray-700 mb-1">
              Comentarios de Cancelación (Opcional)
            </label>
            <textarea
              id="cancel-observaciones"
              v-model="cancelObservaciones"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Motivo de la cancelación."
            ></textarea>
          </div>
        </div>
        <div v-if="loadingCancelAction" class="text-center text-blue-500 mt-4">Cancelando solicitud...</div>
        <div v-if="errorCancelAction" class="text-red-500 text-center mt-4">{{ errorCancelAction }}</div>
      </template>
      <template #primary-action>
        <UiButton
          type="button"
          variant="error"
          @click="confirmCancelRequest"
          :disabled="!selectedRequestToCancel || loadingCancelAction"
        >
          Confirmar Cancelación
        </UiButton>
      </template>
      <template #secondary-action>
        <UiButton
          type="button"
          variant="outline-secondary"
          @click="closeCancelModal"
          :disabled="loadingCancelAction"
        >
          Cerrar
        </UiButton>
      </template>
    </ModalDynamic>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
// Importamos los componentes UI
import UiTablestriped from '../../../components/ui/tables/UiTablestriped.vue';
import UiButton from '../../../components/ui/UiButton.vue';
import UiBadge from '../../../components/ui/UiBadge.vue';
import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import DetalleVacacion from '../../../components/features/vacaciones/DetalleVacacion.vue';
import UiInputSearchwithResult from '../../../components/ui/UiInputSearchWithResults.vue';
import UiDescriptionList from '../../../components/ui/UiDescriptionList.vue';

// NUEVOS COMPONENTES FACTORIZADOS
import EmployeeApprovedRequestsSearch from '../../../components/features/vacaciones/EmployeeApprovedRequestsSearch.vue';
import RecentPendingRequestsTable from '../../../components/features/vacaciones/RecentPendingRequestsTable.vue';

// Services and Utilities
import VacacionesService from '../../../services/vacacionesService'; // Importamos el servicio
import { formatDate } from '../../../utils/dateFormatter';

// Heroicons
import { ArrowPathIcon, MagnifyingGlassIcon, DocumentArrowDownIcon, XCircleIcon, DocumentMagnifyingGlassIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import UiDivider from '../../../components/ui/UiDivider.vue';
import { ClockIcon } from '@heroicons/vue/24/outline';

//---- const para icons
const search = DocumentMagnifyingGlassIcon;
const clock = ClockIcon;
const listBullet = ClipboardDocumentIcon;

// --- Reactive State ---
const vacacionesAdmin = ref([]); // Holds ALL vacation requests (source of truth for general table and approved search)
const cargando = ref(false); // Loading for general table
const error = ref(null);     // Error for general table
const router = useRouter();

// State for Recent Pending Requests Section
const allPendingRequests = ref([]); // Ahora se carga directamente de getPendientes()
const loadingPendingRequests = ref(false);
const errorPendingRequests = ref(null);

// State for General Table Filter (UiTablestriped)
const generalFilter = ref('Todos');

// Modal for changing status (shared by both tables for Approve/Reject/Cancel)
const isCambioEstadoModalOpen = ref(false);
const vacacionAAdministrar = ref(null);
const nuevoEstadoDeseado = ref('');
const observacionesAdmin = ref('');
const loadingCambioEstado = ref(false);
const errorCambioEstado = ref(null);

// Modal for viewing details
const isDetallesModalOpen = ref(false);
const vacacionSeleccionada = ref(null);

// State for Cancel by ID/Employee Modal
const isCancelModalOpen = ref(false);
const cancelSearchTerm = ref('');
const selectedRequestToCancel = ref(null);
const cancelObservaciones = ref('');
const loadingCancelAction = ref(false);
const errorCancelAction = ref(null);

// --- Headers for General Table ---
const tableHeaders = [
  { label: 'ID', key: 'Id' },
  { label: 'Empleado', key: 'Empleado' },
  { label: 'Fecha Inicio', key: 'FechaInicio' },
  { label: 'Fecha Fin', key: 'FechaFin' },
  { label: 'Días Solicitados', key: 'DiasSolicitados' },
  { label: 'Estado', key: 'Estado' },
  { label: 'Acciones', key: 'Acciones' }
];

// --- Computed Properties ---

// Counts for the general table filter buttons
const estadosFiltroConteo = computed(() => {
  const counts = {
    'PENDIENTE': 0,
    'APROBADO': 0,
    'RECHAZADO': 0,
    'CANCELADO': 0,
  };
  vacacionesAdmin.value.forEach(v => {
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

// Filtered data for the General Table (UiTablestriped)
const filteredGeneralVacations = computed(() => {
  let data = formatVacacionesForAdminTable(vacacionesAdmin.value);
  if (generalFilter.value !== 'Todos') {
    data = data.filter(v => v.Estado.toUpperCase() === generalFilter.value.toUpperCase());
  }
  return data;
});

// Computed properties for the status change modal (remain the same)
const modalTitle = computed(() => {
  switch (nuevoEstadoDeseado.value) {
    case 'APROBADO': return 'Aprobar Solicitud de Vacaciones';
    case 'RECHAZADO': return 'Rechazar Solicitud de Vacaciones';
    case 'CANCELADO': return 'Cancelar Solicitud de Vacaciones';
    default: return 'Cambiar Estado de Solicitud';
  }
});

const modalType = computed(() => {
  switch (nuevoEstadoDeseado.value) {
    case 'APROBADO': return 'success';
    case 'RECHAZADO': return 'error';
    case 'CANCELADO': return 'warning';
    default: return 'info';
  }
});

const modalButtonVariant = computed(() => {
  switch (nuevoEstadoDeseado.value) {
    case 'APROBADO': return 'success';
    case 'RECHAZADO': return 'error';
    case 'CANCELADO': return 'warning';
    default: return 'primary';
  }
});

const modalButtonText = computed(() => {
  switch (nuevoEstadoDeseado.value) {
    case 'APROBADO': return 'Confirmar Aprobación';
    case 'RECHAZADO': return 'Confirmar Rechazo';
    case 'CANCELADO': return 'Confirmar Cancelación';
    default: return 'Confirmar';
  }
});

// Computed properties for UiDescriptionList in the details modal
const adminDetailsForDescriptionList = computed(() => {
  if (!vacacionSeleccionada.value || !vacacionSeleccionada.value.originalItem) return [];

  const original = vacacionSeleccionada.value.originalItem;
  const items = [];

  if (original.observaciones_administrador) {
    items.push({ label: 'Observaciones del Administrador', value: original.observaciones_administrador });
  }
  if (original.fecha_aprobacion) {
    items.push({ label: 'Fecha de Aprobación/Rechazo', value: formatDate(original.fecha_aprobacion) });
  }
  if (original.administrador_que_aprobo) {
    items.push({ label: 'Administrador que gestionó', value: `${original.administrador_que_aprobo.nombre} ${original.administrador_que_aprobo.ape_paterno || ''}`.trim() });
  }
  return items;
});

// --- Methods ---

/**
 * Rerdirect to report generation page from btn generateReport.
 */

 const handleGenerateAprobadasReport = () => {
  router.push({ name: 'reporte-vacaciones-empleado-ciclo' });
};

/**
 * Loads all vacation requests for general administration table.
 */
const cargarTodasLasSolicitudesGenerales = async () => {
  cargando.value = true;
  error.value = null;
  try {
    vacacionesAdmin.value = await VacacionesService.getAll(); // Usa getAll para la tabla general
    generalFilter.value = 'Todos'; // Reset general table filter on reload
  } catch (err) {
    error.value = err.message || 'Error desconocido al cargar las solicitudes de vacaciones para administración.';
    console.error('Error al cargar todas las solicitudes de vacaciones:', err);
  } finally {
    cargando.value = false;
  }
};

/**
 * Loads only pending vacation requests for the RecentPendingRequestsTable.
 */
const cargarSolicitudesPendientes = async () => {
  loadingPendingRequests.value = true;
  errorPendingRequests.value = null;
  try {
    allPendingRequests.value = await VacacionesService.getPendientes(); // Usa el nuevo método
  } catch (err) {
    errorPendingRequests.value = err.message || 'Error al cargar las solicitudes pendientes.';
    console.error('Error al cargar solicitudes pendientes:', err);
  } finally {
    loadingPendingRequests.value = false;
  }
};

/**
 * Orchestrates loading all necessary data.
 */
const cargarSolicitudes = async () => {
  await Promise.all([
    cargarTodasLasSolicitudesGenerales(),
    cargarSolicitudesPendientes()
  ]);
};

/**
 * Transforms raw vacation data into a friendly format for tables and description lists.
 * This helper is used by the main component for `filteredGeneralVacations` and
 * by modals for `formatRequestForDescriptionList`.
 */
const formatVacacionesForAdminTable = (data) => {
  return data.map(v => ({
    Id: v.id,
    Empleado: `${v.empleado?.nombre || ''} ${v.empleado?.ape_paterno || ''} ${v.empleado?.ape_materno || ''}`.trim(),
    FechaSolicitud: formatDate(v.fecha_solicitud || v.created_at),
    FechaInicio: formatDate(v.fecha_inicio),
    FechaFin: formatDate(v.fecha_fin),
    DiasSolicitados: v.dias_vacaciones_solicitados,
    Estado: v.estado_solicitud?.estado || 'Desconocido',
    originalItem: v, // Keep the full original object for details
  }));
};

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

const setGeneralFilter = (estado) => {
  generalFilter.value = estado;
  // This filter only applies to the UiTablestriped (general table)
};


// --- Modal for changing status (Approve/Reject/Cancel) ---
const abrirModalCambioEstado = (vacacion, estado) => {
  vacacionAAdministrar.value = vacacion;
  nuevoEstadoDeseado.value = estado;
  // Initialize observacionesAdmin from originalItem if it exists and is not null
  observacionesAdmin.value = vacacion.originalItem?.observaciones_administrador || '';
  errorCambioEstado.value = null;
  isCambioEstadoModalOpen.value = true;
};

const confirmarCambioEstado = async () => {
  if (!vacacionAAdministrar.value || !nuevoEstadoDeseado.value) return;

  loadingCambioEstado.value = true;
  errorCambioEstado.value = null;

  try {
    const solicitudId = vacacionAAdministrar.value.Id;
    // const observaciones = observacionesAdmin.value; // Ya NO usaremos esto aquí para la llamada al servicio

    switch (nuevoEstadoDeseado.value) {
      case 'APROBADO':
        // Llama al método aprobar, sin pasarle ningún payload
        await VacacionesService.aprobar(solicitudId);
        break;
      case 'RECHAZADO':
        // Llama al método rechazar, sin pasarle ningún payload
        await VacacionesService.rechazar(solicitudId);
        break;
      case 'CANCELADO':
        // Llama al método cancelar, sin pasarle ningún payload
        await VacacionesService.cancelar(solicitudId);
        break;
      default:
        console.warn('Estado deseado desconocido:', nuevoEstadoDeseado.value);
        throw new Error('Acción de estado no válida.');
    }

    // Después de la acción exitosa, puedes recargar las solicitudes para actualizar la UI
    await cargarSolicitudes();
    isCambioEstadoModalOpen.value = false;
    alert(`Solicitud #${solicitudId} ${nuevoEstadoDeseado.value.toLowerCase()} correctamente.`);

  } catch (err) {
    // El 'error.response?.data?.message' sigue siendo relevante si el backend envía mensajes de error específicos.
    errorCambioEstado.value = err.response?.data?.message || err.message || 'Error desconocido al actualizar el estado.';
    console.error('Error al confirmar cambio de estado:', err);
  } finally {
    loadingCambioEstado.value = false;
    // Si las observacionesAdmin no se usan para la API, podrías querer resetearlas aquí
    observacionesAdmin.value = '';
  }
};
const cancelarCambioEstado = () => {
  isCambioEstadoModalOpen.value = false;
  vacacionAAdministrar.value = null;
  nuevoEstadoDeseado.value = '';
  observacionesAdmin.value = '';
};

// --- Modal for viewing details ---
const verDetallesAdmin = (item) => {
  if (!item || !item.originalItem) {
    console.error('Error: The vacation object does not contain originalItem for details.');
    return;
  }
  vacacionSeleccionada.value = item;
  isDetallesModalOpen.value = true;
};

const cerrarDetallesModal = () => {
  isDetallesModalOpen.value = false;
  vacacionSeleccionada.value = null;
};

// --- Cancel Request by ID/Employee Functionality ---
const openCancelModal = () => {
  isCancelModalOpen.value = true;
  cancelSearchTerm.value = '';
  selectedRequestToCancel.value = null;
  cancelObservaciones.value = '';
  errorCancelAction.value = null;
};

const closeCancelModal = () => {
  isCancelModalOpen.value = false;
  cancelSearchTerm.value = '';
  selectedRequestToCancel.value = null;
  cancelObservaciones.value = '';
  errorCancelAction.value = null;
};

const searchCancellableRequests = async (query) => {
  if (!query || query.length < 2) return [];

  // Para esta búsqueda, aún necesitamos filtrar desde 'vacacionesAdmin' que tiene TODAS
  const cancellableRequests = vacacionesAdmin.value.filter(v =>
    v.estado_solicitud?.estado?.toUpperCase() === 'PENDIENTE' ||
    v.estado_solicitud?.estado?.toUpperCase() === 'APROBADO'
  );

  const results = [];
  cancellableRequests.forEach(v => {
    // Asegurar comparación de tipos de ID si es necesario
    if (String(v.id).includes(query) || String(v.empleado_id).includes(query)) { // Ajuste para ID string
      results.push(formatVacacionesForAdminTable([v])[0]);
    }
    const fullName = `${v.empleado?.nombre || ''} ${v.empleado?.ape_paterno || ''} ${v.empleado?.ape_materno || ''}`.trim();
    if (fullName.toLowerCase().includes(query.toLowerCase())) {
      if (!results.some(r => r.Id === v.id)) {
        results.push(formatVacacionesForAdminTable([v])[0]);
      }
    }
  });
  return results;
};

const formatCancellableRequestResult = (item) => {
  return `#${item.Id} - ${item.Empleado} (Periodo: ${item.FechaInicio} - ${item.FechaFin}) - Estado Actual: ${item.Estado}`;
};

const handleCancellableRequestSelected = (item) => {
  selectedRequestToCancel.value = item;
};

const confirmCancelRequest = async () => {
  if (!selectedRequestToCancel.value) return;

  loadingCancelAction.value = true;
  errorCancelAction.value = null;

  try {

    const solicitudId = selectedRequestToCancel.value.Id;
    // Llama al servicio de vacaciones para cancelar la solicitud
    await VacacionesService.cancelar(solicitudId);
    closeCancelModal();
    await cargarSolicitudes(); // Recargar todas las listas después de la acción
  } catch (err) {
    errorCancelAction.value = err.response?.data?.message || err.message || 'Error desconocido al cancelar la solicitud.';
    console.error('Error al cancelar solicitud:', err);
  } finally {
    loadingCancelAction.value = false;
  }
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

// --- Lifecycle Hook ---
onMounted(() => {
  cargarSolicitudes(); // Load all requests on component mount
});
</script>

<style scoped>
/* Scoped styles if any */
</style>