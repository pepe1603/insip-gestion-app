<template>
    <div class="container mx-auto p-4 pb-8">
      <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Exportar Reporte de Empleados</h1>
  
      <p class="mb-4 text-gray-700">
        Selecciona el formato y, opcionalmente, el nombre del archivo para generar y descargar el reporte de empleados.
      </p>
  
      <div class="mb-6">
        <UiDescriptionList
          title="Información del Reporte"
          description="Esta es la información que se incluirá en el reporte de empleados."
          :items="reporteInfo"
        />
      </div>
  

<div class="my-10">
    <UiDivider label="Datos del Archivo" />
</div>

<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            id="nombreArchivo"
            label="Nombre del Archivo (opcional):"
            placeholder="reporte_empleados"
        />

        <div class="flex justify-center mt-6">
        <UiButton variant="primary" @click="exportarReporte">
          <DocumentArrowDownIcon class="size-10 " /> Exportar Reporte
        </UiButton>
      </div>

</div>
  
      <div v-if="exporting" class="mt-4 text-center text-gray-500">Descargando el reporte...</div>
      <div v-if="exportError" class="mt-4 text-center text-red-500">Error al descargar el reporte: {{ exportError }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { DocumentArrowDownIcon } from '@heroicons/vue/20/solid';
  import UiButton from '../../../components/ui/UiButton.vue';
  import UiSelect from '../../../components/ui/UiSelect.vue';
  import UiInputText from '../../../components/ui/UiInputText.vue';
  import UiDivider from '../../../components/ui/UiDivider.vue'; // Importa el componente
  import UiDescriptionList from '../../../components/ui/UiDescriptionList.vue';
  import { useToastService } from '../../../services/toastService';
  import EmpleadoService from '../../../services/empleadoService';
  
  const formato = ref('pdf');
  const nombreArchivo = ref('');
  const exporting = ref(false);
  const exportError = ref(null);
  const { notify } = useToastService();
  
  const reporteInfo = ref([
    { label: 'Nombre Completo', value: 'Se incluirá el nombre completo del empleado.' },
    { label: 'Puesto', value: 'Se incluirá el puesto actual del empleado.' },
    { label: 'Departamento', value: 'Se incluirá el departamento al que pertenece el empleado.' },
    { label: 'Fecha de Ingreso', value: 'Se incluirá la fecha en que el empleado ingresó a la empresa.' },
    { label: 'Status', value: 'Se indicará si el empleado está activo o inactivo.' },
    { label: 'Tipo de Contrato', value: 'Se incluirá el tipo de contrato del empleado.' },
  ]);
  
  const exportarReporte = async () => {
    exporting.value = true;
    exportError.value = null;
    try {
      const filename = nombreArchivo.value || 'reporte_empleados';
      await EmpleadoService.exportarReporte(formato.value, filename);
      setTimeout(() => {
        notify(`${filename}`,{ position: 'top-center', duration: 12000, title: 'Descarga Finalizada' });
      }, 6000);
    } catch (error) {
      console.error('Error al exportar el reporte de empleados:', error);
      exportError.value = error.message || 'Error desconocido al exportar.';
      useToastService().error('Hubo un error al generar el reporte.', { title: 'Error al exportar' });
    } finally {
      exporting.value = false;
    }
  };
  </script>