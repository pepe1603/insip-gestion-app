<template>
  <nav class="bg-white shadow-md h-14 fixed top-0 left-0 right-0 z-20 dark:bg-gray-800 dark:text-white">
      <div class="h-full min-w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div class="flex-shrink-0 flex items-center gap-2  ">
          <UiAvatar src="/nsip-logo_opt_original_mini.png" alt="Nature Intitute Source improved Plants" size="small" />
          <router-link to="/" class="text-xl font-bold text-green-500">RH-flow</router-link>
        </div>

        <ul class="flex space-x-6 items-center">
          <li v-for="link in links" :key="link.name">
            <router-link
              :to="link.to"
              class="relative text-base text-gray-600 font-medium transition-colors duration-300"
              :class="isActiveRoute(link.to)
                ? 'border-b-2 border-buttonText'
                : 'hover:text-indigo-600 hover:border-b hover:border-indigo-600 focus:outline-none focus:text-buttonText'"
            >
              {{ link.name }}
            </router-link>
          </li>

          <li>
            <button
              @click="toggleTheme"
              class="p-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              :class="uiStore.currentTheme === 'dark'
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600 focus:ring-yellow-500'
                : 'bg-gray-200 text-indigo-600 hover:bg-gray-300 focus:ring-indigo-500'"
              aria-label="Alternar modo oscuro"
            >
              <component :is="themeIcon" class="h-5 w-5" />
            </button>
          </li>

          <li>
            <template v-if="authStore.isAuthenticated">
              <button
                @click="goToCPanel"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{ cPanelButtonText }}
              </button>
            </template>

                        
            <template v-else>
              <router-link
                :to="{ name: 'login' }"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Iniciar Sesión
              </router-link>
            </template>

          

            </li>


            
        </ul>
      </div>
  </nav>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UiAvatar from '@/components/ui/UiAvatar.vue';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore'; // Importa el uiStore

// Importa los íconos de Heroicons
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore(); // Inicializa el uiStore

// --- Public Navigation Links ---
const links = [
  { name: 'Inicio', to: '/home' }, // Assuming '/home' is your public home page
  { name: 'Sobre Nosotros', to: '/about' },
];

const isActiveRoute = (to) => {
  return route.path === to;
};

// --- Lógica para el botón de cambio de tema ---
const themeIcon = computed(() => {
  return uiStore.currentTheme === 'dark' ? SunIcon : MoonIcon;
});

const toggleTheme = () => {
  const newTheme = uiStore.currentTheme === 'dark' ? 'light' : 'dark';
  uiStore.setTheme(newTheme);
};

// --- CPanel/Profile Access Logic ---

// Computed property for the CPanel/Profile button text
const cPanelButtonText = computed(() => {
  if (!authStore.isAuthenticated) return 'Iniciar Sesión'; // Should not be seen if isAuthenticated is false

  switch (authStore.user?.role) {
    case 'admin':
      return 'Panel de Admin';
    case 'supervisor':
      return 'Panel de Supervisor';
    case 'employee':
      return 'Panel de Empleado';
    case 'user':
      return 'Mi Perfil';
    default:
      return 'Acceder';
  }
});

// Function to determine the redirection path
const getCPanelPath = () => {
  switch (authStore.user?.role) {
    case 'admin':
      return { name: 'dashboard' }; // Assuming 'dashboard' is the admin's main dashboard route name
    case 'supervisor':
      return { name: 'dashboard' }; // Assuming 'employee-dashboard' for both supervisors and employees
    case 'employee':
      return { name: 'employee-overview' }; // Assuming 'employee-dashboard' for both supervisors and employees
    case 'user':
      return { name: 'profile-overview' }; // Standard users go to their profile
    default:
      return { name: 'home' }; // Fallback to public home or login if role is unknown
  }
};

// Function to navigate to the appropriate CPanel/Profile
const goToCPanel = () => {
  if (authStore.isAuthenticated) {
    router.push(getCPanelPath());
  } else {
    router.push({ name: 'login' });
  }
};

// Watch for authentication state changes and redirect 'user' role
watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal && authStore.user?.role === 'user') {
    // If a 'user' role logs in and is on a public page, redirect them to their profile
    // We'll also check if the current route is not already their profile to avoid loops
    if (route.name !== 'profile-overview') {
      router.push({ name: 'profile-overview' });
    }
  }
}, { immediate: true }); // `immediate: true` to run the watcher once on component mount

// Redirect 'user' roles if they somehow land on the PublicLayout and are authenticated
onMounted(() => {
  if (authStore.isAuthenticated && authStore.user?.role === 'user') {
    if (route.name !== 'profile-overview') {
      router.push({ name: 'profile-overview' });
    }
  }
});
</script>

<style scoped>
/* Estilos adicionales para el navbar, si los necesitas */
</style>