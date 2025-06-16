<template>
  <main class="grid min-h-full min-w-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-3xl font-semibold text-indigo-600">404</p>
      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">No Encontrado</h1>
      <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Lo siento, no pudimos encontrar la página que estás buscando..Pero si no cambias de dirección, y si sigues buscando, puedes terminar hacia dónde te diriges.</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <button @click="goBack" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Levame a casa</button>
        <a href="#" class="text-sm font-semibold text-gray-900 hover:bg-gray-100 py-2.5 px-3.5 rounded-md">Contactar a suporte <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>
