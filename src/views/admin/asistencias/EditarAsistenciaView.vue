<template>
  <div class="container mx-auto p-4">
    <div class="mb-4">
      <UiAlert type="info" extraClasses="mb-2">
        Estás editando una asistencia existente. Modifica los campos necesarios y guarda los cambios.
      </UiAlert>

      <UiAlert type="purple-power" class="my-4">
        <p>Por favor, complete todos los campos obligatorios para actualizar la asistencia.</p>
        <ul class="list-disc pl-5">
          <li>El empleado y el departamento se muestran como referencia y no pueden ser modificados.</li>
          <li>Ajuste las horas, la fecha o el tipo de asistencia si es necesario.</li>
        </ul>
      </UiAlert>
    </div>

    <div class="lg:max-w-2xl 2xl:max-w-4xl border border-slate-100 rounded-lg hover:shadow mx-auto p-6 bg-white dark:bg-gray-800">
      <h2 class="text-xl font-bold mb-4">Editar Asistencia</h2>

      <div v-if="cargandoAsistencia" class="text-center text-gray-500">
        Cargando datos de la asistencia...
      </div>
      <div v-else-if="errorCarga" class="text-red-500 text-center">
        <p>Error al cargar la asistencia: {{ errorCarga.message || errorCarga }}</p>
        <UiButton @click="cancelar" variant="secondary" class="mt-4">Volver</UiButton>
      </div>

      <form v-else @submit.prevent="guardarAsistencia" class="space-y-6">

        <div class="mb-6 border-b pb-4">
          <UiInputLabel
            label="Empleado:"
            :value="nombreCompletoEmpleado"
            placeholder="Cargando empleado..."
          />
        </div>

        <div class="mb-6 border-b pb-4">
          <UiInputLabel
            label="Departamento:"
            :value="nombreDepartamento"
            placeholder="Cargando departamento..."
          />
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
        
        <UiTextarea
          id="observaciones"
          v-model="formValues.observaciones"
          label="Observaciones:"
          placeholder="Ingrese observaciones (opcional)"
        />

        <div class="flex justify-end gap-2 mt-8">
          <UiButton variant="neutral" @click="cancelar">
            Cancelar
          </UiButton>
          <UiButton type="submit" variant="primary">
            Guardar Cambios
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AsistenciaService from '@/services/asistenciaService';
import EmpleadoService from '@/services/empleadoService';
import TiposAsistenciaService from '@/services/tiposAsistenciaService';
import DepartamentoService from '@/services/departamentosService';

import UiAlert from '@/components/ui/UiAlert.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiInputLabel from '@/components/ui/UiInputLabel.vue';
import UiInputDate from '@/components/ui/UiInputDate.vue';
import UiInputTime from '@/components/ui/UiInputTime.vue';
import UiTextarea from '@/components/ui/UiTextArea.vue';
import UiSelect from '@/components/ui/UiSelect.vue';

const router = useRouter();
const route = useRoute();

const formValues = ref({
  fecha: '',
  hora_entrada: '',
  hora_salida: '',
  empleado_id: null,
  tipo_asistencia_id: null,
  observaciones: '',
});

const cargandoAsistencia = ref(true);
const errorCarga = ref(null);

const empleados = ref([]);
const departamentos = ref([]);
const tiposAsistencia = ref([]);

const nombreCompletoEmpleado = computed(() => {
  const empleado = empleados.value.find(emp => emp.id == formValues.value.empleado_id);
  return empleado ? `${empleado.nombre} ${empleado.ape_paterno} ${empleado.ape_materno}` : 'N/A';
});

const nombreDepartamento = computed(() => {
  const empleado = empleados.value.find(emp => emp.id == formValues.value.empleado_id);
  if (!empleado) return 'N/A';
  const departamento = departamentos.value.find(depto => depto.id == empleado.departamento_id);
  return departamento ? departamento.nombre : 'N/A';
});

const tiposAsistenciaOptions = computed(() => tiposAsistencia.value.map(tipo => ({ label: tipo.nombre, value: tipo.id })));

const cargarRelaciones = async () => {
  try {
    const [allEmployees, allTiposAsistencia, allDepartamentos] = await Promise.all([
      EmpleadoService.getAll(),
      TiposAsistenciaService.getAll(),
      DepartamentoService.getAll()
    ]);
    empleados.value = allEmployees;
    tiposAsistencia.value = allTiposAsistencia;
    departamentos.value = allDepartamentos;
  } catch (err) {
    console.error('Error al cargar relaciones:', err);
    throw err;
  }
};

const cargarAsistencia = async () => {
  const id = route.params.id;
  if (!id) {
    errorCarga.value = 'ID de asistencia no proporcionado.';
    return;
  }
  try {
    const asistencia = await AsistenciaService.getById(id);
    
    console.log('Asistencia obtenida del servicio: ', asistencia);
    
    formValues.value = {
      fecha: asistencia.fecha,
      hora_entrada: asistencia.hora_entrada ? asistencia.hora_entrada.substring(0, 5) : null,
      hora_salida: asistencia.hora_salida ? asistencia.hora_salida.substring(0, 5) : null,
      empleado_id: asistencia.empleado_id,
      tipo_asistencia_id: asistencia.tipo_asistencia_id,
      observaciones: asistencia.observaciones,
    };
  } catch (err) {
    console.error(`Error al cargar asistencia con ID ${id}:`, err);
    errorCarga.value = err.message || 'Error desconocido al cargar la asistencia.';
  }
};

const guardarAsistencia = async () => {
  const id = route.params.id;
  if (!id) return;
  const dataToSend = { ...formValues.value };
  
  try {
    await AsistenciaService.update(id, dataToSend);
    router.push({ name: 'lista-asistencias' });
  } catch (error) {
    console.error('Error al actualizar la asistencia:', error);
  }
};

const cancelar = () => {
  router.push({ name: 'lista-asistencias' });
};

onMounted(async () => {
  try {
    await cargarRelaciones();
    await cargarAsistencia();
  } catch (err) {
    console.error('Fallo en la carga inicial:', err);
    errorCarga.value = err;
  } finally {
    cargandoAsistencia.value = false;
  }
});
</script>