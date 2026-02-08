<template>
  <div class="h-screen bg-gray-100 dark:bg-gray-900 p-2.5 flex flex-col md:flex-row gap-2">
    <aside class="w-full h-auto md:w-72 bg-white dark:bg-gray-800 shadow-md p-4 md:p-6 flex-shrink-0">
      <div class="text-center mb-6">
        <div v-if="authStore.user" class="mb-4">
          <img
            :src="authStore.user.profile_picture_url || 'https://api.dicebear.com/8.x/initials/svg?seed=' + encodeURIComponent(authStore.user.name)"
            alt="Avatar del Usuario"
            class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-teal-500 shadow-xl"
          >
          <p class="mt-3 text-lg font-semibold text-gray-800 dark:text-white">{{ authStore.user.name }}</p>
          <p v-if="authStore.user.role"
            :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold inline-block',
              authStore.user.role === 'supervisor' ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-600 dark:text-white' : 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-white'
            ]"
          >
            {{ authStore.user.role === 'supervisor' ? 'Supervisor' : 'Empleado' }}
          </p>
        </div>
        <p v-else class="text-lg font-medium text-teal-600 dark:text-teal-400">Panel de Empleado</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Herramientas y Recursos</p>
      </div>

      <nav>
        <ul class="space-y-2">
          <li v-if="authStore.user.role !== 'empleado'" >
            <router-link
              :to="{ name: 'dashboard' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" class="h-5 w-5 mr-3" />
              <span>Volver al Panel</span>
            </router-link>
          </li>
          <li class="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></li>
          <li>
            <router-link
              :to="{ name: 'employee-overview' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300  hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
              active-class="bg-teal-500 text-white dark:bg-teal-700 hover:text-gray-400 shadow-md"
            >
              <font-awesome-icon :icon="['fas', 'home']" class="w-5 h-5 mr-3" />
              <span>Inicio del Panel</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-dashboard' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
              active-class="bg-teal-500 text-white dark:bg-teal-700 hover:text-gray-400 shadow-md"
            >
              <font-awesome-icon :icon="['fas', 'chart-pie']" class="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-attendance' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
              active-class="bg-teal-500 text-white dark:bg-teal-700 hover:text-gray-400 shadow-md"
            >
              <font-awesome-icon :icon="['fas', 'clock']" class="w-5 h-5 mr-3" />
              <span>Mis Asistencias</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-vacations' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
              active-class="bg-teal-500 text-white dark:bg-teal-700 hover:text-gray-400 shadow-md"
            >
              <font-awesome-icon :icon="['fas', 'earth-americas']" class="w-5 h-5 mr-3" />
              <span>Mis Vacaciones</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-request-vacation' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
              active-class="bg-teal-500 text-white dark:bg-teal-700 hover:text-gray-400 shadow-md"
            >
              <font-awesome-icon :icon="['fas', 'calendar-plus']" class="w-5 h-5 mr-3" />
              <span>Solicitar Vacaciones</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-consultations' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
              active-class="bg-teal-500 text-white dark:bg-teal-700 hover:text-gray-400 shadow-md"
            >
              <font-awesome-icon :icon="['fas', 'circle-question']" class="w-5 h-5 mr-3" />
              <span>Consultas</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <ul class="space-y-2">
          <li>
            <router-link
              :to="{ name: 'profile-overview' }"
              class="flex items-center p-3 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200 transform hover:scale-105"
            >
              <font-awesome-icon :icon="['fas', 'user']" class="w5 h-5 mr-3" />
              <span>Mi Perfil de Usuario</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'employee-my-data' }"
              class="flex items-center p-3 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200 transform hover:scale-105"
            >
              <font-awesome-icon :icon="['fas', 'id-card']" class="w-5 h-5 mr-3" />
              <span>Mis Datos</span>
            </router-link>
          </li>
        </ul>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto p-2.5">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 min-h-[calc(100vh-6rem)]">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
          {{ $route.meta.title || 'Sección de Empleado' }}
        </h1>
        
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faChartPie, 
  faClock, 
  faEarthAmericas, 
  faCalendarPlus,
  faCircleQuestion, 
  faUser,
  faIdCard,
  faArrowLeft, // ¡Añadido el ícono para "Mis Datos"!
} from '@fortawesome/free-solid-svg-icons';

// Añadir solo los iconos que se usan en este layout
library.add(faArrowLeft, faChartPie, faClock, faEarthAmericas, faCalendarPlus, faCircleQuestion, faUser, faIdCard); // Asegúrate de agregarlo aquí

const authStore = useAuthStore();

</script>

<style scoped>
/* Tailwind CSS es suficiente */
</style>