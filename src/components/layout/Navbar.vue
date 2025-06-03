<template>
  <nav class="bg-white navbar-title shadow-md h-14 fixed top-0 left-0 right-0 z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0 flex items-center gap-2">
          <UiAvatar src="nsip-logo_opt_original_mini.png" alt="Nature Intitute Source improved Plants" size="small" />
          <router-link to="/" class=" text-xl font-bold text-green-500">RH-flow</router-link>
        </div>
        
        <!-- Menú de navegación -->
        <ul class="flex space-x-6 items-center">
          <li v-for="link in links" :key="link.name">
            <router-link
              :to="link.to"
              class="relative text-base text-gray-600 font-medium transition-colors duration-300"
              :class="isActiveRoute(link.to)
                ? 'navbar-title border-b-2 border-buttonText'
                : 'navbar-title hover:text-indigo-600  hover:border-b hover:border-indigo-600 focus:outline-none focus:text-buttonText'"
            >
              {{ link.name }}
            </router-link>
          </li>

          <!-- Menú desplegable -->
          <li>
            <ReusablePopover />
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ReusablePopover from '../ReusablePopover.vue' // Asegúrate de importar el componente ReusablePopover
import DropdownMenu from '../DropdownMenu.vue' // Asegúrate de importar el componente DropdownMenu
import UiAvatar from '../../components/ui/UiAvatar.vue';

const route = useRoute()

const links = [
  { name: 'Inicio', to: '/home' },
  { name: 'Sobre Nosotros', to: '/about' },
]

const isActiveRoute = (to) => {
  return route.path === to
}
</script>

<style scoped>
/* Estilos adicionales para el navbar, si los necesitas */
</style>
