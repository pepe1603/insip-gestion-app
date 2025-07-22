<template>
    <div>
      <div class="my-8 mx-auto text-center">
        <h1 class="text-2xl font-semibold mb-1">Administración de Vacaciones Oficiales</h1>
        <p class="text-gray-600">Gestiona las reglas de vacaciones oficiales según el tiempo de servicio.</p>
      </div>

      <UiAlert
        type="info"
        class="mb-6"
        :dismissible="true"
      >
        <p class="text-gray-600">
          Aquí puedes crear, editar y eliminar reglas de vacaciones oficiales. Estas reglas determinan los días de vacaciones que corresponden a cada empleado según su tiempo de servicio.
        </p>
      </UiAlert>
      <!-- informar que aun esta en beta-->
       <UiAlert
        type="purple-power"
        class="mb-6"
        :dismissible="true"
      >
        <p class="text-gray-600">
          Esta funcionalidad aún está en beta. Puede haber errores o comportamientos inesperados.
        </p>
      </UiAlert>

      <div class="my-4">
        <UiButton variant="outline-success" @click="goCreateElement">
          <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nueva Regla</span>
        </UiButton>
      </div>
  
      <UiTable :headers="tableHeaders" :data="vacacionesOficialesFormatted">
        <template #Id="slotProps">
          <span>{{ slotProps.item.Id }}</span>
        </template>
  
        <template #TiempoServicio="{ item }">
          <strong>{{ item.TiempoServicio || 'N/A' }}</strong>
        </template>
  
        <template #DiasVacaciones="{ item }">
          <strong>{{ item.DiasVacaciones || 'N/A' }}</strong>
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
              @click="editarVacacionOficial(item.originalItem)"
            >
              Editar
            </UiButton>
            <UiButton
              variant="outline-error"
              size="xs"
              @click="confirmarEliminarVacacionOficial(item.originalItem)"
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
        :title="'¿Eliminar regla de vacación oficial?'"
      >
        <template #body>
          <p class="text-gray-700">
            ¿Estás seguro de que deseas eliminar la regla de vacación oficial para el tiempo de servicio:
            <strong class="mr-1" v-if="vacacionOficialAEliminarTiempoServicio">{{ vacacionOficialAEliminarTiempoServicio }}</strong>
            <strong class="ml-1" v-else>{{ vacacionOficialAEliminarId }}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </template>
        <template #primary-action>
          <UiButton type="button" variant="error" @click="eliminarVacacionOficial">
            Eliminar
          </UiButton>
        </template>
        <template #secondary-action>
          <UiButton type="button" variant="outline-secondary" @click="cancelarEliminar">
            Cancelar
          </UiButton>
        </template>
      </ModalDynamic>
  
      <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando reglas de vacaciones oficiales...</div>
      <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar las reglas de vacaciones oficiales: {{ error }}</div>
      <div v-if="vacacionesOficiales.length === 0 && !cargando && !error" class="text-center py-4 text-gray-500">No hay reglas de vacaciones oficiales registradas.</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import UiTable from '../../../components/ui/UiTable.vue';
  import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
  import VacacionesOficialesService from '../../../services/vacacionesOficialesService'; // Importa el servicio
  import { useRouter } from 'vue-router';
  import { formatDate } from '../../../utils/dateFormatter';
  import UiButton from '../../../components/ui/UiButton.vue';
  import { PlusCircleIcon } from '@heroicons/vue/20/solid';
import UiAlert from '../../../components/ui/UiAlert.vue';
  
  const router = useRouter();
  const vacacionesOficiales = ref([]);
  const cargando = ref(false);
  const error = ref(null);
  
  const isDeleteConfirmOpen = ref(false);
  const vacacionOficialAEliminarId = ref(null);
  const vacacionOficialAEliminarTiempoServicio = ref(null);
  
  const goCreateElement = () => {
    router.push({ name: 'crear-vacacion-oficial' });
  };
  
  const tableHeaders = ['Id', 'TiempoServicio', 'DiasVacaciones', 'Fecha Creación', 'Fecha Actualización', 'Acciones'];
  
  const cargarVacacionesOficiales = async () => {
    cargando.value = true;
    error.value = null;
    try {
      vacacionesOficiales.value = await VacacionesOficialesService.getAll();
    } catch (err) {
      error.value = err;
    } finally {
      cargando.value = false;
    }
  };
  
  const vacacionesOficialesFormatted = computed(() => {
    return vacacionesOficiales.value.map(vacacion => ({
      Id: vacacion.id,
      'TiempoServicio': vacacion.tiempo_servicio,
      'DiasVacaciones': vacacion.dias_vacaciones,
      'Fecha Creación': formatDate(vacacion.created_at),
      'Fecha Actualización': formatDate(vacacion.updated_at),
      originalItem: vacacion,
    }));
  });
  
  const editarVacacionOficial = (originalItem) => {
    router.push({ name: 'editar-vacacion-oficial', params: { id: originalItem.id } });
  };
  
  const confirmarEliminarVacacionOficial = (originalItem) => {
    vacacionOficialAEliminarId.value = originalItem.id;
    vacacionOficialAEliminarTiempoServicio.value = originalItem.tiempo_servicio;
    isDeleteConfirmOpen.value = true;
  };
  
  const eliminarVacacionOficial = async () => {
    try {
      await VacacionesOficialesService.delete(vacacionOficialAEliminarId.value);
      await cargarVacacionesOficiales();
      isDeleteConfirmOpen.value = false;
    } catch (err) {
      error.value = err;
    } finally {
      vacacionOficialAEliminarId.value = null;
      vacacionOficialAEliminarTiempoServicio.value = null;
    }
  };
  
  const cancelarEliminar = () => {
    isDeleteConfirmOpen.value = false;
    vacacionOficialAEliminarId.value = null;
    vacacionOficialAEliminarTiempoServicio.value = null;
  };
  
  onMounted(cargarVacacionesOficiales);
  </script>