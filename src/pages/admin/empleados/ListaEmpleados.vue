<template>
    <div>
      <div class="my-8 mx-auto text-center">
        <h1 class="text-2xl font-semibold mb-1">Administración de Empleados</h1>
        <p class="text-gray-600">Gestiona la información de los empleados de la empresa.</p>
      </div>
  
      <div class="my-4 flex justify-between">
        <UiButton variant="outline-success" @click="goCreateElement">
          <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nuevo Empleado</span>
        </UiButton>
        </div>
  
      <UiTable :headers="tableHeaders" :data="empleadosFormatted">
        <template #Id="slotProps">
          <span>{{ slotProps.item.Id }}</span>
        </template>
  
        <template #NombreCompleto="{ item }">
          <strong>{{ item.Nombre }} {{ item.ApellidoPaterno }} {{ item.ApellidoMaterno }}</strong>
        </template>
  
        <template #FechaIngreso="{ item }">
          <span class="text-gray-400">{{ item.FechaIngreso }}</span>
        </template>
  
        <template #Puesto="{ item }">
          <span>{{ item.Puesto }}</span>
        </template>
  
        <template #Departamento="{ item }">
          <span>{{ item.Departamento }}</span>
        </template>
  
        <template #Status="{ item }">
          <UiBadge :color="item.Status === 'ACTIVO' ? 'green' : 'red'" :text="item.Status" >
          </UiBadge>
        </template>
  
        <template #TipoContrato="{ item }">
          <span>{{ item.TipoContrato.replace('_', ' ').toLowerCase() }}</span>
        </template>
  
        <template #Acciones="{ item }">
          <div class="w-fit flex gap-1 flex-wrap" :class=" 'max-w-sm' ? 'flex-wrap' : 'flex-nowrap' ">
            <UiButton
              variant="outline-primary"
              size="small"
              class="mr-1"
              @click="editarEmpleado(item.originalItem)"
            >
              Editar
            </UiButton>
            <UiButton
              variant="outline-warning"
              size="small"
              class="mr-1"
              @click="cambiarEstadoEmpleado(item.originalItem)"
            >
              {{ item.Status === 'ACTIVO' ? 'Desactivar' : 'Activar' }}
            </UiButton>
            <UiButton
              variant="outline-error"
              size="small"
              @click="confirmarEliminarEmpleado(item.originalItem)"
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
        :title="'¿Eliminar empleado?'"
      >
        <template #body>
          <p class="text-gray-700">
            ¿Estás seguro de que deseas eliminar al empleado:
            <strong class="mr-1">{{ empleadoAEliminarNombreCompleto }}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </template>
        <template #primary-action>
          <UiButton type="button" variant="error" @click="eliminarEmpleado">
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
        :isOpen="isStatusChangeOpen"
        @update:isOpen="isStatusChangeOpen = $event"
        :title="statusCambioTitulo"
        :type="statusCambioTipo"
      >
        <template #body>
          <p class="text-gray-700">
            ¿Estás seguro de que deseas
            <strong v-if="empleadoACambiarEstado">{{ empleadoACambiarEstado.status === 'ACTIVO' ? 'desactivar' : 'activar' }}</strong>
            al empleado
            <strong v-if="empleadoACambiarEstado">{{ empleadoACambiarEstado.nombre }} {{ empleadoACambiarEstado.ape_paterno }}</strong>?
          </p>
        </template>
        <template #primary-action>
          <UiButton type="button" :variant="statusCambioTipo" @click="actualizarEstadoEmpleado">
            {{ empleadoACambiarEstado?.status === 'ACTIVO' ? 'Desactivar' : 'Activar' }}
          </UiButton>
        </template>
        <template #secondary-action>
          <UiButton type="button" variant="outline-secondary" @click="cancelarCambioEstado">
            Cancelar
          </UiButton>
        </template>
      </ModalDynamic>
  
      <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando empleados...</div>
      <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar los empleados: {{ error }}</div>
      <div v-if="empleados.length === 0 && !cargando && !error" class="text-center py-4 text-gray-500">No hay empleados registrados.</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import UiTable from '../../../components/ui/UiTable.vue';
  import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
  import EmpleadoService from '../../../services/empleadoService'; // Importa el servicio
  import { useRouter } from 'vue-router';
  import { formatDate } from '../../../utils/dateFormatter';
  import UiButton from '../../../components/ui/UiButton.vue';
  import UiBadge from '../../../components/ui/UiBadge.vue';
  import { PlusCircleIcon } from '@heroicons/vue/20/solid';
  
  const router = useRouter();
  const empleados = ref([]);
  const cargando = ref(false);
  const error = ref(null);
  
  const isDeleteConfirmOpen = ref(false);
  const empleadoAEliminarId = ref(null);
  const empleadoAEliminarNombreCompleto = ref(null);
  
  const isStatusChangeOpen = ref(false);
  const empleadoACambiarEstado = ref(null);
  const statusCambioTitulo = ref('');
  const statusCambioTipo = ref('');
  
  const goCreateElement = () => {
    router.push({ name: 'crear-empleado' });
  };
  
  const tableHeaders = ['Id', 'NombreCompleto', 'FechaIngreso', 'Puesto', 'Departamento', 'Status', 'TipoContrato', 'Acciones'];
  
  const cargarEmpleados = async () => {
    cargando.value = true;
    error.value = null;
    try {
      empleados.value = await EmpleadoService.getAll({ with: 'departamento' });
    } catch (err) {
      error.value = err;
    } finally {
      cargando.value = false;
    }
  };
  
  const empleadosFormatted = computed(() => {
    return empleados.value.map(empleado => ({
      Id: empleado.id,
      Nombre: empleado.nombre,
      ApellidoPaterno: empleado.ape_paterno,
      ApellidoMaterno: empleado.ape_materno,
      FechaIngreso: formatDate(empleado.fecha_ingreso),
      Puesto: empleado.puesto,
      Departamento: empleado.departamento?.nombre || 'Sin departamento',
      'Status': empleado.status,
      TipoContrato: empleado.tipo_contrato,
      originalItem: empleado,
    }));
  });
  
  const editarEmpleado = (originalItem) => {
    router.push({ name: 'editar-empleado', params: { id: originalItem.id } });
  };
  
  const confirmarEliminarEmpleado = (originalItem) => {
    empleadoAEliminarId.value = originalItem.id;
    empleadoAEliminarNombreCompleto.value = `${originalItem.nombre} ${originalItem.ape_paterno} ${originalItem.ape_materno}`;
    isDeleteConfirmOpen.value = true;
  };
  
  const eliminarEmpleado = async () => {
    try {
      await EmpleadoService.delete(empleadoAEliminarId.value);
      await cargarEmpleados();
      isDeleteConfirmOpen.value = false;
      // Aquí podrías mostrar un mensaje de éxito usando el toast
    } catch (err) {
      error.value = err;
      // Aquí podrías mostrar un mensaje de error usando el toast
    } finally {
      empleadoAEliminarId.value = null;
      empleadoAEliminarNombreCompleto.value = null;
    }
  };
  
  const cancelarEliminar = () => {
    isDeleteConfirmOpen.value = false;
    empleadoAEliminarId.value = null;
    empleadoAEliminarNombreCompleto.value = null;
  };
  
  const cambiarEstadoEmpleado = (empleado) => {
    empleadoACambiarEstado.value = empleado;
    statusCambioTitulo.value = `¿${empleado.status === 'ACTIVO' ? 'Desactivar' : 'Activar'} empleado?`;
    statusCambioTipo.value = empleado.status === 'ACTIVO' ? 'warning' : 'success';
    isStatusChangeOpen.value = true;
  };
  
  const actualizarEstadoEmpleado = async () => {
    if (empleadoACambiarEstado.value) {
      try {
        const nuevoStatus = empleadoACambiarEstado.value.status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
        await EmpleadoService.cambiarStatus(empleadoACambiarEstado.value.id, nuevoStatus);
        await cargarEmpleados();
        isStatusChangeOpen.value = false;
        empleadoACambiarEstado.value = null;
        // Aquí podrías mostrar un mensaje de éxito
      } catch (error) {
        error.value = error;
        // Aquí podrías mostrar un mensaje de error
      }
    }
  };
  
  const cancelarCambioEstado = () => {
    isStatusChangeOpen.value = false;
    empleadoACambiarEstado.value = null;
  };
  
  onMounted(cargarEmpleados);
  </script>