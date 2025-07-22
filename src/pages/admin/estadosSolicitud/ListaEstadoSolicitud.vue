<template>
  <div>
    <div class="my-8 mx-auto text-center">
      <h1 class="text-2xl font-semibold mb-1">Administración de Estados de Solicitud</h1>
      <p class="text-gray-600">Gestiona los diferentes estados que pueden tener las solicitudes.</p>
    </div>

    <div class="my-4">
      <UiButton variant="outline-success" @click="goCreateElement">
        <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nuevo Estado</span>
      </UiButton>
    </div>

    <UiTable :headers="tableHeaders" :data="estadosSolicitudFormatted">
      <template #Id="slotProps">
        <span>{{ slotProps.item.Id }}</span>
      </template>

      <template #Estado="{ item }">
        <strong> {{ item.Estado }}</strong>
      </template>

      <template #Descripción="{ item }">
        <span>{{ item.Descripción }}</span>
      </template>

      <template #FechaCreación="{ item }">
        <span >{{ item.fechaCreación }}</span>
      </template>

      <template #FechaActualización="{ item }">
        <span >{{ item.fechaActualización }}</span>
      </template>

      <template #Acciones="{ item }">
        <div class="w-fit flex gap-1 flex-nowrap">
          <UiButton
            variant="outline-primary"
            size="xs"
            class="mr-1"
            @click="editarEstadoSolicitud(item.originalItem)"
          >
            Editar
          </UiButton>
          <UiButton
            variant="outline-error"
            size="xs"
            @click="confirmarEliminarEstadoSolicitud(item.originalItem)"
          >
            Eliminar
          </UiButton>
        </div>
      </template>
    </UiTable>

    <ModalDynamic
      :isOpen="isDeleteConfirmOpen"
      @update:isOpen="isDeleteConfirmOpen = $event"
      type="error"
      :title="'¿Eliminar estado de solicitud?'"
    >
      <template #body>
        <p class="text-gray-700">
          ¿Estás seguro de que deseas eliminar el estado de solicitud:
          <strong class="mr-1" v-if="estadoSolicitudAEliminarNombre">{{ estadoSolicitudAEliminarNombre }}</strong>
          <strong class="ml-1" v-else>{{ estadoSolicitudAEliminarId }}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </template>
      <template #primary-action>
        <UiButton type="button" variant="error" @click="eliminarEstadoSolicitud">
          Eliminar
        </UiButton>
      </template>
      <template #secondary-action>
        <UiButton type="button" variant="outline-secondary" @click="cancelarEliminar">
          Cancelar
        </UiButton>
      </template>
    </ModalDynamic>

    <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando estados de solicitud...</div>
    <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar los estados de solicitud: {{ error }}</div>
    <div v-if="estadosSolicitud.length === 0 && !cargando && !error" class="text-center py-4 text-gray-500">No hay estados de solicitud registrados.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import UiTable from '../../../components/ui/UiTable.vue';
import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import EstadoSolicitudService from '../../../services/estadoSolicitudService';
import { useRouter } from 'vue-router';
import { formatDate } from '../../../utils/dateFormatter';
import UiButton from '../../../components/ui/UiButton.vue';
import { PlusCircleIcon } from '@heroicons/vue/20/solid';

const router = useRouter();
const estadosSolicitud = ref([]);
const cargando = ref(false);
const error = ref(null);

const isDeleteConfirmOpen = ref(false);
const estadoSolicitudAEliminarId = ref(null);
const estadoSolicitudAEliminarNombre = ref(null);

const goCreateElement = () => {
  router.push({ name: 'crear-estado-solicitud' });
};

const tableHeaders = ['Id', 'Estado', 'Descripción', 'Fecha Creación', 'Fecha Actualización', 'Acciones'];

const cargarEstadosSolicitud = async () => {
  cargando.value = true;
  error.value = null;
  try {
    estadosSolicitud.value = await EstadoSolicitudService.getAll();
  } catch (err) {
    error.value = err;
  } finally {
    cargando.value = false;
  }
};

const estadosSolicitudFormatted = computed(() => {
  return estadosSolicitud.value.map(estado => ({
    Id: estado.id,
    Estado: estado.estado, // Cambiamos 'Nombre' a 'Estado'
    Descripción: estado.descripcion,
    'Fecha Creación': formatDate(estado.created_at),
    'Fecha Actualización': formatDate(estado.updated_at),
    originalItem: estado,
  }));
});

const editarEstadoSolicitud = (originalItem) => {
  router.push({ name: 'editar-estado-solicitud', params: { id: originalItem.id } });
};

const confirmarEliminarEstadoSolicitud = (originalItem) => {
  estadoSolicitudAEliminarId.value = originalItem.id;
  estadoSolicitudAEliminarNombre.value = originalItem.estado; // Cambiamos 'nombre' a 'estado'
  isDeleteConfirmOpen.value = true;
};

const eliminarEstadoSolicitud = async () => {
  try {
    await EstadoSolicitudService.delete(estadoSolicitudAEliminarId.value);
    await cargarEstadosSolicitud();
    isDeleteConfirmOpen.value = false;
  } catch (err) {
    error.value = err;
  } finally {
    estadoSolicitudAEliminarId.value = null;
    estadoSolicitudAEliminarNombre.value = null;
  }
};

const cancelarEliminar = () => {
  isDeleteConfirmOpen.value = false;
  estadoSolicitudAEliminarId.value = null;
  estadoSolicitudAEliminarNombre.value = null;
};

onMounted(cargarEstadosSolicitud);
</script>