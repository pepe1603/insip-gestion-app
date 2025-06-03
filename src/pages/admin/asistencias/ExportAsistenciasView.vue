<template>
    <div class="container mx-auto p-4 pb-8">
      <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Exportar Reporte de Asistencias</h1>
  
      <p class="mb-4 text-gray-700">
        Selecciona los filtros y el formato para generar y descargar el reporte de asistencias.
      </p>
  
      <div class="mb-6">
        <UiDescriptionList
          title="Información del Reporte de Asistencias"
          description="Selecciona los criterios para incluir en el reporte de asistencias."
          :items="reporteInfo"
        />
      </div>
  
      <div class="my-10">
        <UiDivider label="Filtros del Reporte" />
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <UiSelect
            v-model="filtros.formato"
            id="formato"
            :options="[
              { label: 'CSV', value: 'csv' },
              // Podríamos añadir más formatos en el futuro
            ]"
            placeholder="Selecciona un formato"
            label="Formato de Exportación:"
          />
        </div>
  
        <div>
          <UiInputText
            v-model="filtros.nombreArchivo"
            type="text"
            id="nombreArchivo"
            label="Nombre del Archivo (opcional):"
            placeholder="reporte_asistencias"
          />
        </div>
  
        <div>
          <label for="rango-fechas" class="block text-gray-700 text-sm font-bold mb-2">Rango de Fechas:</label>
          <div class="flex items-center space-x-2">
            <UiInputDate v-model="filtros.fechaInicio" id="fecha-inicio" label="Desde" />
            <UiInputDate v-model="filtros.fechaFin" id="fecha-fin" label="Hasta" />
          </div>
        </div>
  
        <div>
          <UiSelect
            v-model="filtros.empleadoId"
            id="empleado"
            :options="empleadoOptions"
            placeholder="Selecciona un empleado (opcional)"
            label="Empleado:"
          />
        </div>
  
        <div>
          <UiSelect
            v-model="filtros.departamentoId"
            id="departamento"
            :options="departamentoOptions"
            placeholder="Selecciona un departamento (opcional)"
            label="Departamento:"
          />
        </div>
  
        <div>
          <UiSelect
            v-model="filtros.tipoAsistenciaId"
            id="tipo-asistencia"
            :options="tipoAsistenciaOptions"
            placeholder="Selecciona un tipo de asistencia (opcional)"
            label="Tipo de Asistencia:"
          />
        </div>
  
        <div>
          <UiSelect
            v-model="filtros.mes"
            id="mes"
            :options="mesOptions"
            placeholder="Selecciona un mes (opcional)"
            label="Mes:"
          />
        </div>
  
        <div>
          <UiInputText
            v-model="filtros.anio"
            type="number"
            id="anio"
            label="Año (opcional):"
            :min="2020"
            :max="(new Date()).getFullYear()"
            placeholder="Año"
          />
        </div>
      </div>
  
      <div class="flex justify-center mt-6">
        <UiButton variant="primary" size="large" @click="exportarAsistencias">
          <DocumentArrowDownIcon class="w-6 h-6 mr-2" /> Exportar Asistencias
        </UiButton>
      </div>
  
      <div v-if="exporting" class="mt-4 text-center text-gray-500">Generando y descargando el reporte...</div>
      <div v-if="exportError" class="mt-4 text-center text-red-500">Error al generar el reporte: {{ exportError }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { DocumentArrowDownIcon } from '@heroicons/vue/20/solid';
  import UiButton from '../../../components/ui/UiButton.vue';
  import UiSelect from '../../../components/ui/UiSelect.vue';
  import UiInputText from '../../../components/ui/UiInputText.vue';
  import UiInputDate from '../../../components/ui/UiInputDate.vue';
  import UiDivider from '../../../components/ui/UiDivider.vue';
  import UiDescriptionList from '../../../components/ui/UiDescriptionList.vue';
  import { useToastService } from '../../../services/toastService';
  import AsistenciasService from '../../../services/AsistenciasService';
  import EmpleadoService from '../../../services/empleadoService'; // Para el listado de empleados
  import DepartamentoService from '../../../services/departamentoService'; // Para el listado de departamentos
  import TipoAsistenciaService from '../../../services/tipoAsistenciaService'; // Para el listado de tipos de asistencia
  
  const filtros = ref({
    formato: 'csv',
    nombreArchivo: '',
    fechaInicio: null,
    fechaFin: null,
    empleadoId: '',
    departamentoId: '',
    tipoAsistenciaId: '',
    mes: '',
    anio: (new Date()).getFullYear(),
  });
  
  const exporting = ref(false);
  const exportError = ref(null);
  const { notify } = useToastService();
  
  const empleados = ref([]);
  const departamentos = ref([]);
  const tiposAsistencia = ref([]);
  
  const reporteInfo = ref([
    { label: 'Fecha y Hora', value: 'Incluye la fecha y hora de los registros de asistencia.' },
    { label: 'Empleado', value: 'Muestra el nombre del empleado asociado a cada registro.' },
    { label: 'Tipo de Asistencia', value: 'Indica el tipo de marcaje (entrada, salida, etc.).' },
    { label: 'Departamento', value: 'Especifica el departamento del empleado.' },
    // Puedes añadir más información relevante aquí
  ]);
  
  const mesOptions = computed(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return { value: month, label: new Date(2000, month - 1, 1).toLocaleDateString('es-MX', { month: 'long' }) };
    });
  });
  
  const empleadoOptions = computed(() => {
    return empleados.value.map(empleado => ({ value: empleado.id, label: empleado.nombre_completo }));
  });
  
  const departamentoOptions = computed(() => {
    return departamentos.value.map(departamento => ({ value: departamento.id, label: departamento.nombre }));
  });
  
  const tipoAsistenciaOptions = computed(() => {
    return tiposAsistencia.value.map(tipo => ({ value: tipo.id, label: tipo.nombre }));
  });
  
  onMounted(async () => {
    try {
      const empleadosData = await EmpleadoService.getAll();
      empleados.value = empleadosData;
  
      const departamentosData = await DepartamentoService.getAll();
      departamentos.value = departamentosData;
  
      const tiposAsistenciaData = await TipoAsistenciaService.getAll();
      tiposAsistencia.value = tiposAsistenciaData;
    } catch (error) {
      console.error('Error al cargar los datos necesarios para los filtros:', error);
      useToastService().error('Error al cargar los datos para los filtros.', { title: 'Error' });
    }
  });
  
  const exportarAsistencias = async () => {
    exporting.value = true;
    exportError.value = null;
    try {
      let response;
      const params = {};
      const options = { responseType: 'blob' };
      const filename = filtros.value.nombreArchivo || 'reporte_asistencias';
      const format = filtros.value.formato;
  
      if (filtros.value.fechaInicio && filtros.value.fechaFin) {
        response = await AsistenciasService.porRangoFechas(filtros.value.fechaInicio, filtros.value.fechaFin, params, options);
      } else if (filtros.value.empleadoId) {
        response = await AsistenciasService.porEmpleado(filtros.value.empleadoId, params, options);
      } else if (filtros.value.departamentoId) {
        response = await AsistenciasService.exportarPorDepartamento(filtros.value.departamentoId, params, options);
      } else if (filtros.value.tipoAsistenciaId) {
        response = await AsistenciasService.porTipoAsistencia(filtros.value.tipoAsistenciaId, params, options);
      } else if (filtros.value.mes && filtros.value.anio) {
        response = await AsistenciasService.porMes(filtros.value.anio, filtros.value.mes, params, options);
      } else if (filtros.value.fechaInicio) {
        response = await AsistenciasService.porFecha(filtros.value.fechaInicio, params, options);
      } else {
        // Exportar todo si no hay filtros específicos
        response = await AsistenciasService.exportarTodo(params, options);
      }
  
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.${format}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      notify(`${filename}.${format}`, { position: 'top-center', duration: 12000, title: 'Descarga Finalizada' });
  
    } catch (error) {
      console.error('Error al exportar el reporte de asistencias:', error);
      exportError.value = error.message || 'Error desconocido al exportar.';
      useToastService().error('Hubo un error al generar el reporte de asistencias.', { title: 'Error al exportar' });
    } finally {
      exporting.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>