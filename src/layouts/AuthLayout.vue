<template>
  <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white relative">
    <header class="fixed top-0 flex justify-between items-center px-4 w-full h-14 sm:h-16 backdrop-blur-lg shadow">

        <div class="h-full flex items-center gap-2">
          <UiAvatar src="/nsip-logo_opt_original_mini.png" alt="Nature Intitute Source improved Plants" size="small" />
          <router-link to="/" class=" text-xl font-bold text-green-500">RH-flow</router-link>
        </div>

      <ul class="flex gap-4 items-center"> <!-- Añadido items-center para alinear verticalmente -->
        <!-- Botón de Modo Oscuro/Claro -->
        <li>
          <button
            @click="toggleTheme"
            class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
            :class="uiStore.currentTheme === 'dark'
              ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600 focus:ring-yellow-500'
              : 'bg-gray-200 text-indigo-600 hover:bg-gray-300 focus:ring-indigo-500'"
            aria-label="Alternar modo oscuro"
          >
            <component :is="themeIcon" class="h-5 w-5" />
          </button>
        </li>

        <li><UiButton variant="outline-secondary" size="sm" @click="redirectToLogin">Iniciar Sesión</UiButton></li>
        <li><UiButton variant="outline-primary" size="sm" @click="redirectToSignIn" >Registrar</UiButton></li>
      </ul>
    </header>

    <main class="min-h-screen flex-1 grid grid-cols-1 sm:grid-cols-2 place-items-center overflow-y-auto p-4 mt-14">
      <router-view></router-view>
      
      <div class="w-1/2 min-h-40 max-h-48 ">
        <img src="/public/nsip-logo_opt-preview.png" class="object-fit" alt="logo tipo de empresa">
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'; // Importa computed
import Footer from '../components/layout/Footer.vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { HomeIcon, UsersIcon } from '@heroicons/vue/24/solid';
import UiButton from '../components/ui/UiButton.vue';
import UiAvatar from '../components/ui/UiAvatar.vue';

import { useUiStore } from '@/stores/uiStore'; // Importa el uiStore
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'; // Importa los íconos

const uiStore = useUiStore(); // Inicializa el uiStore
const router = useRouter();

const isSidebarExpanded = ref(false); // Inicialmente colapsado

// --- Lógica para el botón de cambio de tema ---
const themeIcon = computed(() => {
  return uiStore.currentTheme === 'dark' ? SunIcon : MoonIcon;
});

const toggleTheme = () => {
  const newTheme = uiStore.currentTheme === 'dark' ? 'light' : 'dark';
  uiStore.setTheme(newTheme);
};

// --- Resto de la lógica del componente ---
const redirectToLogin = () => {
  router.push('/auth/login');
}

const redirectToSignIn = () => {
  router.push('/auth/register');
}

const navigationLinks = ref([
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/users', label: 'Usuarios', icon: UsersIcon },
]);

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
</style>