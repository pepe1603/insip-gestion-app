<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-1 text-center">{{ modalTitle }}</h1>
    <p class="text-gray-600 mb-6 text-center">{{ modalSubtitle }}</p>

    <UiAlert
      v-if="['crear', 'editar'].includes(modo)"
      type="warning"
      class="mb-6 max-w-xl mx-auto"
      :show-icon="true"
    >
      <p class="font-semibold">Importante:</p>
      <p>Los días solicitados incluyen días feriados, sábados, domingos y días no laborales. Por favor, elige tus fechas con cuidado.</p>
    </UiAlert>

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
          <div v-if="modo === 'editar'" class="mt-4">
            <p class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Días Solicitados (Estimado):
              <span class="text-lg font-bold text-blue-600 dark:text-blue-400 ml-2">
                {{ calculatedDays }}
              </span>
            </p>
          </div>
        </template>
      </CrearEditarFormDinamico>
    </div>
  </div>

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
import EmpleadoService from '../../../services/empleadoService';
import CrearEditarFormDinamico from '../../../components/forms/CreateEdithFormDynamic.vue';
import UiSelect from '../../../components/ui/UiSelect.vue';
import UiInputSearchWithResults from '../../../components/ui/UiInputSearchWithResults.vue';
import UiRadioButton from '../../../components/ui/UiRadioButton.vue';
// Elimina la importación de UiInputNumber ya que no se usará directamente
// import UiInputNumber from '../../../components/ui/UiInputNumber.vue';
import UiTextarea from '../../../components/ui/UiTextArea.vue';

import { differenceInDays, parseISO, format } from 'date-fns';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
// import { useToastService } from '../../../services/toastService'; // Generalmente no se usa directamente aquí si tienes useGlobalToast
import ModalDynamic from '../../../components/modals/ModalDynamic.vue';
import UiButton from '../../../components/ui/UiButton.vue';
import UiAlert from '../../../components/ui/UiAlert.vue'; // Importa el componente UiAlert
import { useGlobalToast } from '../../../composables/useGlobalToast';
import vacacionesService from '../../../services/vacacionesService';

const router = useRouter();
const route = useRoute();

const $toast = useGlobalToast();

const modalOpen = ref(false);

const modo = computed(() => route.name === 'editar-vacacion' ? 'editar' : 'crear');

const formValues = ref({
  empleado_id: null,
  fecha_inicio: null,
  fecha_fin: null,
  observaciones: '',
  // Añadimos dias_vacaciones_solicitados aquí para que computedDays pueda asignarle un valor inicial
  // aunque no se renderice como input en modo 'crear'. En modo 'editar', se llenará desde la API.
  dias_vacaciones_solicitados: 0,
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
    // Si estamos en modo búsqueda avanzada y la lista de empleados no está cargada,
    // o si el término de búsqueda es corto y queremos una lista completa,
    // podríamos forzar la carga completa aquí.
    // Para una búsqueda eficiente, lo ideal sería que EmpleadoService.search(searchTerm)
    // hiciera una llamada al backend para buscar por nombre/apellido.
    // Por ahora, si no hay empleados cargados, se intenta cargar todos para filtrar localmente.
    if (empleados.value.length === 0) {
      await cargarEmpleadosParaFormulario(); // Carga solo si es necesario para el buscador local
    }
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
  // En modo crear, este valor se usará para enviar al backend.
  // En modo editar, la API debería enviar el valor real de 'dias_vacaciones_solicitados'.
  // Aquí lo actualizamos para el cálculo dinámico en ambos modos.
  formValues.value.dias_vacaciones_solicitados = newDays;
}, { immediate: true });


// Ajuste de formFields: el slot solo se muestra condicionalmente en el template
const formFields = ref([
  { type: 'date', model: 'fecha_inicio', label: 'Fecha de Inicio:', required: true },
  { type: 'date', model: 'fecha_fin', label: 'Fecha de Fin:', required: true },
  { type: 'slot', name: 'dias_solicitados_display' }, // Este slot se renderiza condicionalmente en el template
  { type: 'textarea', model: 'observaciones', label: 'Observaciones:', placeholder: 'Ingrese observaciones (opcional)' },
]);

const cargandoRelaciones = ref(false);
const errorRelaciones = ref(null);

// **NUEVA FUNCIÓN para cargar empleados de forma más inteligente**
const cargarEmpleadosParaFormulario = async () => {
  // Solo carga todos los empleados si estamos en modo CREAR,
  // O si estamos en modo EDITAR y el método de selección es 'select' (para llenar el dropdown),
  // y la lista de empleados está vacía.
  if (modo.value === 'crear' || (modo.value === 'editar' && employeeSelectionMethod.value === 'select' && empleados.value.length === 0)) {
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
      $toast?.error('Error al cargar la lista de empleados.', 'Error de Carga');
    } finally {
      cargandoRelaciones.value = false;
    }
  }
};


