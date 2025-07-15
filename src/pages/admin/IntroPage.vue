<template>
  <div class="min-h-screen p-6 sm:p-8 bg-gray-50">
    <div class="bg-white rounded-lg shadow-md p-8 mb-10 text-center">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        Bienvenido, {{ authStore.user?.role }}/a
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Gestiona eficientemente todos los aspectos del sistema desde aquí. Utiliza el menú lateral para navegar o los accesos rápidos a continuación.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Accesos Directos a Módulos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        <router-link
          to="/admin/empleados/lista"
          class="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md text-blue-800 group"
        >
          <font-awesome-icon :icon="['fas', 'user-tie']" class="text-5xl text-blue-600 mb-4 group-hover:text-blue-700 transition-colors" />
          <span class="font-semibold text-lg text-center">Gestión de Empleados</span>
          <p class="text-sm text-gray-600 mt-1">Alta, edición y búsqueda</p>
        </router-link>

        <router-link
          to="/admin/vacaciones/administrar"
          class="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md text-green-800 group"
        >
          <font-awesome-icon :icon="['fas', 'calendar-check']" class="text-5xl text-green-600 mb-4 group-hover:text-green-700 transition-colors" />
          <span class="font-semibold text-lg text-center">Solicitudes de Vacaciones</span>
          <p class="text-sm text-gray-600 mt-1">Administra aprobaciones</p>
        </router-link>

        <router-link
          to="/admin/asistencias/lista"
          class="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md text-purple-800 group"
        >
          <font-awesome-icon :icon="['fas', 'clipboard-check']" class="text-5xl text-purple-600 mb-4 group-hover:text-purple-700 transition-colors" />
          <span class="font-semibold text-lg text-center">Registros de Asistencia</span>
          <p class="text-sm text-gray-600 mt-1">Consulta y gestiona</p>
        </router-link>

        <router-link
          to="/admin/dashboard"
          class="flex flex-col items-center justify-center p-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md text-yellow-800 group"
        >
          <font-awesome-icon :icon="['fas', 'chart-line']" class="text-5xl text-yellow-600 mb-4 group-hover:text-yellow-700 transition-colors" />
          <span class="font-semibold text-lg text-center">Dashboard de Análisis</span>
          <p class="text-sm text-gray-600 mt-1">Estadísticas y reportes</p>
        </router-link>

        <router-link
          to="/admin/configuracion/general"
          class="flex flex-col items-center justify-center p-6 bg-red-50 hover:bg-red-100 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md text-red-800 group"
        >
          <font-awesome-icon :icon="['fas', 'cog']" class="text-5xl text-red-600 mb-4 group-hover:text-red-700 transition-colors" />
          <span class="font-semibold text-lg text-center">Configuración del Sistema</span>
          <p class="text-sm text-gray-600 mt-1">Ajustes generales</p>
        </router-link>

        <router-link
          to="/admin/vacaciones-oficiales/lista"
          class="flex flex-col items-center justify-center p-6 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md text-indigo-800 group"
        >
          <font-awesome-icon :icon="['fas', 'holly-berry']" class="text-5xl text-indigo-600 mb-4 group-hover:text-indigo-700 transition-colors" />
          <span class="font-semibold text-lg text-center">Días Festivos Oficiales</span>
          <p class="text-sm text-gray-600 mt-1">Administra el calendario</p>
        </router-link>

      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Noticias y Anuncios</h2>
      <ul class="space-y-4">
        <li class="flex items-start">
          <font-awesome-icon :icon="['fas', 'info-circle']" class="text-blue-500 text-xl mr-3 mt-1 flex-shrink-0" />
          <div>
            <p class="font-semibold text-gray-800">Actualización de Política de Privacidad</p>
            <p class="text-gray-600 text-sm">Se ha actualizado la política de privacidad. Revísala para conocer los cambios. (01/07/2025)</p>
          </div>
        </li>
        <li class="flex items-start">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="text-yellow-500 text-xl mr-3 mt-1 flex-shrink-0" />
          <div>
            <p class="font-semibold text-gray-800">Mantenimiento Programado del Sistema</p>
            <p class="text-gray-600 text-sm">El sistema estará inactivo por mantenimiento el 15 de Julio de 2 AM a 4 AM. (08/07/2025)</p>
          </div>
        </li>
        <li v-if="announcements.length === 0" class="text-center text-gray-500 py-4">
          No hay anuncios recientes.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
// No necesitamos nada más por ahora, ya que no estamos cargando datos complejos.

const authStore = useAuthStore();

// Datos de ejemplo para anuncios (puedes hacer esto dinámico en el futuro)
const announcements = ref([
  { id: 1, type: 'info', title: 'Actualización de Política de Privacidad', message: 'Se ha actualizado la política de privacidad. Revísala para conocer los cambios.', date: '01/07/2025' },
  { id: 2, type: 'warning', title: 'Mantenimiento Programado del Sistema', message: 'El sistema estará inactivo por mantenimiento el 15 de Julio de 2 AM a 4 AM.', date: '08/07/2025' },
]);
</script>

<style scoped>
/* Puedes añadir estilos específicos para IntroPage aquí si es necesario,
   aunque Tailwind CSS debería manejar la mayoría de los casos. */
</style>