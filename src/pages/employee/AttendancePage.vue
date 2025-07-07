<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Historial de Asistencias</h2>
    
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Registro Mensual (Julio 2025)</h3>
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entrada</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salida</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Horas</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600 text-gray-700 dark:text-gray-300">
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">06/07/2025</td>
            <td class="px-6 py-4 whitespace-nowrap">09:00 AM</td>
            <td class="px-6 py-4 whitespace-nowrap">06:00 PM</td>
            <td class="px-6 py-4 whitespace-nowrap">9h</td>
            <td class="px-6 py-4 whitespace-nowrap text-green-500">Normal</td>
          </tr>
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">05/07/2025</td>
            <td class="px-6 py-4 whitespace-nowrap">09:15 AM</td>
            <td class="px-6 py-4 whitespace-nowrap">06:00 PM</td>
            <td class="px-6 py-4 whitespace-nowrap">8h 45m</td>
            <td class="px-6 py-4 whitespace-nowrap text-orange-500">Tardía</td>
          </tr>
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">04/07/2025</td>
            <td class="px-6 py-4 whitespace-nowrap">09:00 AM</td>
            <td class="px-6 py-4 whitespace-nowrap">06:00 PM</td>
            <td class="px-6 py-4 whitespace-nowrap">9h</td>
            <td class="px-6 py-4 whitespace-nowrap text-green-500">Normal</td>
          </tr>
          </tbody>
      </table>
      <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Total de horas trabajadas este mes: 160h (simulado)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Lógica para mostrar la asistencia
</script>