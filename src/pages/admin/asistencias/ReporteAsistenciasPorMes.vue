<template>
  <div class="container mx-auto p-4 pb-8">
    <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Reporte de Asistencias por Mes</h1>

    <p class="mb-4 text-gray-700">
      Selecciona el año y el mes para generar y descargar el reporte de asistencias.
    </p>

    <div class="mb-6">
      <UiDescriptionList
        title="Información del Reporte de Asistencias por Mes"
        description="Esta es la información que se incluirá en el reporte de asistencias para el mes seleccionado."
        :items="reporteInfo"
      />
    </div>

    <div class="my-10">
      <UiDivider label="Filtros y Datos del Archivo" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      <UiSelect
        v-model="anio"
        id="anio"
        :options="anioOptions"
        placeholder="Selecciona un año"
        label="Año:"
      />

      <UiSelect
        v-model="mes"
        id="mes"
        :options="mesOptions"
        placeholder="Selecciona un mes"
        label="Mes:"
      />

      <UiSelect
        v-model="formato"
        id="formato"
        :options="[
          { label: 'Excel', value: 'excel' },
          { label: 'CSV', value: 'csv' },
          { label: 'PDF', value: 'pdf' },
        ]"
        placeholder="Selecciona un formato"
        label="Formato de Exportación:"
      />

      <UiInputText
        v-model="nombreArchivo"
        type="text"
        id="nombreArchivo"
        label="Nombre del Archivo (opcional):"
        placeholder="reporte_asistencias_mes"
      />
    </div>

    <div class="flex justify-center mt-6">
      <UiButton variant="primary" size="md" :disabled="!anio || !mes" @click="generarReporte">
        <DocumentArrowDownIcon class="w-6 h-6 mr-2" /> Generar Reporte
      </UiButton>
    </div>

    <div v-if="generando" class="mt-4 text-center text-gray-500">Generando el reporte...</div>
    <div v-if="generarError" class="mt-4 text-center text-red-500">Error al generar el reporte: {{ generarError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/20/solid';
import UiButton from '../../../components/ui/UiButton.vue';
import UiSelect from '../../../components/ui/UiSelect.vue';
import UiInputText from '../../../components/ui/UiInputText.vue';
import UiDivider from '../../../components/ui/UiDivider.vue';
import UiDescriptionList from '../../../components/ui/UiDescriptionList.vue';
import { useToastService } from '../../../services/toastService';
import AsistenciaService from '../../../services/asistenciaService'; // Importamos el servicio de asistencias

const anio = ref('');
const mes = ref('');
const formato = ref('pdf');
const nombreArchivo = ref('');
const generando = ref(false);
const generarError = ref(null);
const { notify } = useToastService();
const anioOptions = ref([]);
const mesOptions = ref([
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 },
]);

const reporteInfo = ref([
  { label: 'Año', value: 'Se incluirá el año de la asistencia.' },
  { label: 'Mes', value: 'Se incluirá el mes de la asistencia.' },
  { label: 'Empleado', value: 'Se incluirá el nombre del empleado.' },
  { label: 'Fecha', value: 'Se incluirá la fecha de la asistencia.' },
  { label: 'Hora de Entrada', value: 'Se incluirá la hora de entrada del empleado.' },
  { label: 'Hora de Salida', value: 'Se incluirá la hora de salida del empleado (si aplica).' },
  { label: 'Tipo de Asistencia', value: 'Se incluirá el tipo de asistencia (ej., entrada, salida, permiso).' },
  // Puedes agregar más información relevante para el reporte por mes
]);

onMounted(() => {
  // Generar opciones para los últimos años (puedes ajustar esto según tus necesidades)
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    anioOptions.value.push({ label: String(i), value: i });
  }
});

const generarReporte = async () => {
  if (!anio.value || !mes.value) {
    useToastService().warning('Por favor, selecciona un año y un mes.', { title: 'Advertencia' });
    return;
  }
  if (!formato.value) {
    useToastService().warning('Por favor, selecciona un formato de exportación.', { title: 'Advertencia' });
    return;
  }
  if (nombreArchivo.value && nombreArchivo.value.length > 50) {
    useToastService().warning('El nombre del archivo no puede exceder los 50 caracteres.', { title: 'Advertencia' });
    return;
  }

  console.log('Datos de exportación:', {
    anio: anio.value,
    mes: mes.value,
    formato: formato.value,
    nombreArchivo: nombreArchivo.value,
  });

  generando.value = true;
  generarError.value = null;
  try {
    const filename = nombreArchivo.value || `reporte_asistencias_mes_${anio.value}_${String(mes.value).padStart(2, '0')}`;
    const response = await AsistenciaService.porMes( {
      anio: anio.value,
      mes: mes.value,
      formato: formato.value,
      nombre_archivo: filename, // Ajusta el nombre del parámetro según tu API si es diferente
    }, { responseType: 'blob' });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.${formato.value}`);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);

    notify(`${filename}.${formato.value}`, { position: 'top-center', duration: 12000, title: 'Descarga Finalizada' });

  } catch (error) {
    console.error('Error al generar el reporte de asistencias por mes:', error);
    generarError.value = error.message || 'Error desconocido al generar el reporte.';
    useToastService().error('Hubo un error al generar el reporte de asistencias por mes.', { title: 'Error al exportar' });
  } finally {
    generando.value = false;
  }
};
</script>