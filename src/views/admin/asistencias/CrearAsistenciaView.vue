<template>
  <div class="container mx-auto p-4">

  <div class="mb-4">
      <UiAlert type="info" extraClasses="mb-2" >
        Estás creando una nueva asistencia. Completa todos los campos requeridos.
      </UiAlert>    
      <UiAlert v-if="!departamentoSeleccionadoId" type="danger" :dismissible="true">
        <h1>Advertencia!</h1>
        Por favor, **selecciona primero un departamento** para continuar. Esto filtrará la lista de empleados.
      </UiAlert>



      <UiAlert type="purple-power" class="my-4">
        <p>Por favor, complete todos los campos obligatorios para continuar.</p>
        <ul class="list-disc pl-5">
          <li>Seleccione un departamento para ver la lista de empleados.</li>
          <li>Seleccione un empleado.</li>
          <li>Seleccione un horario.</li>
          <li>Ingrese la fecha y el tipo de asistencia.</li>
        </ul>
      </UiAlert>
    </div>

    <div class="lg:max-w-2xl 2xl:max-w-4xl border border-slate-100 rounded-lg hover:shadow mx-auto p-6 bg-white dark:bg-gray-800">
      <h2 class="text-xl font-bold mb-4">Crear Nueva Asistencia</h2>
      <form @submit.prevent="guardarAsistencia" class="space-y-6">

        <div class="mb-6 border-b pb-4">
          <UiSelect
            id="departamento-select"
            v-model="departamentoSeleccionadoId"
            :options="departamentoOptions"
            label="Departamento:"
            placeholder="Selecciona un departamento"
            :required="true"
            :disabled="cargandoRelaciones"
          />
        </div>

        <div v-if="departamentoSeleccionadoId" class="mb-6 border-b pb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ¿Cómo deseas seleccionar al empleado?
          </label>
          <div class="flex items-center space-x-4 mb-4">
            <UiRadioButton
              id="radio-select"
              label="Usar Lista (Dropdown)"
              value="select"
              v-model="employeeSelectionMethod"
            />
            <UiRadioButton
              id="radio-search"
              label="Usar Búsqueda Avanzada"
              value="search"
              v-model="employeeSelectionMethod"
            />
          </div>

          <div v-if="cargandoRelaciones" class="text-center text-gray-500">
            <UiSpinner class="text-indigo-500" /> Cargando empleados...
          </div>
          <div v-else-if="empleadosFiltrados.length === 0" class="text-center text-gray-500">
            No hay empleados en este departamento.
          </div>
          <div v-else>
            <div v-if="employeeSelectionMethod === 'select'">
              <UiSelect
                id="select-empleado"
                v-model="formValues.empleado_id"
                :options="empleadoOptions"
                label="Empleado:"
                placeholder="Selecciona un empleado"
                :required="true"
              />
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
              />
            </div>
          </div>
        </div>

        <div :class="{'opacity-50 pointer-events-none': !formularioHabilitado}">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selecciona un horario:
            </label>
            <div class="flex flex-col space-y-2">
              <UiRadioButton
                v-for="(horario, index) in horariosDisponibles"
                :key="index"
                :id="`horario-${index}`"
                :label="horario.label"
                :value="horario.entrada"
                v-model="horarioSeleccionado"
              />
            </div>
          </div>

          <UiSelect
            id="tipo-asistencia-select"
            v-model="formValues.tipo_asistencia_id"
            :options="tiposAsistenciaOptions"
            label="Tipo de Asistencia:"
            placeholder="Selecciona el tipo de asistencia"
            :required="true"
          />

          <UiInputDate
            id="fecha-asistencia"
            v-model="formValues.fecha"
            label="Fecha:"
            placeholder="Selecciona la fecha"
            :required="true"
          />

          <div class="flex gap-4">
            <UiInputTime
              id="hora-entrada"
              v-model="formValues.hora_entrada"
              label="Hora de Entrada:"
              :required="true"
            />
            <UiInputTime
              id="hora-salida"
              v-model="formValues.hora_salida"
              label="Hora de Salida:"
              :required="true"
            />
          </div>
          
          <div class="my-2.5">
            <UiCheckbox v-model="showObservaciones" id="observation-option" label="¿Habilitar campo observaciónes?" />
          </div>
            <UiTextarea v-if="showObservaciones"
            id="observaciones"
            v-model="formValues.observaciones"
            label="Observaciones:"
            placeholder="Ingrese observaciones (opcional)"
            class="transition-all ease"
          />

        </div>

        <div class="flex justify-end gap-2 mt-8">
          <UiButton variant="neutral" @click="cancelar">
            Cancelar
          </UiButton>
          <UiButton type="submit" variant="primary" :disabled="!formularioHabilitado">
            <UiSpinner v-if="isLoading" class="text-current size-5 mr-1" />  {{ saveButtonText }}
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import AsistenciaService from '@/services/asistenciaService';
import EmpleadoService from '@/services/empleadoService';
import TiposAsistenciaService from '@/services/tiposAsistenciaService';
import DepartamentoService from '@/services/departamentosService';
import { format } from 'date-fns';

// Componentes de UI que vamos a usar
import UiAlert from '@/components/ui/UiAlert.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiInputDate from '@/components/ui/UiInputDate.vue';
import UiInputTime from '@/components/ui/UiInputTime.vue';
import UiTextarea from '@/components/ui/UiTextArea.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiRadioButton from '@/components/ui/UiRadioButton.vue';
import UiInputSearchWithResults from '@/components/ui/UiInputSearchWithResults.vue';
import UiCheckbox from '../../../components/ui/UiCheckbox.vue';

