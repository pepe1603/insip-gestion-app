<template>
  <div class="container mx-auto p-4 pb-8">
    <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Reporte de Asistencias por Rango de Fechas</h1>

    <p class="mb-4 text-gray-700">
      Selecciona un rango de fechas y el formato para generar y descargar el reporte.
    </p>

    <div class="mb-6">
      <UiDescriptionList
        title="Información del Reporte de Asistencias"
        description="Esta es la información que se incluirá en el reporte de asistencias del rango seleccionado."
        :items="reporteInfo"
      />
    </div>

    <div class="my-10">
      <UiDivider label="Filtros y Datos del Archivo" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      <UiInputDate
        v-model="fechaInicio"
        id="fechaInicio"
        label="Fecha Inicio:"
        required
      />
      <UiInputDate
        v-model="fechaFin"
        id="fechaFin"
        label="Fecha Fin:"
        required
      />
      <UiSelect
        v-model="formato"
        id="formato"
        :options="[
          { label: 'Excel', value: 'excel' },
          { label: 'CSV', value: 'csv' },
          { label: 'PDF', value: 'pdf' }
        ]"
        placeholder="Selecciona un formato"
        label="Formato de Exportación:"
      />
      <UiInputText
        v-model="nombreArchivo"
        type="text"
        id="nombreArchivo"
        label="Nombre del Archivo (opcional):"
        placeholder="reporte_asistencias_rango"
      />
    </div>

    <div class="flex justify-center mt-6">
      <UiButton variant="primary" size="large" :disabled="!fechaInicio || !fechaFin" @click="generarReporte">
        <DocumentArrowDownIcon class="w-6 h-6 mr-2" /> Generar Reporte
      </UiButton>
    </div>

    <div v-if="generando" class="mt-4 text-center text-gray-500">Generando el reporte...</div>
    <div v-if="generarError" class="mt-4 text-center text-red-500">Error: {{ generarError }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/20/solid';
import UiButton from '../../../components/ui/UiButton.vue';
import UiSelect from '../../../components/ui/UiSelect.vue';
import UiInputText from '../../../components/ui/UiInputText.vue';
import UiDivider from '../../../components/ui/UiDivider.vue';
import UiDescriptionList from '../../../components/ui/UiDescriptionList.vue';
import UiInputDate from '../../../components/ui/UiInputDate.vue'; // Importa el nuevo componente
import { useToastService } from '../../../services/toastService';
import AsistenciaService from '../../../services/asistenciaService';

const fechaInicio = ref('');
const fechaFin = ref('');
const formato = ref('pdf');
const nombreArchivo = ref('');
const generando = ref(false);
const generarError = ref(null);
const { notify } = useToastService();

const reporteInfo = ref([
  { label: 'Fecha de Inicio', value: 'Se incluirá la fecha inicial del rango.' },
  { label: 'Fecha de Fin', value: 'Se incluirá la fecha final del rango.' },
  { label: 'Empleado', value: 'Se incluirá el nombre del empleado.' },
  { label: 'Hora de Entrada', value: 'Se incluirá la hora de entrada.' },
  { label: 'Hora de Salida', value: 'Se incluirá la hora de salida (si aplica).' },
  { label: 'Tipo de Asistencia', value: 'Se indicará si es entrada, salida, permiso, etc.' }
]);

const generarReporte = async () => {
  if (!fechaInicio.value || !fechaFin.value) {
    useToastService().warning('Por favor selecciona el rango de fechas.', { title: 'Advertencia' });
    return;
  }
  if (!formato.value) {
    useToastService().warning('Selecciona un formato de exportación.', { title: 'Advertencia' });
    return;
  }
  if (nombreArchivo.value && nombreArchivo.value.length > 50) {
    useToastService().warning('El nombre del archivo no puede exceder los 50 caracteres.', { title: 'Advertencia' });
    return;
  }

  console.log('Generando reporte con los siguientes datos:', {
    fechaInicio: fechaInicio.value,
    fechaFin: fechaFin.value,
    formato: formato.value,
    nombreArchivo: nombreArchivo.value,
  });

  generando.value = true;
  generarError.value = null;
  try {
    const filename = nombreArchivo.value || `reporte_asistencias_rango_${fechaInicio.value}_${fechaFin.value}`;
    const response = await AsistenciaService.porRangoFechas(
      fechaInicio.value,
      fechaFin.value,
      {
        format: formato.value,
        filename: filename,
      },
      { responseType: 'blob' }
);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.${formato.value}`);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);

    notify(`${filename}.${formato.value}`, {
      position: 'top-center',
      duration: 12000,
      title: 'Descarga Finalizada',
    });

  } catch (error) {
    console.error('Error al generar el reporte:', error);
    generarError.value = error.message || 'Error desconocido al generar el reporte.';
    useToastService().error('Hubo un error al generar el reporte.', { title: 'Error al exportar' });
  } finally {
    generando.value = false;
  }
};
</script>