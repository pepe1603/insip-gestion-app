<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-1 text-center">{{ modalTitle }}</h1>
    <p class="text-gray-600 mb-6 text-center">{{ modalSubtitle }}</p>

    <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div class="mb-6 min-h-40 border-b pb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ¿Cómo deseas seleccionar al empleado?
        </label>
        <div class="flex items-center space-x-4 mb-4">
          <UiRadioButton
            id="radio-select"
            label="Usar Lista (Dropdown)"
            value="select"
            v-model="employeeSelectionMethod"
            :disabled="modo === 'editar'" />
          <UiRadioButton
            id="radio-search"
            label="Usar Búsqueda Avanzada"
            value="search"
            v-model="employeeSelectionMethod"
            :disabled="modo === 'editar'" />
        </div>

        <div v-if="cargandoRelaciones" class="text-center text-gray-500">Cargando empleados...</div>
        <div v-else-if="errorRelaciones" class="text-red-500 text-center">Error al cargar empleados: {{ errorRelaciones.message || errorRelaciones }}</div>
        <div v-else>
          <div v-if="employeeSelectionMethod === 'select'">
            <UiSelect
              v-model="formValues.empleado_id"
              :options="empleadoOptions"
              placeholder="Selecciona un empleado"
              label="Empleado:"
              :required="true"
              :disabled="modo === 'editar'" />
          </div>
          <div v-else-if="employeeSelectionMethod === 'search'">
            <UiInputSearchWithResults
              placeholder="Escribe para buscar un empleado..."
              label="Buscar Empleado:"
              :searchServiceMethod="searchEmployees"
              :formatResult="formatEmployeeResult"
              resultKey="id"
              @selected="handleEmployeeSelected"
              v-model="employeeSearchTerm"
              :disabled="modo === 'editar'" >
              <template #icon>
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </template>
            </UiInputSearchWithResults>

            <p v-if="formValues.empleado_id" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Empleado seleccionado: <strong>{{ getSelectedEmployeeName }}</strong>
            </p>
            <p v-else-if="employeeSelectionMethod === 'search' && !cargandoRelaciones && !formValues.empleado_id" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Ningún empleado seleccionado.
            </p>
          </div>
        </div>
      </div>

      <CrearEditarFormDinamico
        title=""
        :fields="formFields"
        :initialValues="formValues"
        :saveButtonText="saveButtonText"
        @submit-form="guardarVacacion"
        :loading="cargandoRelaciones"
        :error="errorRelaciones"
        @cancel="cancelar"
      >
        <template #dias_solicitados_display>
          
          <UiInputNumber
            label="Días Solicitados (Estimado):"
            :modelValue="calculatedDays"
            :disabled="true"
            class="mt-4"
          />
          <span class="text-sm font-semibold  text-orange-800"> aun se encuentra en beta</span>
        </template>
      </CrearEditarFormDinamico>
    </div>
  </div>

  <!-- modal de informacion para prevenir uso de dias solicitados incluyendo los dias feriados-->
  <ModalDynamic :isOpen="modalOpen"
    title="Información Importante"
    content="Los días solicitados incluyen los días feriados y no se pueden modificar una vez enviados. Por lo tanto deberias verificar las fechas en que realizas la solicitud."
    type="informative"
  >

   <template #primary-action>
      <UiButton type="button" variant="outline-info" @click="modalOpen = false">
        Cerrar
      </UiButton>
    </template>
  </ModalDynamic>


</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import VacacionesService from '../../../services/vacacionesService';
import EmpleadoService from '../../../services/empleadoService';
import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
import UiSelect from '../../../components/ui/UiSelect.vue';
import UiInputSearchWithResults from '../../../components/ui/UiInputSearchWithResults.vue';
import UiRadioButton from '../../../components/ui/UiRadioButton.vue';
import UiInputNumber from '../../../components/ui/UiInputNumber.vue'; // Asegurada la importación
import UiTextarea from '../../../components/ui/UiTextArea.vue'; // Asegurada la importación para observaciones

