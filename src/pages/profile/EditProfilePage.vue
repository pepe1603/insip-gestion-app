<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Editar Información Personal</h2>
    
    <form @submit.prevent="saveProfile">
      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Tu nombre y apellido"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="ejemplo@dominio.com"
            disabled />
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">El correo electrónico no puede ser cambiado directamente desde aquí.</p>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
          <input
            type="tel"
            id="phone"
            v-model="phone"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="+52 55 1234 5678"
          />
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <router-link :to="{ name: 'profile' }">
            <UiButton variant="secondary" type="button">Cancelar</UiButton>
          </router-link>
          <UiButton variant="primary" type="submit">Guardar Cambios</UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UiButton from '@/components/ui/UiButton.vue'; // Asegúrate de importar tu componente de botón

// Datos de ejemplo (futuramente vendrán de una API/store)
const name = ref('John Doe');
const email = ref('john.doe@example.com');
const phone = ref('+52 55 1234 5678');

const saveProfile = () => {
  // Lógica para guardar el perfil (futuramente con API)
  console.log('Guardando perfil:', {
    name: name.value,
    email: email.value,
    phone: phone.value,
  });
  alert('Perfil actualizado (simulado)');
  // router.push({ name: 'profile' }); // Redirigir de vuelta al perfil después de guardar
};
</script>

<style scoped>
/* No se necesitan estilos específicos */
</style>