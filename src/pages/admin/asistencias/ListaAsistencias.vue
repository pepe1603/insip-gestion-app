<template>
    <div>
      <div class="my-8 mx-auto text-center">
        <h1 class="text-2xl font-semibold mb-1">Administración de Asistencias</h1>
        <p class="text-gray-600">Gestiona los registros de asistencia de los empleados.</p>
      </div>
  
      <div class="my-4 flex justify-between">
        <UiButton variant="outline-success" @click="goCreateAsistencia">
          <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nueva Asistencia</span>
        </UiButton>
      </div>
  
      <UiTable :headers="tableHeaders" :data="asistenciasFormatted">
        <template #Id="slotProps">
          <span>{{ slotProps.item.Id }}</span>
        </template>
  
        <template #Empleado="{ item }">
          <strong>{{ item.Empleado }}</strong>
        </template>
  
        <template #Fecha="{ item }">
          <span class="text-gray-400">{{ item.Fecha }}</span>
        </template>
  
        <template #HoraEntrada="{ item }">
          <span>{{ item.HoraEntrada }}</span>
        </template>
  
        <template #HoraSalida="{ item }">
          <span>{{ item.HoraSalida }}</span>
        </template>
  
        <template #TipoAsistencia="{ item }">
          <span>{{ item.TipoAsistencia }}</span>
        </template>
  
        <template #Observaciones="{ item }">
          <span>{{ item.Observaciones || '-' }}</span>
        </template>
  
        <template #Acciones="{ item }">
          <div class="w-fit flex gap-1 flex-wrap" :class=" 'max-w-sm' ? 'flex-wrap' : 'flex-nowrap' ">
            <UiButton
              variant="outline-primary"
              size="sm"
              class="mr-1"
              @click="editarAsistencia(item.originalItem)"
            >
              Editar
            </UiButton>
            <UiButton
              variant="outline-error"
              size="sm"
              @click="confirmarEliminarAsistencia(item.originalItem)"
            >
              Eliminar
            </UiButton>
          </div>
        </template>
      </UiTable>
  
      <UiPaginator
  :total-items="totalItems"
  :items-per-page="itemsPerPage"
  v-model:page="currentPage"
  :currentPage="currentPage"
  :max-visible-pages="5"
  @update:page="onPageChange"