import { differenceInDays, parseISO, format } from 'date-fns';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { useToastService } from '../../../services/toastService';
import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import UiButton from '../../../components/ui/UiButton.vue';

const router = useRouter();
const route = useRoute();

const modalOpen = ref(false); // Para el modal de información

const modo = computed(() => route.name === 'editar-vacacion' ? 'editar' : 'crear');

const formValues = ref({
  empleado_id: null,
  fecha_inicio: null, //format(new Date(), 'yyyy-MM-dd'),
  fecha_fin: null, //format(new Date(), 'yyyy-MM-dd'),
  observaciones: '', // Añadido para el campo de observaciones
});

const modalTitle = computed(() => (modo.value === 'editar' ? 'Editar Solicitud de Vacación' : 'Crear Nueva Solicitud de Vacación'));
const modalSubtitle = computed(() => (modo.value === 'editar' ? 'Modifica los detalles de la solicitud de vacación.' : 'Ingresa los detalles para crear una nueva solicitud de vacación.'));
const saveButtonText = computed(() => (modo.value === 'editar' ? 'Guardar Cambios' : 'Crear Solicitud'));

const empleados = ref([]);
const empleadoOptions = computed(() => empleados.value.map(empleado => ({
  label: `${empleado.nombre} ${empleado.ape_paterno} ${empleado.ape_materno}`,
  value: empleado.id
})));

const employeeSelectionMethod = ref('select'); // 'select' o 'search', valor inicial

const employeeSearchTerm = ref('');

const getSelectedEmployeeName = computed(() => {
  if (formValues.value.empleado_id) {
    const selected = empleados.value.find(emp => emp.id === formValues.value.empleado_id);
    return selected ? `${selected.nombre} ${selected.ape_paterno} ${selected.ape_materno}` : 'Empleado no encontrado';
  }
  return '';
});

const searchEmployees = async (searchTerm) => {
  try {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return empleados.value.filter(emp =>
      emp.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.ape_paterno.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.ape_materno.toLowerCase().includes(lowerCaseSearchTerm)
    );
  } catch (err) {
    console.error('Error buscando empleados:', err);
    return [];
  }
};

const formatEmployeeResult = (item) => {
  return `${item.nombre} ${item.ape_paterno} ${item.ape_materno}`;
};

const handleEmployeeSelected = (selectedEmployee) => {
  formValues.value.empleado_id = selectedEmployee.id;
};


// Computed property para calcular los días
const calculatedDays = computed(() => {
  if (formValues.value.fecha_inicio && formValues.value.fecha_fin) {
    const start = parseISO(formValues.value.fecha_inicio);
    const end = parseISO(formValues.value.fecha_fin);
    // Calcula la diferencia en días. Añade 1 para incluir ambos días (inicio y fin).
    const days = differenceInDays(end, start);
    return days >= 0 ? days + 1 : 0; // Asegúrate de que no sea negativo
  }
  return 0; // Si alguna fecha falta, los días son 0
});

// Watcher para actualizar formValues.dias_vacaciones_solicitados
// cada vez que calculatedDays cambie.
watch(calculatedDays, (newDays) => {
  // Actualiza el campo dias_vacaciones_solicitados para visulaizar losd ias calculados cuando cambien las fechas pero no se envia en el submit
  calculatedDays.value = newDays;
  formValues.value.dias_vacaciones_solicitados = newDays; // Asegúrate de que este campo exista en formValues
}, { immediate: true }); // `immediate: true` para que se calcule al inicio también


const formFields = ref([
  { type: 'date', model: 'fecha_inicio', label: 'Fecha de Inicio:', required: true },
  { type: 'date', model: 'fecha_fin', label: 'Fecha de Fin:', required: true },
  { type: 'slot', name: 'dias_solicitados_display' },
  { type: 'textarea', model: 'observaciones', label: 'Observaciones:', placeholder: 'Ingrese observaciones (opcional)' },
]);

const cargandoRelaciones = ref(false);
const errorRelaciones = ref(null);