const cargarVacacion = async (id) => {
  try {
    const vacacion = await vacacionesService.getById(id);
    if (vacacion) {
      formValues.value = {
        empleado_id: vacacion.empleado_id,
        fecha_inicio: vacacion.fecha_inicio,
        fecha_fin: vacacion.fecha_fin,
        observaciones: vacacion.observaciones || '',
        dias_vacaciones_solicitados: vacacion.dias_vacaciones_solicitados || calculatedDays.value, // Asegura que el valor original se cargue
      };

      // Si el empleado de la vacación cargada no está en la lista de empleados (ej. en modo búsqueda avanzada)
      // lo añadimos para que getSelectedEmployeeName y el buscador puedan referenciarlo.
      if (vacacion.empleado && !empleados.value.some(emp => emp.id === vacacion.empleado.id)) {
        empleados.value.push({
          ...vacacion.empleado,
          nombreCompleto: `${vacacion.empleado.nombre} ${vacacion.empleado.ape_paterno} ${vacacion.empleado.ape_materno}`
        });
      }

      // Si estamos en modo editar y el empleado_id se cargó,
      // ajustamos el método de selección a 'select' por defecto para que el dropdown lo muestre.
      if (formValues.value.empleado_id) {
        employeeSelectionMethod.value = 'select';
      }
    } else {
      $toast?.error('No se encontró la vacación con el ID proporcionado.', 'Vacación No Encontrada');
      router.push({ name: 'lista-vacaciones' });
    }
  } catch (error) {
    console.error('Error al cargar la solicitud de vacación:', error);
    $toast?.error('No se pudo cargar la vacación para edición. Por favor, intenta de nuevo.', 'Error de Carga');
    router.push({ name: 'lista-vacaciones' });
  }
};

const cancelar = () => {
  router.push({ name: 'lista-vacaciones' });
};

const guardarVacacion = async (formData) => {
  const dataToSend = {
    empleado_id: formValues.value.empleado_id,
    fecha_inicio: formData.fecha_inicio,
    fecha_fin: formData.fecha_fin,
    observaciones: formData.observaciones,
    // En modo crear, enviamos los calculatedDays.
    // En modo editar, si el backend requiere que se envíe, usamos el valor de formValues.value.dias_vacaciones_solicitados.
    // Depende de si la API maneja el cálculo o lo espera del frontend.
    // Para simplificar, si calculatedDays es la fuente de verdad en frontend:
    dias_vacaciones_solicitados: calculatedDays.value,
  };

  try {
    if (!dataToSend.empleado_id) {
      $toast?.warning('Por favor, selecciona un empleado.');
      return;
    }
    if (modo.value === 'editar' && route.params.id) {
      await vacacionesService.update(route.params.id, dataToSend);
      $toast?.success('Solicitud de vacación actualizada exitosamente!', 'Éxito');
    } else if (modo.value === 'crear') {
      console.log('Datos a enviar:', dataToSend);
      await vacacionesService.create(dataToSend);
      $toast?.success('Solicitud de vacación creada exitosamente!', 'Éxito');
    }
    router.push({ name: 'lista-vacaciones' });
  } catch (error) {
    console.error('Error al guardar la solicitud de vacación:', error);
    $toast?.error('Error al guardar la solicitud de vacación. Por favor, revisa los datos e intenta de nuevo.', 'Error');
  }
};

onMounted(() => {
  // Solo cargar empleados si estamos en modo "crear"
  // o si estamos en modo "editar" y el método es "select" (para rellenar el dropdown)
  cargarEmpleadosParaFormulario();

  if (modo.value === 'editar' && route.params.id) {
    cargarVacacion(route.params.id);
  }
});

watch(employeeSelectionMethod, (newMethod, oldMethod) => {
  if (newMethod !== oldMethod && modo.value !== 'editar') {
    // Si se cambia el método de selección en modo CREAR:
    // Reinicia el empleado seleccionado y el término de búsqueda.
    // Si el nuevo método es 'select' y la lista de empleados no está cargada, cárgala.
    formValues.value.empleado_id = null;
    employeeSearchTerm.value = '';
    if (newMethod === 'select' && empleados.value.length === 0) {
      cargarEmpleadosParaFormulario();
    }
  } else if (modo.value === 'editar' && newMethod === 'select' && empleados.value.length === 0) {
    // En modo editar, si cambiamos a 'select' y la lista está vacía, cárgala.
    cargarEmpleadosParaFormulario();
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
  // Mantener la lógica del modal de información si es necesario
  // modalOpen.value = true; // Asegúrate de que el modal esté cerrado al inicio
})
</script>

<style scoped>
/* Estilos específicos del componente si los hay */
</style>