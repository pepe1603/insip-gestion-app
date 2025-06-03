<template>
    <div class="container mx-auto p-4 pb-8">
      <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Reporte de Asistencias por Empleado</h1>
  
      <p class="mb-4 text-gray-700">
        Selecciona un empleado y el formato para generar y descargar el reporte de sus asistencias.
      </p>
  
      <div class="mb-6">
        <UiDescriptionList
          title="Información del Reporte de Asistencias"
          description="Esta es la información que se incluirá en el reporte de asistencias del empleado seleccionado."
          :items="reporteInfo"
        />
      </div>
  
      <div class="my-10">
        <UiDivider label="Filtros y Datos del Archivo" />
      </div>
  
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <UiSelect
          v-model="empleadoId"
          id="empleadoId"
          :options="empleadoOptions"
          placeholder="Selecciona un empleado"
          label="Empleado:"
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
          placeholder="reporte_asistencias_empleado"
        />
      </div>
  
      <div class="flex justify-center mt-6">
        <UiButton variant="primary" size="large" :disabled="!empleadoId" @click="generarReporte">
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
  import AsistenciaService from '../../../services/asistenciaService';
  import EmpleadoService from '../../../services/empleadoService';
  
  const empleadoId = ref('');
  const formato = ref('pdf');
  const nombreArchivo = ref('');
  const generando = ref(false);
  const generarError = ref(null);
  const { notify } = useToastService();
  const empleadoOptions = ref([]);
  
  const reporteInfo = ref([
    { label: 'Fecha', value: 'Se incluirá la fecha de la asistencia.' },
    { label: 'Hora de Entrada', value: 'Se incluirá la hora de entrada del empleado.' },
    { label: 'Hora de Salida', value: 'Se incluirá la hora de salida del empleado (si aplica).' },
    { label: 'Tipo de Asistencia', value: 'Se incluirá el tipo de asistencia (ej., entrada, salida, permiso).' },
    // Puedes agregar más información relevante para el reporte de asistencias
  ]);
  
  onMounted(async () => {
    try {
      const empleados = await EmpleadoService.getAll(); // Asegúrate de que este método esté implementado en tu servicio
      empleadoOptions.value = empleados.map(empleado => ({
        label: `${empleado.nombre} ${empleado.ape_paterno}`,
        value: empleado.id,
      }));
    } catch (error) {
      console.error('Error al cargar la lista de empleados:', error);
      useToastService().error('No se pudo cargar la lista de empleados.', { title: 'Error' });
    }
  });
  
  const generarReporte = async () => {
    if (!empleadoId.value) {
      useToastService().warning('Por favor, selecciona un empleado.', { title: 'Advertencia' });
      return;
    }
    if (!formato.value) {
      useToastService().warning('Por favor, selecciona un formato de exportación.', { title: 'Advertencia' });
      return;
    }
    if (nombreArchivo.value && nombreArchivo.value.length > 50) {// Limitar el nombre del archivo a 50 caracteres
      useToastService().warning('El nombre del archivo no puede exceder los 50 caracteres.', { title: 'Advertencia' });
      return;
    }

    //logeear datos de la exportacion
    console.log('Datos de exportación:', {
      empleadoId: empleadoId.value,
      formato: formato.value,
      nombreArchivo: nombreArchivo.value,
    });
  
    generando.value = true;
    generarError.value = null;
    try {
      const filename = nombreArchivo.value || `reporte_asistencias_empleado_${empleadoId.value}`;
      const response = await AsistenciaService.porEmpleado(empleadoId.value, {
        format: formato.value,
        filename: filename, // Ajusta el nombre del parámetro según tu API
      }, { responseType: 'blob' }); // Importante para manejar la descarga
  
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Crear un enlace <a> para iniciar la descarga
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.${formato.value}`); // Define el nombre del archivo y la extensión
      document.body.appendChild(link);
  
      // Simular un clic en el enlace para iniciar la descarga
      link.click();
  
      // Limpiar el objeto URL
      window.URL.revokeObjectURL(url);
  
      notify(`${filename}.${formato.value}`, { position: 'top-center', duration: 12000, title: 'Descarga Finalizada' });
  
    } catch (error) {
      console.error('Error al generar el reporte de asistencias:', error);
      generarError.value = error.message || 'Error desconocido al generar el reporte.';
      useToastService().error('Hubo un error al generar el reporte de asistencias.', { title: 'Error al exportar' });
    } finally {
      generando.value = false;
    }
  };
  </script>