<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Mis Vacaciones</h2>
    
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen de Días de Vacaciones</h3>
      <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-800 rounded-md">
        <div>
          <p class="text-sm text-blue-700 dark:text-blue-300">Días Disponibles:</p>
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">15</p>
        </div>
        <div>
          <p class="text-sm text-blue-700 dark:text-blue-300">Días Usados este año:</p>
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">5</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <router-link :to="{ name: 'employee-request-vacation' }">
          <UiButton variant="primary">Solicitar Nuevas Vacaciones</UiButton>
        </router-link>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Solicitudes Recientes</h3>
      <ul class="divide-y divide-gray-200 dark:divide-gray-600">
        <li class="py-3 flex justify-between items-center text-gray-700 dark:text-gray-300">
          <span>01/08/2025 - 05/08/2025</span>
          <span class="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200">Aprobada</span>
        </li>
        <li class="py-3 flex justify-between items-center text-gray-700 dark:text-gray-300">
          <span>10/09/2025 - 15/09/2025</span>
          <span class="px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200">Pendiente</span>
        </li>
        <li class="py-3 flex justify-between items-center text-gray-700 dark:text-gray-300">
          <span>01/06/2025 - 03/06/2025</span>
          <span class="px-2 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200">Rechazada</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import UiButton from '@/components/ui/UiButton.vue';
</script>