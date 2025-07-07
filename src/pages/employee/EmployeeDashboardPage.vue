<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Bienvenido a tu Espacio de Empleado</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-teal-50 dark:bg-teal-900 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-teal-800 dark:text-teal-200 mb-2">Días de Vacaciones Restantes</h3>
        <p class="text-4xl font-bold text-teal-600 dark:text-teal-400">15</p>
        <p class="text-sm text-teal-500 dark:text-teal-300 mt-2">Puedes solicitar nuevas vacaciones.</p>
        <router-link :to="{ name: 'employee-request-vacation' }" class="text-teal-600 dark:text-teal-400 text-sm mt-3 inline-block hover:underline">Solicitar ahora</router-link>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Última Asistencia</h3>
        <p class="text-xl font-bold text-blue-600 dark:text-blue-400">Hoy, 10:00 AM</p>
        <p class="text-sm text-blue-500 dark:text-blue-300 mt-2">Revisa tu historial completo.</p>
        <router-link :to="{ name: 'employee-attendance' }" class="text-blue-600 dark:text-blue-400 text-sm mt-3 inline-block hover:underline">Ver historial</router-link>
      </div>

      <div class="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">Próxima Consulta</h3>
        <p class="text-xl font-bold text-yellow-600 dark:text-yellow-400">Ninguna programada</p>
        <p class="text-sm text-yellow-500 dark:text-yellow-300 mt-2">Gestiona tus consultas con RRHH.</p>
        <router-link :to="{ name: 'employee-consultations' }" class="text-yellow-600 dark:text-yellow-400 text-sm mt-3 inline-block hover:underline">Ir a Consultas</router-link>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Anuncios Recientes</h3>
      <ul class="space-y-3 text-gray-700 dark:text-gray-300">
        <li>- Recordatorio: Envío de reportes mensuales el día 25.</li>
        <li>- Aviso: Mantenimiento del sistema el sábado 15 de julio.</li>
        <li>- Evento: Charla de bienestar el 20 de julio, sala 3.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica específica por ahora
</script>

<style scoped>
/* Tailwind CSS es suficiente */
</style>