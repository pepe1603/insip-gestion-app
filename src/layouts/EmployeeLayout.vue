<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row">
    <aside class="w-full md:w-72 bg-white dark:bg-gray-800 shadow-md p-4 md:p-6 flex-shrink-0">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Panel de Empleado</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">Herramientas y Recursos</p>
      </div>

      <nav>
        <ul class="space-y-2">
          <li>
            <router-link
              :to="{ name: 'employee-dashboard' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-teal-500 text-white dark:bg-teal-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-attendance' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-teal-500 text-white dark:bg-teal-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Mis Asistencias</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-vacations' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-teal-500 text-white dark:bg-teal-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.111l-6.572-5.474a2 2 0 00-2.856 0L3 11.111M21 11.111V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-7.889M10 11h4M3 21h18a2 2 0 002-2v-8.889a2 2 0 00-.572-1.428l-6.572-5.474a2 2 0 00-2.856 0L.572 10.683A2 2 0 000 12.111V19a2 2 0 002 2z"></path></svg>
              <span>Mis Vacaciones</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-request-vacation' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-teal-500 text-white dark:bg-teal-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Solicitar Vacaciones</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-consultations' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-teal-500 text-white dark:bg-teal-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9.247a3 3 0 100 5.506m0-5.506a3 3 0 110 5.506M9.25 12a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm7.772 2.753a3 3 0 100-5.506m0 5.506a3 3 0 110-5.506M14.75 12a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Consultas</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <router-link
          :to="{ name: 'profile' }"
          class="flex items-center p-3 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span>Mi Perfil de Usuario</span>
        </router-link>
      </div>
    </aside>

    <main class="flex-1 p-4 md:p-8 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          {{ $route.meta.title || 'Sección de Empleado' }}
        </h1>
        
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
// No se necesita lógica específica aquí por ahora
</script>

<style scoped>
/* Tailwind CSS es suficiente */
</style>