/>
  
      <ModalDynamic
        :isOpen="isDeleteConfirmOpen"
        @update:isOpen="isDeleteConfirmOpen = $event"
        type="error"
        :title="'¿Eliminar asistencia?'"
      >
        <template #body>
          <p class="text-gray-700">
            ¿Estás seguro de que deseas eliminar la asistencia del empleado:
            <strong class="mr-1">{{ empleadoAEliminarNombreCompleto }}</strong>
            con fecha:
            <strong class="mr-1">{{ fechaAsistenciaAEliminarFormatted }}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </template>
        <template #primary-action>
          <UiButton type="button" variant="error" @click="eliminarAsistencia">
            Eliminar
          </UiButton>
        </template>
        <template #secondary-action>
          <UiButton type="button" variant="outline-secondary" @click="cancelarEliminar">
            Cancelar
          </UiButton>
        </template>
      </ModalDynamic>
  
      <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando asistencias...</div>
      <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar las asistencias: {{ error }}</div>
      <div v-if="asistencias.length === 0 && !cargando && !error" class="text-center py-4 text-gray-500">No hay asistencias registradas.</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import UiButton from '../../../components/ui/UiButton.vue';
  import { PlusCircleIcon } from '@heroicons/vue/20/solid';
  import UiTable from '../../../components/ui/UiTable.vue';
  import UiPaginator from '../../../components/ui/UiPaginator.vue';
  import AsistenciaService from '../../../services/asistenciaService';
  import { useRouter } from 'vue-router';
  import { formatDate } from '../../../utils/dateFormatter';
  import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import { watch } from 'vue';
  
  const router = useRouter();
  const asistencias = ref([]);
  const cargando = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0); // Nuevo ref para el total de items
  
  const isDeleteConfirmOpen = ref(false);
  const asistenciaAEliminarId = ref(null);
  const empleadoAEliminarNombreCompleto = ref(null);
  const fechaAsistenciaAEliminar = ref(null);
  const fechaAsistenciaAEliminarFormatted = computed(() => formatDate(fechaAsistenciaAEliminar.value));
  
  const tableHeaders = ['Id', 'Empleado', 'Fecha', 'HoraEntrada', 'HoraSalida', 'TipoAsistencia', 'Observaciones', 'Acciones'];
  
  const goCreateAsistencia = () => {
    router.push({ name: 'crear-asistencia' });
  };
  
  const cargarAsistencias = async (page = 1) => {
  cargando.value = true;
  error.value = null;
  try {
    const response = await AsistenciaService.getAll({ page, with: 'empleado,tipo_asistencia' });
    console.log('Respuesta de la API en cargarAsistencias:', response);
    asistencias.value = response.data.data;
    totalItems.value = response.data.total;
    console.log('asistencias.value actualizado:', asistencias.value);
    console.log('totalItems.value actualizado:', totalItems.value);
  } catch (err) {
    error.value = err;
  } finally {
    cargando.value = false;
  }
};
  
  
  const asistenciasFormatted = computed(() => {
    return asistencias.value.map(asistencia => ({
      Id: asistencia.id,
      Empleado: `${asistencia.empleado.nombre} ${asistencia.empleado.ape_paterno} ${asistencia.empleado.ape_materno}`,
      Fecha: formatDate(asistencia.fecha),
      HoraEntrada: asistencia.hora_entrada.substring(0, 8), // Extraemos HH:mm:ss
      HoraSalida: asistencia.hora_salida.substring(0, 8),   // Extraemos HH:mm:ss
      TipoAsistencia: asistencia.tipo_asistencia.nombre,
      Observaciones: asistencia.observaciones,
      originalItem: asistencia,
    }));
  });
  
  const editarAsistencia = (originalItem) => {
    router.push({ name: 'editar-asistencia', params: { id: originalItem.id } });
  };
  
  const confirmarEliminarAsistencia = (originalItem) => {
    asistenciaAEliminarId.value = originalItem.id;
    empleadoAEliminarNombreCompleto.value = `${originalItem.empleado.nombre} ${originalItem.empleado.ape_paterno}`;
    fechaAsistenciaAEliminar.value = originalItem.fecha;
    isDeleteConfirmOpen.value = true;
  };
  
  const eliminarAsistencia = async () => {
    try {
      await AsistenciaService.delete(asistenciaAEliminarId.value);
      await cargarAsistencias(currentPage.value); // Recarga la página actual después de eliminar
      isDeleteConfirmOpen.value = false;
      // Aquí podrías mostrar un mensaje de éxito con el toast
    } catch (err) {
      error.value = err;
      // Aquí podrías mostrar un mensaje de error con el toast
    } finally {
      asistenciaAEliminarId.value = null;
      empleadoAEliminarNombreCompleto.value = null;
      fechaAsistenciaAEliminar.value = null;
    }
  };
  
  const cancelarEliminar = () => {
    isDeleteConfirmOpen.value = false;
    asistenciaAEliminarId.value = null;
    empleadoAEliminarNombreCompleto.value = null;
    fechaAsistenciaAEliminar.value = null;
  };

const onPageChange = (page) => {
    console.log('ListaAsistencia - Página cambiada a (onPageChange):', page);
    currentPage.value = page;
    cargarAsistencias(page);
  };

  watch(currentPage, (newPage) => {
    console.log('ListaAsistencia - currentPage actualizado a:', newPage);
  });
  onMounted(() => {
    cargarAsistencias(); // Carga la primera página al montar el componente
  });
  </script>
  
  <style scoped>
  /* Estilos específicos del componente si los hay */
  </style>