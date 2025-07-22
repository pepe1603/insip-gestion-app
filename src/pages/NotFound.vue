<template>
  <main class="grid min-h-full min-w-full place-items-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-6 py-24 sm:py-32 lg:px-8 ">
    <div class="text-center">
      <p class="text-3xl font-semibold text-indigo-600">404</p>
      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 dark:text-gray-100 sm:text-7xl">No Encontrado</h1>
      <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Lo siento, no pudimos encontrar la página que estás buscando. Pero si no cambias de dirección, y si sigues buscando, puedes terminar hacia dónde te diriges.</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <button @click="goBack" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Regresar</button>
        <button @click="openSupportModal" class="text-sm font-semibold text-gray-900 dark:text-gray-400 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 py-2.5 px-3.5 rounded-md">Contactar a soporte <span aria-hidden="true">&rarr;</span></button>
      </div>
    </div>

    <ContactSupportModal
      :is-open="isSupportModalOpen"
      @update:is-open="isSupportModalOpen = $event"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Asegúrate de que la ruta sea correcta según la estructura de tu proyecto
import ContactSupportModal from '../components/modals/ContactSupportModal.vue';

const router = useRouter();

// Estado para controlar la visibilidad del modal de soporte
const isSupportModalOpen = ref(false);

const goBack = () => {
  router.back();
};

const openSupportModal = () => {
  isSupportModalOpen.value = true;
};
</script>