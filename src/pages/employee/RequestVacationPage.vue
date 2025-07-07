<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Solicitar Nuevas Vacaciones</h2>
    
    <form @submit.prevent="submitVacationRequest">
      <div class="space-y-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Inicio</label>
          <input
            type="date"
            id="startDate"
            v-model="startDate"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Fin</label>
          <input
            type="date"
            id="endDate"
            v-model="endDate"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razón (Opcional)</label>
          <textarea
            id="reason"
            v-model="reason"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Ej. Viaje familiar, descanso personal, etc."
          ></textarea>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <router-link :to="{ name: 'employee-vacations' }">
            <UiButton variant="secondary" type="button">Cancelar</UiButton>
          </router-link>
          <UiButton variant="primary" type="submit">Enviar Solicitud</UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UiButton from '@/components/ui/UiButton.vue';

const startDate = ref('');
const endDate = ref('');
const reason = ref('');

const submitVacationRequest = () => {
  if (!startDate.value || !endDate.value) {
    alert('Por favor, selecciona una fecha de inicio y fin para tus vacaciones.');
    return;
  }
  // Lógica para enviar la solicitud (futuramente con API)
  console.log('Solicitud de vacaciones:', {
    startDate: startDate.value,
    endDate: endDate.value,
    reason: reason.value,
  });
  alert('Solicitud de vacaciones enviada (simulado)');
  // Limpiar campos después de enviar
  startDate.value = '';
  endDate.value = '';
  reason.value = '';
  // router.push({ name: 'employee-vacations' }); // Redirigir después de enviar
};
</script>