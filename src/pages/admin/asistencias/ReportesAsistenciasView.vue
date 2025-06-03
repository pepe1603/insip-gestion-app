<template>
    <div class="container mx-auto p-4 pb-8">
      <div class="hero bg-indigo-100 rounded-lg p-6 mb-6">
        <h1 class="text-3xl font-semibold text-indigo-700 mb-2">Generación de Reportes de Asistencia</h1>
        <p class="text-gray-600">
          Selecciona el tipo de reporte de asistencia que deseas generar. Cada opción te permitirá
          filtrar y exportar la información relevante según tus necesidades.
        </p>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          :to="{ name: 'reporte-asistencias-empleado' }"
          class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Reporte por Empleado
          </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Genera un reporte de asistencias para un empleado específico.
          </p>
        </router-link>
  
        <router-link
          :to="{ name: 'reporte-asistencias-mes' }"
          class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Reporte por Mes
          </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Genera un reporte de asistencias para todos los empleados de un mes.
          </p>
        </router-link>
  
        <router-link
          :to="{ name: 'reporte-asistencias-rango-fechas' }"
          class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Reporte por Rango de Fechas
          </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Genera un reporte de asistencias para un período de tiempo específico.
          </p>
        </router-link>
  
        </div>
  
      <router-view></router-view>
    </div>
  </template>
  
  <script setup>
  // No se necesita mucha lógica aquí, principalmente la estructura y los enlaces.
  </script>