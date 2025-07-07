<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tu Resumen y Estadísticas</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Total de Proyectos</h3>
        <p class="text-4xl font-bold text-blue-600 dark:text-blue-400">12</p>
        <p class="text-sm text-blue-500 dark:text-blue-300 mt-2">Proyectos activos en tu cuenta.</p>
      </div>

      <div class="bg-orange-50 dark:bg-orange-900 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-orange-800 dark:text-orange-200 mb-2">Tareas Pendientes</h3>
        <p class="text-4xl font-bold text-orange-600 dark:text-orange-400">5</p>
        <p class="text-sm text-orange-500 dark:text-orange-300 mt-2">Revisa tus tareas por hacer.</p>
      </div>

      <div class="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-green-800 dark:text-green-200 mb-2">Notificaciones</h3>
        <p class="text-4xl font-bold text-green-600 dark:text-green-400">3</p>
        <p class="text-sm text-green-500 dark:text-green-300 mt-2">Nuevas alertas para ti.</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Gráfico de Uso (Placeholder)</h3>
      <div class="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400">
        Gráfico o data aquí
      </div>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica específica por ahora, solo la estructura visual.
</script>

<style scoped>
/* No se necesitan estilos específicos */
</style>