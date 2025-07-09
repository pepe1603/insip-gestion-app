<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Información General del Perfil</h2>

    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <UiSpinner class="h-8 w-8 text-indigo-500" />
      <p class="ml-3 text-gray-600 dark:text-gray-300">Cargando datos del perfil...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">¡Error!</strong>
      <span class="block sm:inline"> No se pudieron cargar los datos del perfil. Por favor, inténtalo de nuevo más tarde.</span>
      <p v-if="error" class="text-sm mt-2">{{ error }}</p>
    </div>

    <div v-else-if="userData" class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div v-if="!userData.email_verified" class="rounded-xs md:col-span-2 bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-4" role="alert">
        <div class="flex">
          <div class="py-1">
            <svg class="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
          </div>
          <div>
            <p class="font-bold">¡Tu correo electrónico no ha sido verificado!</p>
            <p class="text-sm">Por favor, verifica tu correo electrónico para acceder a todas las funcionalidades. Revisa tu bandeja de entrada para el enlace de verificación.</p>
            <router-link :to="{ name: 'verify-email' }" class="font-semibold underline text-yellow-800 dark:text-yellow-100 mt-2 block">
              Ir a la página de verificación
            </router-link>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <font-awesome-icon :icon="['fas', 'user']" class="mr-2 text-indigo-500" />
          Datos Personales
        </h3>
        <div class="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Nombre: </strong> <span class="font-normal">{{ userData.user.name }}</span></p>
          <p>
            <strong>Correo Electrónico: </strong>
            <span class="font-normal">{{ userData.user.email }}</span>
            <span v-if="userData.email_verified" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 ml-2">
              <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
              Verificado
            </span>
            <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 ml-2">
              <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
              No Verificado
            </span>
          </p>
          <p>
            <strong>Fecha de Registro: </strong>
            <span class="font-normal">{{ formatDate(userData.user.created_at) }}</span>
          </p>
          <p>
            <strong>Rol: </strong>
            <span class="font-normal capitalize">{{ userData.user.role }}</span>
          </p>
        </div>
        <div class="mt-6 flex justify-end">
          <router-link :to="{ name: 'edit-profile' }">
            <UiButton variant="secondary">
              <font-awesome-icon :icon="['fas', 'user-pen']" class="mr-2" /> Editar Perfil
            </UiButton>
          </router-link>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="h-5 w-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 001 1h2a1 1 0 100-2h-2a1 1 0 00-1 1z" clip-rule="evenodd" /></svg>
          Estado de la Cuenta
        </h3>
        <div class="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Estado: </strong>
            <span class="font-normal" :class="userData.user.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ userData.user.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </p>
          <p>
            <strong>Último inicio de sesión: </strong>
            <span class="font-normal">{{ userData.user.last_login ? formatDate(userData.user.last_login) : 'Nunca' }}</span>
          </p>
          <p>
            <strong>Contraseña: </strong>
            <span class="font-normal text-amber-600 dark:text-amber-400">
              <font-awesome-icon :icon="['fas', 'circle-question']" class="mr-1" />
              Recomendado cambiar cada 90 días
            </span>
          </p>
        </div>
        <div class="mt-6 flex justify-end">
          <router-link :to="{ name: 'change-password' }">
            <UiButton variant="secondary">
              <font-awesome-icon :icon="['fas', 'key']" class="mr-2" /> Cambiar Contraseña
            </UiButton>
          </router-link>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'chart-simple']" class="mr-2 text-indigo-500" />
        Actividad Reciente
      </h3>
      <ul class="space-y-3 text-gray-700 dark:text-gray-300">
        <li>- 05/07/2025: Actualización de email</li>
        <li>- 01/07/2025: Acceso desde nueva IP</li>
        <li>- 28/06/2025: Inicio de sesión exitoso</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { profileService } from '@/services/profileService';
import UiButton from '@/components/ui/UiButton.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
// Importa el ícono de la flecha de Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faUserPen, faKey } from '@fortawesome/free-solid-svg-icons'; // Asegúrate de tener estos íconos en tu librería

// Añade los íconos a la librería global (aunque ya lo haces en main.js, es bueno tenerlo aquí si se usan localmente)
library.add(faArrowLeft, faUserPen, faKey);

const userData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await profileService.getProfile();
    // La respuesta del backend es { user: {...}, email_verified: true }
    userData.value = response;
  } catch (err) {
    console.error("Error al obtener el perfil:", err);
    error.value = err.message || 'Ocurrió un error al cargar tu perfil.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* No se necesitan estilos específicos, Tailwind CSS es suficiente */
</style>