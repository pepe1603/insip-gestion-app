<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Mis Consultas</h2>
    
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Mis Solicitudes de Consulta Recientes</h3>
      <ul class="divide-y divide-gray-200 dark:divide-gray-600">
        <li class="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-700 dark:text-gray-300">
          <div class="mb-2 sm:mb-0">
            <p class="font-semibold">Consulta sobre Deducciones de Nómina</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Enviada: 01/07/2025</p>
          </div>
          <span class="px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200">En Revisión</span>
        </li>
        <li class="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-700 dark:text-gray-300">
          <div class="mb-2 sm:mb-0">
            <p class="font-semibold">Solicitud de Constancia de Empleo</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Enviada: 15/06/2025</p>
          </div>
          <span class="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200">Completada</span>
        </li>
        <li class="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-700 dark:text-gray-300">
          <div class="mb-2 sm:mb-0">
            <p class="font-semibold">Pregunta sobre Beneficios de Salud</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Enviada: 01/06/2025</p>
          </div>
          <span class="px-2 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200">Cerrada</span>
        </li>
      </ul>
      <div class="mt-6 flex justify-end">
        <UiButton variant="primary">Enviar Nueva Consulta</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import UiButton from '@/components/ui/UiButton.vue';
</script>