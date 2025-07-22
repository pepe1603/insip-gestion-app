<template>
    <div>
      <div class="my-8 mx-auto text-center">
        <h1 class="text-2xl font-semibold mb-1">Administración de Departamentos</h1>
        <p class="text-gray-600">Gestiona los departamentos de tu organización.</p>
      </div>
  
      <div class="my-4">
        <UiButton variant="outline-success" @click="goCreateElement">
          <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nuevo Departamento</span>
        </UiButton>
        </div>
  
      <UiTable :headers="tableHeaders" :data="departamentosFormatted">
        <template #Id="slotProps">
          <span>{{ slotProps.item.Id }}</span>
        </template>
  
        <template #Nombre="{ item }">
          <strong> {{ item.Nombre }}</strong>
        </template>
  
        <template #Descripción="{ item }">
          <span>{{ item.Descripción }}</span>
        </template>
  
        <template #FechaCreación="{ item }">
          <span >{{ item.fechaCreación }}</span>
        </template>
  
        <template #FechaActualización="{ item }">
          <span>{{ item.fechaActualización }}</span>
        </template>
  
        <template #Acciones="{ item }">
          <div class="w-fit flex gap-1 flex-nowrap">
            <UiButton
              variant="outline-primary"
              size="xs"
              class="mr-1"
              @click="editarDepartamento(item.originalItem)"
            >
              Editar
            </UiButton>
            <UiButton
              variant="outline-error"
              size="xs"
              @click="confirmarEliminarDepartamento(item.originalItem)"
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
        :title="'¿Eliminar departamento?'"
      >
        <template #body>
          <p class="text-gray-700">
            ¿Estás seguro de que deseas eliminar el departamento:
            <strong class="mr-1" v-if="departamentoAEliminarNombre">{{ departamentoAEliminarNombre }}</strong>
            <strong class="ml-1" v-else>{{ departamentoAEliminarId }}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </template>
        <template #primary-action>
          <UiButton type="button" variant="error" @click="eliminarDepartamento">
            Eliminar
          </UiButton>
        </template>
        <template #secondary-action>
          <UiButton type="button" variant="outline-secondary" @click="cancelarEliminar">
            Cancelar
          </UiButton>
        </template>
      </ModalDynamic>
  
      <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando departamentos...</div>
      <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar los departamentos: {{ error }}</div>
      <div v-if="departamentos.length === 0 && !cargando && !error" class="text-center py-4 text-gray-500">No hay departamentos registrados.</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import UiTable from '../../../components/ui/UiTable.vue';
  import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
  import DepartamentosService from '../../../services/departamentosService';
  import { useRouter } from 'vue-router';
  import { formatDate } from '../../../utils/dateFormatter';
  import UiButton from '../../../components/ui/UiButton.vue';
  import { PlusCircleIcon } from '@heroicons/vue/20/solid';
  
  const router = useRouter();
  const departamentos = ref([]);
  const cargando = ref(false);
  const error = ref(null);
  
  const isDeleteConfirmOpen = ref(false);
  const departamentoAEliminarId = ref(null);
  const departamentoAEliminarNombre = ref(null);
  
  const goCreateElement = () => {
    router.push({ name: 'crear-deepartamento' });
  };
  
  const tableHeaders = ['Id', 'Nombre', 'Descripción', 'Fecha Creación', 'Fecha Actualización', 'Acciones'];
  
  const cargarDepartamentos = async () => {
    cargando.value = true;
    error.value = null;
    try {
      departamentos.value = await DepartamentosService.getAll();
    } catch (err) {
      error.value = err;
    } finally {
      cargando.value = false;
    }
  };
  
  const departamentosFormatted = computed(() => {
    return departamentos.value.map(departamento => ({
      Id: departamento.id,
      Nombre: departamento.nombre,
      Descripción: departamento.descripcion,
      'Fecha Creación': formatDate(departamento.created_at),
      'Fecha Actualización': formatDate(departamento.updated_at),
      originalItem: departamento,
    }));
  });
  
  const editarDepartamento = (originalItem) => {
    router.push({ name: 'editar-tipo-asistencia', params: { id: originalItem.id } });
  };
  
  const confirmarEliminarDepartamento = (originalItem) => {
    departamentoAEliminarId.value = originalItem.id;
    departamentoAEliminarNombre.value = originalItem.nombre;
    isDeleteConfirmOpen.value = true;
  };
  
  const eliminarDepartamento = async () => {
    try {
      await DepartamentosService.delete(departamentoAEliminarId.value);
      await cargarDepartamentos();
      isDeleteConfirmOpen.value = false;
      // Aquí podrías mostrar un mensaje de éxito usando el toast
    } catch (err) {
      error.value = err;
      // Aquí podrías mostrar un mensaje de error usando el toast
    } finally {
      departamentoAEliminarId.value = null;
      departamentoAEliminarNombre.value = null;
    }
  };
  
  const cancelarEliminar = () => {
    isDeleteConfirmOpen.value = false;
    departamentoAEliminarId.value = null;
    departamentoAEliminarNombre.value = null;
  };
  
  onMounted(cargarDepartamentos);
  </script>