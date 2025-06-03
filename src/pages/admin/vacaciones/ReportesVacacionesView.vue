<template>
  <div class="container mx-auto p-4 pb-8">
    <div class="bg-indigo-100  rounded-lg p-6 mb-6">
      <h1 class="text-3xl font-semibold text-indigo-700 mb-2">Generación de Reportes de Vacaciones</h1>
      <p class="text-gray-600">
        Selecciona el tipo de reporte de vacaciones que deseas generar. Cada opción te permitirá
        filtrar y exportar la información relevante según tus necesidades.
      </p>
    </div>
    <div class="container mx-auto my-8 md:my-12 p-4 text-center">
      <h1 class="font-semibold text-2xl">Ahora puedes generar reportes en diferentes formatos según tus necesidades.</h1>

      <p class="flex items-center justify-center text-gray-600 space-x-4 mt-8">
        <UiBadge text="Excel" color="green" size="lg" :icon="documentTextIcon" />
        <UiBadge text="PDF" color="pink" size="lg" :icon="documentIcon" />
        <UiBadge text="CSV" color="blue" size="lg" :icon="documentMagnifyingGlassIcon" />
      </p>

      <div class="text-gray-500 mt-14">
        <span class="text-gray-800 font-semibold mb-6">¡Lo sentimos!</span>
        <p>No se puede generar reportes en formato Excel por el momento, por lo que se recomienda utilizar el formato PDF.</p>
        <p>En futuras actualizaciones se podrá generar reportes en formato CSV y convertirlos a Excel.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        :to="{ name: 'reporte-vacaciones-empleado-ciclo' }"
      >
        <UiCard>
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Reporte por Empleado y Ciclo
          </h5>
            <p class="font-normal text-base text-gray-700 dark:text-gray-400">
            Genera un reporte detallado de vacaciones para un empleado específico y su ciclo de servicio.
          </p>
          <template #hoverContent>
            <span class="text-indigo-600 dark:text-indigo-200 text-lg">Ver Reporte</span>
          </template>
        </UiCard>
      </router-link>

      <router-link
        :to="{ name: 'reporte-vacaciones-departamento' }"
        
      >
        <UiCard>
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Reporte por Departamento
          </h5>
          <p class="font-normal text-base text-gray-700 dark:text-gray-400">
            Obtén un resumen de vacaciones por cada departamento.
          </p>
          <template #hoverContent>
            <span class="text-indigo-600 dark:text-indigo-200 text-lg">Explorar Deptos.</span>
          </template>
        </UiCard>
      </router-link>

      <router-link
        :to="{ name: 'reporte-vacaciones-periodo' }"
      >
        <UiCard>
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Reporte por Período de Tiempo
          </h5>
          <p class="font-normal text-base text-gray-700 dark:text-gray-400">
            Visualiza las vacaciones tomadas dentro de un rango de fechas específico.
          </p>
          <template #hoverContent>
            <span class="text-indigo-600 dark:text-indigo-200 text-lg">Definir Período</span>
          </template>
        </UiCard>
      </router-link>

      <router-link
        :to="{ name: 'reporte-vacaciones-dias-tomados-mes' }"
       
      >
        <UiCard >
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Días de Vacación Tomados por Mes
          </h5>
          <p class="font-normal text-base text-gray-700 dark:text-gray-400">
            Analiza los días de vacaciones utilizados por mes a nivel de empresa.
          </p>
          <template #hoverContent>
            <span class="text-indigo-600 dark:text-indigo-200 text-lg">Análisis Mensual</span>
          </template>
        </UiCard>
      </router-link>

      <router-link
        :to="{ name: 'reporte-vacaciones-dias-tomados-semana' }"
        
      >
        <UiCard>
         <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Días de Vacación Tomados por Semana
          </h5>
          <p class="font-normal text-base text-gray-700 dark:text-gray-400">
            Examina los días de vacaciones utilizados por semana.
          </p>
          <template #hoverContent>
            <span class="text-indigo-600 dark:text-indigo-200 text-lg">Análisis Semanal</span>
          </template>
        </UiCard>
      </router-link>

      <router-link
        :to="{ name: 'reporte-vacaciones-top-empleados' }"
        
      >
        <UiCard>
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Top Empleados (Días de Vacación)
          </h5>
          <p class="font-normal text-base text-gray-700 dark:text-gray-400">
            Identifica a los empleados que han tomado más días de vacaciones.
          </p>
          <template #hoverContent>
            <span class="text-indigo-600 dark:text-indigo-200 text-lg ">Ver Ranking</span>
          </template>
        </UiCard>
      </router-link>

      <router-link
        :to="{ name: 'reporte-vacaciones-resumen' }"
        
      >
        <UiCard>
          <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Resumen de Vacaiones
          </h5>
          <p class="font-normal text-base text-gray-700 dark:text-gray-400">
            Se genera una tabla de datos de las vaciones (aprobadas, rechazdas, canceladas, etc..).
          </p>
          <template #hoverContent>
            <span class="text-indigo-600 dark:text-indigo-200 text-lg ">Ver Resumen</span>
          </template>
        </UiCard>
      </router-link>

    </div>

    <div class="my-8">
      <UiDivider label="Generador de reportes" />
    </div>

    <router-view></router-view>
  </div>
</template>

<script setup>
import UiCard from '../../../components/ui/cards/UiCard.vue'; // Verifica la ruta
import UiDivider from '../../../components/ui/UiDivider.vue';


import { DocumentIcon, DocumentMagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import UiBadge from '../../../components/ui/UiBadge.vue'

const documentTextIcon = DocumentTextIcon
const documentIcon = DocumentIcon
const documentMagnifyingGlassIcon = DocumentMagnifyingGlassIcon
</script>

<style scoped>
.hero {
  background-image: linear-gradient(to right, #e0f2fe, #c7d2fe);
}
</style>