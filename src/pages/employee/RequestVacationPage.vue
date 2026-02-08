<template>
  <div class="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
      Solicitar Nuevas Vacaciones
    </h2>

      <div v-if="loading" class="flex flex-col items-center justify-center p-4">
        <UiSpinner class="h-6 w-6 text-teal-600 animate-spin" />
        <p class="ml-3 text-gray-600 dark:text-gray-300 mt-2">Cargando...</p>
      </div>
    
    <div v-if="employeeIdError" class="bg-red-100 dark:bg-red-800 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md mb-6">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 mr-3 flex-shrink-0" />
        <div>
          <p class="font-bold">Error de Acceso:</p>
          <p class="text-sm">{{ employeeIdError }}</p>
          <p class="text-xs mt-1">Por favor, intenta cerrar sesión y volver a iniciarla. Si el problema persiste, contacta a soporte técnico.</p>
        </div>
      </div>
    </div>

    <div v-else class="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <InformationCircleIcon class="h-6 w-6 text-blue-600 dark:text-blue-300" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700 dark:text-blue-200">
            Completa este formulario para enviar tu solicitud de vacaciones. Por favor, asegúrate de que las fechas seleccionadas sean correctas. Una vez enviada, tu solicitud será revisada por el equipo de RRHH.
          </p>
        </div>
      </div>
    </div>

    <UiAlert type="danger" v-if="errorRequestVacation">
      <h1>Error al Solicitrar tus vacaciones</h1>
      <p>
        {{ errorRequestVacation }}
      </p>

    </UiAlert>


    <form @submit.prevent="submitVacationRequest">
      <div class="space-y-5">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Inicio</label>
          <input
            type="date"
            id="startDate"
            v-model="startDate"
            :min="minDate"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
            :disabled="isSubmitting || employeeIdError"
            required
          />
          <p v-if="dateError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ dateError }}</p>
        </div>

        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Fin</label>
          <input
            type="date"
            id="endDate"
            v-model="endDate"
            :min="startDate || minDate"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
            :disabled="isSubmitting || employeeIdError"
            required
          />
          <p v-if="dateError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ dateError }}</p>
        </div>

        <div>
          <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razón (Opcional)</label>
          <textarea
            id="reason"
            v-model="reason"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
            placeholder="Ej. Viaje familiar, descanso personal, etc."
            :disabled="isSubmitting || employeeIdError"
          ></textarea>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <router-link :to="{ name: 'employee-vacations' }">
            <UiButton variant="secondary" type="button" :disabled="isSubmitting || employeeIdError">Cancelar</UiButton>
          </router-link>
          <UiButton variant="primary" type="submit" :disabled="isSubmitting || employeeIdError">
            <UiSpinner v-if="isSubmitting" class="h-4 w-4 mr-2 text-white" />
            {{ isSubmitting ? 'Enviando...' : 'Enviar Solicitud' }}
          </UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // Importar onMounted
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalToast } from '@/composables/useGlobalToast';
import vacacionesService from '@/services/vacacionesService';

// Componentes UI
import UiButton from '@/components/ui/UiButton.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiAlert from '@/components/ui/UiAlert.vue';

// Heroicons
import { InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'; // Importar ExclamationTriangleIcon

const router = useRouter();
const authStore = useAuthStore();
const $toast = useGlobalToast();

const startDate = ref('');
const endDate = ref('');
const reason = ref('');
const isSubmitting = ref(false);
const dateError = ref(null);
const errorRequestVacation = ref(null);
const employeeIdError = ref(null); // Nuevo ref para el error de empleado_id
const loading = ref(null);

// Calcula la fecha mínima permitida (hoy)
const minDate = computed(() => {
  const today = new Date();
  today.setDate(today.getDate());
  return today.toISOString().split('T')[0];
});

// Función para validar las fechas
const validateDates = () => {
  dateError.value = null;
  if (!startDate.value || !endDate.value) {
    dateError.value = 'Ambas fechas son obligatorias.';
    return false;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (start > end) {
    dateError.value = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  if (start < today) {
    dateError.value = 'La fecha de inicio no puede ser en el pasado.';
    return false;
  }

  return true;
};

// Función para verificar la disponibilidad del empleado_id al cargar la página
const checkEmployeeIdAvailability = () => {
  loading.value = true;
  const empleadoId = authStore.user?.empleado_id;
  if (!empleadoId) {
    employeeIdError.value = 'No se pudo verificar tu identidad de empleado. Por favor, intenta de nuevo.';
    // No lanzar un toast aquí, ya que el bloque visual es suficiente
    return false;
  }
  loading.value = false;
  employeeIdError.value = null; // Limpiar si antes había un error
  return true;
};

const submitVacationRequest = async () => {
  if (employeeIdError.value) { // Si ya hay un error de ID, no permitir el envío
    $toast?.error('No se puede enviar la solicitud debido a un error de identidad.', { duration: 5000 });
    return;
  }

  if (!validateDates()) {
    $toast?.error(dateError.value, { title: 'Error de Fechas' });
    return;
  }

  isSubmitting.value = true;
  dateError.value = null;
  errorRequestVacation.value = null;

  const empleadoId = authStore.user?.empleado_id;
  if (!empleadoId) { // Esta comprobación debería haber sido cubierta por checkEmployeeIdAvailability
    employeeIdError.value = 'No se pudo obtener el ID del empleado para enviar la solicitud.';
    $toast?.error(employeeIdError.value, { duration: 5000 });
    isSubmitting.value = false;
    return;
  }

  try {
    const payload = {
      empleado_id: empleadoId,
      fecha_inicio: startDate.value,
      fecha_fin: endDate.value,
      observaciones: reason.value || null,
    };
    
    // Asumiendo que 'vacacionesService.create' es el método correcto para enviar
    const response = await vacacionesService.create(payload); 
    console.log('Respuesta de solicitud:', response);

    $toast?.success('¡Solicitud de vacaciones enviada con éxito!', { duration: 3000 });
    
    startDate.value = '';
    endDate.value = '';
    reason.value = '';
    router.push({ name: 'employee-vacations' }); 

  } catch (error) {
    console.error('Error al enviar solicitud de vacaciones:', error);
    const errorMessage = error.response?.data?.message || 'Error desconocido al enviar la solicitud de vacaciones.';
    $toast?.error(errorMessage, { title: 'Error al Enviar Solicitud' });
    errorRequestVacation.value = error;
  } finally {
    isSubmitting.value = false;
  }
};

// Verificar el ID del empleado al montar el componente
onMounted(() => {
  checkEmployeeIdAvailability();
});
</script>

<style scoped>
/* No se necesitan estilos específicos de `style` aquí si todo es Tailwind */
</style>