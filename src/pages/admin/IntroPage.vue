<template>
  <div class="min-h-screen p-6 sm:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
      Dashboard Principal
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Usuarios Activos</h2>
        <p class="text-4xl font-bold text-blue-600">1,234</p>
        <p class="text-sm text-gray-500 mt-2">Última actualización: hace 5 min</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Proyectos Pendientes</h2>
        <p class="text-4xl font-bold text-yellow-600">45</p>
        <p class="text-sm text-gray-500 mt-2">Necesitan tu atención</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Ingresos del Mes</h2>
        <p class="text-4xl font-bold text-green-600">$12,345</p>
        <p class="text-sm text-gray-500 mt-2">+10% respecto al mes anterior</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Nuevos Mensajes</h2>
        <p class="text-4xl font-bold text-red-600">7</p>
        <p class="text-sm text-gray-500 mt-2">Sin leer</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Accesos Rápidos</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <router-link to="/users" class="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 ease-in-out">
          <i class="fas fa-users text-3xl text-blue-600 mb-2"></i>
          <span class="text-blue-800 font-medium text-center">Gestión de Usuarios</span>
        </router-link>

        <router-link to="/projects" class="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition duration-200 ease-in-out">
          <i class="fas fa-folder-open text-3xl text-green-600 mb-2"></i>
          <span class="text-green-800 font-medium text-center">Mis Proyectos</span>
        </router-link>

        <router-link to="/settings" class="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-200 ease-in-out">
          <i class="fas fa-cog text-3xl text-purple-600 mb-2"></i>
          <span class="text-purple-800 font-medium text-center">Configuración</span>
        </router-link>

        <router-link to="/reports" class="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition duration-200 ease-in-out">
          <i class="fas fa-chart-line text-3xl text-yellow-600 mb-2"></i>
          <span class="text-yellow-800 font-medium text-center">Ver Reportes</span>
        </router-link>

        <router-link to="/messages" class="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition duration-200 ease-in-out">
          <i class="fas fa-envelope text-3xl text-red-600 mb-2"></i>
          <span class="text-red-800 font-medium text-center">Mensajes</span>
        </router-link>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
      <ul>
        <li v-for="activity in recentActivities" :key="activity.id" class="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200">
          <div class="flex items-center">
            <span :class="['w-2 h-2 rounded-full mr-3', activity.type === 'new' ? 'bg-green-500' : 'bg-blue-500']"></span>
            <p class="text-gray-700">
              <span class="font-semibold">{{ activity.user }}</span> {{ activity.action }}
            </p>
          </div>
          <span class="text-sm text-gray-500">{{ activity.time }}</span>
        </li>
      </ul>
      <div v-if="recentActivities.length === 0" class="text-center text-gray-500 py-4">
        No hay actividad reciente.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Datos de ejemplo para la actividad reciente
const recentActivities = ref([
  { id: 1, user: 'Juan Pérez', action: 'creó un nuevo proyecto "Marketing Digital"', type: 'new', time: 'hace 10 min' },
  { id: 2, user: 'María García', action: 'actualizó el estado del ticket #123', type: 'update', time: 'hace 30 min' },
  { id: 3, user: 'Carlos Ruiz', action: 'añadió 3 nuevos usuarios', type: 'new', time: 'hace 1 hora' },
  { id: 4, user: 'Ana López', action: 'comentó en "Reporte Mensual"', type: 'update', time: 'hace 2 horas' },
]);

// Puedes agregar más lógica aquí, como:
// - Cargar datos de la API para las tarjetas de resumen
// - Lógica para gráficos (si implementas librerías de gráficos)
// - Watchers para actualizar la información periódicamente
</script>

<style scoped>
/* Aquí podrías agregar estilos SCSS/CSS específicos si los necesitas,
   aunque la mayoría ya está cubierto por Tailwind. */
</style>