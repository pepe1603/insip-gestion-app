<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row">
    <aside class="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md p-4 md:p-6 flex-shrink-0">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Configuración del Perfil</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">Gestiona tu cuenta</p>
      </div>

      <nav>
        <ul class="space-y-2">
          <li>
            <router-link
              :to="{ name: 'profile' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span>Mi Perfil</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'edit-profile' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              <span>Editar Perfil</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'change-password' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-2a2 2 0 01-2-2V9a2 2 0 012-2h2zm2-6H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2z"></path></svg>
              <span>Cambiar Contraseña</span>
            </router-link>
          </li>
          <li v-if="false"> <router-link
              :to="{ name: 'profile-dashboard-info' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <span>Mi Dashboard Info</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="flex-1 p-4 md:p-8 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          {{ $route.meta.title || 'Sección de Perfil' }}
        </h1>
        
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
// No se necesita lógica específica en el script setup para este layout,
// ya que su función principal es proporcionar la estructura y la navegación.
</script>

<style scoped>
/* No se necesitan estilos específicos con scope, Tailwind CSS es suficiente */
</style>