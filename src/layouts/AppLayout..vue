<template>
  <div class="flex h-screen bg-gray-100">
    <aside
      :class="[
        'bg-gray-800',
        'text-white',
        'flex',
        'flex-col',
        'transition-all',
        'duration-300',
        isSidebarExpanded ? 'w-64' : 'w-fit',
        'rounded-md',
        'm-2',
        'gap-4',
      ]"
    >
      <div class="p-4 flex items-center justify-center transition-all duration-300">
        <img v-if="isSidebarExpanded" src="../assets/vue.svg" alt="Logo de la Aplicación" class="h-8 transition-opacity duration-300">
        <img v-else src="../assets/vue.svg" alt="Logo Mini" class="h-8 transition-opacity duration-600">
      </div>

      <nav class="flex-grow p-4 transition-all duration-300">
        <ul>
          <li
            class="mb-2 transition-all duration-600"
            :class="isSidebarExpanded ? 'w-auto' : 'w-fit'"
            v-for="link in navigationLinks"
            :key="link.path"
          >
            <router-link
              :to="link.path"
              class="flex items-center hover:bg-gray-700 p-2 rounded transition-opacity duration-400 opacity-100"
              active-class="bg-gray-700" >
              <component :is="link.icon" class="w-5 h-5 fill-current text-gray-400 transition-all duration-400" />
              <span v-if="isSidebarExpanded" class="ml-2 transition-opacity duration-400 opacity-100">
                {{ link.label }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="p-4 flex justify-center">
        <button
          @click="toggleSidebar"
          class="bg-gray-700 hover:bg-gray-600 text-white rounded p-2 focus:outline-none transition-all duration-300"
        >
          <svg
            v-if="isSidebarExpanded"
            class="w-6 h-6 fill-current text-gray-400 transition-all duration-300"
            viewBox="0 0 24 24"
          >
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
          <svg
            v-else
            class="w-6 h-6 fill-current text-gray-400 transition-all duration-300"
            viewBox="0 0 24 24"
          >
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto p-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { HomeIcon, UsersIcon } from '@heroicons/vue/24/solid'; // Importa los iconos que necesites

const isSidebarExpanded = ref(false); // Inicialmente colapsado

const navigationLinks = ref([
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/users', label: 'Usuarios', icon: UsersIcon },
  // Agrega más links aquí con sus respectivos iconos de Heroicons
]);

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};
</script>