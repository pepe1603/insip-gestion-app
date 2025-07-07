<template>
  <div class="min-h-screen flex flex-col bg-gray-50 relative">
    <header class="fixed top-0 flex justify-between items-center px-4 w-full h-14 sm:h-16 backdrop-blur-lg shadow">

        <div class="h-full flex items-center gap-2">
          <UiAvatar src="/public/nsip-logo_opt_original_mini.png" alt="Nature Intitute Source improved Plants" size="small" />
          <router-link to="/" class=" text-xl font-bold text-green-500">RH-flow</router-link>
        </div>

      <ul class="flex gap-4 ">
        <UiButton variant="outline-secondary" size="sm" @click="redirectToLogin">Login</UiButton>
        <UiButton variant="outline-primary" size="sm" @click="redirectToSignIn" >Sign In</UiButton>
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
import { ref } from 'vue';
import Footer from '../components/layout/Footer.vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { HomeIcon, UsersIcon } from '@heroicons/vue/24/solid'; // Importa los iconos que necesites
import UiButton from '../components/ui/UiButton.vue';
import UiAvatar from '../components/ui/UiAvatar.vue';

const isSidebarExpanded = ref(false); // Inicialmente colapsado
const router = useRouter();

const redirectToLogin = () => {
  router.push('/auth/login');
}

const redirectToSignIn = () => {
  router.push('/auth/sign-in');
}
const navigationLinks = ref([
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/users', label: 'Usuarios', icon: UsersIcon },
  // Agrega más links aquí con sus respectivos iconos de Heroicons
]);

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};
</script>