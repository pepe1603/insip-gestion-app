<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Exportar Reporte de Departamentos</h1>
  
      <p class="mb-4 text-gray-700">
        Aquí puedes generar y descargar un reporte con la información de todos los departamentos registrados en el sistema.
      </p>
  
      <div class="mb-6 border border-gray-200 rounded-md p-4 bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-300">Vista Previa del Reporte</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          (Esta es una vista previa básica de la información que se incluirá en el reporte.)
        </p>
        <ul class="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-400">
          <li>Nombre del Departamento</li>
          <li>Descripción del Departamento</li>
          <li>Fecha de Creación</li>
          <li>Fecha de Actualización</li>
          </ul>
      </div>
  
      <div class="flex justify-center">
        <UiButton variant="primary" size="large" @click="descargarReporte">
          <DocumentArrowDownIcon class="w-6 h-6 mr-2" /> Descargar Reporte
        </UiButton>
      </div>
  
      <div v-if="descargando" class="mt-4 text-center text-gray-500">Descargando el reporte...</div>
      <div v-if="errorDescarga" class="mt-4 text-center text-red-500">Error al descargar el reporte: {{ errorDescarga }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import DepartamentosService from '../../../services/departamentosService';
  import UiButton from '../../../components/ui/UiButton.vue';
  import { useToastService } from '../../../services/toastService';
  import { DocumentArrowDownIcon } from '@heroicons/vue/20/solid';
  
  const descargando = ref(false);
  const errorDescarga = ref(null);
  const { notify } = useToastService();
  
  const descargarReporte = async () => {
    descargando.value = true;
    errorDescarga.value = null;
    try {
      const reporteBlob = await DepartamentosService.exportarDepartamentos();
      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(reporteBlob);
      const a = document.createElement('a');
      let filenameDefault;
      a.href = url;
       filenameDefault =  `reporte_departamentos_${new Date().toISOString().slice(0, 10)}.pdf`; // Nombre del archivo por defecto
       a.download =filenameDefault
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url); // Limpiar la URL creada
      descargando.value = false;

      setTimeout(() => {
        notify(`${filenameDefault}`,{ position: 'top-center', duration: 12000, title: 'Descarga Finalizada' });
      }, 6000);
      
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
      errorDescarga.value = error;
      descargando.value = false;
    }
  };
  </script>