const router = useRouter();

// Estado del formulario
const formValues = ref({
  fecha: format(new Date(), 'yyyy-MM-dd'),
  hora_entrada: null, // Lo inicializamos a null, ya que se llenará al seleccionar un turno
  hora_salida: null,  // Lo inicializamos a null, ya que se llenará al seleccionar un turno
  empleado_id: null,
  tipo_asistencia_id: null,
  observaciones: '',
});

const formularioHabilitado = ref(false);

const empleados = ref([]);
const empleadosFiltrados = ref([]);
const employeeSelectionMethod = ref('select');
const employeeSearchTerm = ref('');
const tiposAsistencia = ref([]);
const departamentos = ref([]);
const departamentoSeleccionadoId = ref(null);

// Ahora, horarioSeleccionado es un string (la hora de entrada), no un objeto
const horarioSeleccionado = ref(null);

const horariosDisponibles = ref([
  { label: 'Turno Matutino (6:00 AM - 3:00 PM)', entrada: '06:00', salida: '15:00' },
  { label: 'Turno Vespertino (8:00 AM - 5:00 PM)', entrada: '08:00', salida: '17:00' },
  { label: 'Turno Nocturno (3:00 PM - 11:00 PM)', entrada: '15:00', salida: '23:00' },
]);

const isLoading = ref(false);
const showObservaciones = ref(false);
const cargandoRelaciones = ref(false);
const errorRelaciones = ref(null);

const saveButtonText = computed(() => 'Crear');

const empleadoOptions = computed(() => empleadosFiltrados.value.map(empleado => ({
  label: `${empleado.nombre} ${empleado.ape_paterno} ${empleado.ape_materno}`,
  value: empleado.id
})));
const tiposAsistenciaOptions = computed(() => tiposAsistencia.value.map(tipo => ({ label: tipo.nombre, value: tipo.id })));
const departamentoOptions = computed(() => departamentos.value.map(depto => ({
  label: depto.nombre,
  value: depto.id
})));

// ... (El resto de tus funciones como `searchEmployees`, `cargarEmpleados`, etc., se mantienen igual) ...
const searchEmployees = async (searchTerm) => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return empleadosFiltrados.value.filter(emp =>
    emp.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
    emp.ape_paterno.toLowerCase().includes(lowerCaseSearchTerm) ||
    emp.ape_materno.toLowerCase().includes(lowerCaseSearchTerm)
  );
};

const formatEmployeeResult = (item) => `${item.nombre} ${item.ape_paterno} ${item.ape_materno}`;

const handleEmployeeSelected = (selectedEmployee) => {
  formValues.value.empleado_id = selectedEmployee.id;
};

const cargarEmpleados = async () => {
  try {
    const allEmployees = await EmpleadoService.getAll();
    empleados.value = allEmployees;
  } catch (err) {
    console.error('Error al cargar empleados:', err);
    errorRelaciones.value = err;
  }
};

const cargarRelaciones = async () => {
  cargandoRelaciones.value = true;
  errorRelaciones.value = null;
  try {
    await cargarEmpleados();
    tiposAsistencia.value = await TiposAsistenciaService.getAll();
    departamentos.value = await DepartamentoService.getAll();
  } catch (err) {
    errorRelaciones.value = err;
  } finally {
    cargandoRelaciones.value = false;
  }
};

const cancelar = () => {
  router.push({ name: 'lista-asistencias' });
};

const guardarAsistencia = async () => {
  isLoading.value=true;
  const dataToSend = { ...formValues.value };
  dataToSend.hora_entrada = dataToSend.hora_entrada ? dataToSend.hora_entrada.substring(0, 5) : null;
  dataToSend.hora_salida = dataToSend.hora_salida ? dataToSend.hora_salida.substring(0, 5) : null;

  try {
    await AsistenciaService.create(dataToSend);
    router.push({ name: 'lista-asistencias' });
  } catch (error) {
    console.error('Error al guardar la asistencia:', error);
    isLoading.value=false;
  }finally{
    isLoading.value=false;
  }
};

onMounted(() => {
  cargarRelaciones();
});


watch(departamentoSeleccionadoId, (newId) => {
  formValues.value.empleado_id = null;
  horarioSeleccionado.value = null;

  if (newId) {
    empleadosFiltrados.value = empleados.value.filter(emp => emp.departamento_id === newId);
  } else {
    empleadosFiltrados.value = [];
  }
});

// Este watcher ahora reacciona a un string (la hora de entrada del turno)
watch(horarioSeleccionado, (newHorarioEntrada) => {
  if (newHorarioEntrada) {
    // Buscamos el objeto de horario completo a partir de la hora de entrada
    const turnoSeleccionado = horariosDisponibles.value.find(horario => horario.entrada === newHorarioEntrada);
    if (turnoSeleccionado) {
      formValues.value.hora_entrada = turnoSeleccionado.entrada;
      formValues.value.hora_salida = turnoSeleccionado.salida;
    }
  } else {
    formValues.value.hora_entrada = null;
    formValues.value.hora_salida = null;
  }
});

watch(() => formValues.value.empleado_id, (newId) => {
  formularioHabilitado.value = newId !== null;
});
</script>