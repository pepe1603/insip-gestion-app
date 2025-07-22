<template>
  <div>


    <div class="my-8 mx-auto text-center">
        <h1 class="text-2xl font-semibold mb-1">Lorem ipsum dolor sit amet consectetur.</h1>
        <p class="text-gray-600">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque, in d323 ?</p>
      </div>

    <div class="my-4">

      <ui-button variant="outline-success" @click="goCreateElement">
      <PlusCircleIcon class="w-6 h-6 mr-2" /> <span> Crear Nuevo Tipo</span>
      </ui-button>


    </div>
    
  <UiTable :headers="tableHeaders" :data="tiposAsistenciaFormatted">
      <template #Id="slotProps">
        <span>{{ slotProps.item.Id }}</span>
      </template>

      <template #Nombre="{ item }">
        <strong> {{ item.Nombre }}</strong>
      </template>

      <template #Descripción="{ item }">
        <span >{{ item.Descripción }}</span>
      </template>

      <template #FechaCreación="{ item }">
        <span>{{ item.fechaCreación }}</span>
      </template>

      <template #FechaActualización="{ item }">
        <span >{{ item.fechaActualización }}</span>
      </template>

      <template #Acciones="{ item }" >
        <div class="w-fit flex gap-1 flex-nowrap">
          <UiButton
          variant="outline-primary"
          size="xs"
          class="mr-1"
          @click="editarTipo(item.originalItem)"
        >
          Editar
        </UiButton>
        <UiButton
          variant="outline-error"
          size="xs"
          @click="confirmarEliminarTipo(item.originalItem)"
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
      :title="'¿Eliminar tipo de asistencia?'"
    >
      <template #body>
        <p class="text-gray-700">
          ¿Estás seguro de que deseas eliminar el tipo de asistencia:
          <strong class="mr-1" v-if="tipoAEliminarNombre">{{ tipoAEliminarNombre }}</strong>
          <strong class="ml-1" v-else>{{ tipoAEliminarId }}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </template>
      <template #primary-action>
        <UiButton
          type="button"
          variant="error"
          @click="eliminarTipo"
        >
          Eliminar
        </UiButton>
      </template>
      <template #secondary-action>
        <UiButton
          type="button"
          variant="outline-secondary"
          @click="cancelarEliminar"
        >
          Cancelar
        </UiButton>
      </template>
    </ModalDynamic>

    <div v-if="cargando" class="text-center py-4 text-gray-500">Cargando tipos de asistencia...</div>
    <div v-if="error" class="text-red-500 py-4 text-center">Error al cargar los tipos de asistencia: {{ error }}</div>
    <div v-if="tiposAsistencia.length === 0 && !cargando && !error" class="text-center py-4 text-gray-500">No hay tipos de asistencia registrados.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import UiTable from '../../../components/ui/UiTable.vue';
import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import TiposAsistenciaService from '../../../services/tiposAsistenciaService';
import { useRouter } from 'vue-router';
import { formatDate } from '../../../utils/dateFormatter';
import UiButton from '../../../components/ui/UiButton.vue'; // Asegúrate de que la ruta sea correcta
import { InformationCircleIcon, PlusCircleIcon } from '@heroicons/vue/20/solid';


const router = useRouter();
const tiposAsistencia = ref([]);
const cargando = ref(false);
const error = ref(null);


const isDeleteConfirmOpen = ref(false);
const tipoAEliminarId = ref(null);
const tipoAEliminarNombre = ref(null);

//metod para redirigir a cvrear nueco 
const goCreateElement = ()=> {
  router.push({  name: 'crear-tipo-asistencia' });
};

// Definimos los encabezados de la tabl
const tableHeaders = ['Id', 'Nombre', 'Descripción', 'Fecha Creación', 'Fecha Actualización', 'Acciones'];

const cargarTiposAsistencia = async () => {
  cargando.value = true;
  error.value = null;
  try {
    tiposAsistencia.value = await TiposAsistenciaService.getAll();
  } catch (err) {
    error.value = err;
  } finally {
    cargando.value = false;
  }
};

// Formateamos los datos de la tabla usando la función formatDate
const tiposAsistenciaFormatted = computed(() => {
  return tiposAsistencia.value.map(tipo => ({
    Id: tipo.id,
    Nombre: tipo.nombre,
    Descripción: tipo.descripcion,
    'Fecha Creación': formatDate(tipo.created_at),
    'Fecha Actualización': formatDate(tipo.updated_at),
    originalItem: tipo
  }));
});

const editarTipo = (originalItem) => {
  router.push({ name: 'editar-tipo-asistencia', params: { id: originalItem.id } });
};

const confirmarEliminarTipo = (originalItem) => {
  tipoAEliminarId.value = originalItem.id;
  tipoAEliminarNombre.value = originalItem.nombre;
  isDeleteConfirmOpen.value = true;
};

const eliminarTipo = async () => {
  try {
    await TiposAsistenciaService.delete(tipoAEliminarId.value);
    await cargarTiposAsistencia();
    isDeleteConfirmOpen.value = false;
    // Aquí podrías mostrar un mensaje de éxito usando el toast
  } catch (err) {
    error.value = err;
    // Aquí podrías mostrar un mensaje de error usando el toast
  } finally {
    tipoAEliminarId.value = null;
    tipoAEliminarNombre.value = null;
  }
};

const cancelarEliminar = () => {
  isDeleteConfirmOpen.value = false;
  tipoAEliminarId.value = null;
  tipoAEliminarNombre.value = null;
};

onMounted(cargarTiposAsistencia);
</script>