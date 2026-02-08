<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row">
    <aside class="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md p-4 md:p-6 flex-shrink-0">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Configuración del Perfil</h2>
      </div>
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
        <p v-else class="text-lg font-medium text-teal-600 dark:text-teal-400">Panel de Usuario</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Gestiona tu cuenta</p>
      </div>

      <nav>
        <ul class="space-y-2">
            <li v-if="authStore.user && authStore.user.role !== 'employee'">
            <router-link
              :to="{ name: 'dashboard' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" class="h-5 w-5 mr-3" />
              <span>Volver al Panel</span>
            </router-link>
            </li>
            <li v-else-if="authStore.user && authStore.user.role == 'employee'">
            <router-link
              :to="{ name: 'employee-my-data' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" class="h-5 w-5 mr-3" />
              <span>Ir al Panel Empleado</span>
            </router-link>
            </li>
          <li class="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></li>
          <li>
            <router-link
              :to="{ name: 'profile-overview' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'home']" class="h-5 w-5 mr-3" />
              <span>Inicio del Panel</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'profile-details' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'user']" class="h-5 w-5 mr-3" />
              <span>Mi Perfil</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'edit-profile' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'user-pen']" class="h-5 w-5 mr-3" />
              <span>Editar Perfil</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'change-password' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'key']" class="h-5 w-5 mr-3" />
              <span>Cambiar Contraseña</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'verify-email' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'envelope-circle-check']" class="h-5 w-5 mr-3" />
              <span>Verificar Email</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'security' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'shield-alt']" class="h-5 w-5 mr-3" /> <span>Seguridad</span>
            </router-link>
          </li>
          <li v-if="false">
            <router-link
              :to="{ name: 'profile-dashboard-info' }"
              class="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200"
              active-class="bg-indigo-500 text-white dark:bg-indigo-700"
            >
              <font-awesome-icon :icon="['fas', 'chart-line']" class="h-5 w-5 mr-3" />
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
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faUser,
  faUserPen,
  faKey,
  faEnvelopeCircleCheck,
  faChartLine,
  faShieldAlt // Nuevo icono para seguridad
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../stores/authStore';
// No necesitas importar FontAwesomeIcon aquí si ya lo registras globalmente en main.js

library.add(faArrowLeft, faUser, faUserPen, faKey, faEnvelopeCircleCheck, faChartLine, faShieldAlt);

const authStore = useAuthStore();
</script>

<style scoped>
/* No se necesitan estilos específicos con scope, Tailwind CSS es suficiente */
</style>