const cargarRelaciones = async () => {
  cargandoRelaciones.value = true;
  errorRelaciones.value = null;
  try {
    const allEmployees = await EmpleadoService.getAll();
    empleados.value = allEmployees.map(emp => ({
      ...emp,
      nombreCompleto: `${emp.nombre} ${emp.ape_paterno} ${emp.ape_materno}`
    }));

  } catch (err) {
    errorRelaciones.value = err;
  } finally {
    cargandoRelaciones.value = false;
  }
};

const cargarVacacion = async (id) => {
  try {
    const vacacion = await VacacionesService.getById(id);
    if (vacacion) {
      formValues.value = {
        empleado_id: vacacion.empleado_id,
        fecha_inicio: vacacion.fecha_inicio,
        fecha_fin: vacacion.fecha_fin,
        observaciones: vacacion.observaciones || '', // Asegurarse de que el campo observaciones exista en la respuesta
      };

      // Si estamos editando y el empleado_id se carga,
      // inicializamos el método de selección en 'select'
      // para que el select muestre el empleado directamente,
      // o 'search' si preferimos que se pre-llene la barra de búsqueda.
      if (formValues.value.empleado_id) {
        employeeSelectionMethod.value = 'select'; // Puedes cambiar a 'search' si lo prefieres por defecto al editar
      }
    } else {
      router.push({ name: 'lista-vacaciones' });
    }
  } catch (error) {
    console.error('Error al cargar la solicitud de vacación:', error);
    router.push({ name: 'lista-vacaciones' });
  }
};

const cancelar = () => {
  router.push({ name: 'lista-vacaciones' });
};

const guardarVacacion = async (formData) => {
  const dataToSend = {
    empleado_id: formValues.value.empleado_id,
    fecha_inicio: formData.fecha_inicio, //formData.fecha_inicio,
    fecha_fin: formData.fecha_fin, //formData.fecha_fin,
    observaciones: formData.observaciones, // Incluidas las observaciones
    
  };

  try {
    if (!dataToSend.empleado_id) {
      //alert('Por favor, selecciona un empleado.');
      useToastService.warning('Por favor, selecciona un empleado.');
      return;
    }
    if (modo.value === 'editar' && route.params.id) {
      await VacacionesService.update(route.params.id, dataToSend);
    } else if (modo.value === 'crear') {
      //loagear datrs antes de nevio
      console.log('Datos a enviar:', dataToSend);
      await VacacionesService.create(dataToSend);
    }
    router.push({ name: 'lista-vacaciones' });
  } catch (error) {
    console.error('Error al guardar la solicitud de vacación:', error);
    // Aquí puedes añadir lógica para mostrar un mensaje de error al usuario
  }
};

onMounted(() => {
  cargarRelaciones();
  if (modo.value === 'editar' && route.params.id) {
    cargarVacacion(route.params.id);
  }
});

watch(employeeSelectionMethod, (newMethod, oldMethod) => {
  if (newMethod !== oldMethod && modo.value !== 'editar') {
    // Solo resetea el empleado_id y el término de búsqueda si NO estamos editando
    // y si el método de selección ha cambiado
    // formValues.value.empleado_id = null; // Descomenta si quieres resetear el ID
    employeeSearchTerm.value = '';
  }
});

// Este watcher se ejecuta al cargar y cada vez que cambian las dependencias
watch([() => formValues.value.empleado_id, employeeSelectionMethod, empleados], ([newId, newMethod, currentEmployees]) => {
  // Solo pre-llena el campo de búsqueda si estamos en modo edición,
  // si ya hay un empleado_id, si el método es 'search',
  // y si la lista de empleados ya se cargó.
  if (modo.value === 'editar' && newId && newMethod === 'search' && currentEmployees.length > 0) {
    employeeSearchTerm.value = getSelectedEmployeeName.value;
  }
}, { immediate: true });


onMounted(() => {
  modalOpen.value = true; // Asegúrate de que el modal esté cerrado al inicio
  // Si estás en modo edición, puedes abrir el modal automáticamente
})


</script>

<style scoped>
/* Estilos específicos del componente si los hay */
</style>
