<template>
  <aside
    :class="[
      'bg-gray-800',
      'text-white',
      'flex',
      'flex-col',
      'transition-all',
      'duration-300',
      isSidebarExpanded ? 'w-64' : 'w-fit',
      'rounded-lg',
      'm-2',
      'py-2',
      'gap-4',
    ]"
  >
    <div class="p-4 flex items-center justify-center transition-all duration-300">
      <h1
        v-if="isSidebarExpanded"
        class="font-semibold transition-opacity duration-300"
        :class="isSidebarExpanded ? 'text-xl' : 'text-xs'"
      >
        Menú Principal
      </h1>
      <h1
        v-else
        class="font-bold transition-opacity duration-600"
        :class="isSidebarExpanded ? 'text-xl' : 'text-xs'"
      >
        Menú
      </h1>
    </div>

    <nav class="flex-grow p-4 transition-all duration-300">
      <ul>
        <li
          v-for="link in navigationLinksWithChildren"
          :key="link.path || link.label"
          class="mb-2 transition-all duration-600 cursor-pointer"
          :class="isSidebarExpanded ? 'w-auto' : 'w-fit'"
        >
          <div v-if="link.children && link.children.length > 0">
            <button
              @click="toggleSubMenu(link.label)"
              class="flex items-center justify-between w-full hover:bg-gray-700 p-2 rounded transition-opacity duration-400 opacity-100"
              :class="isSidebarExpanded ? 'w-auto' : 'w-fit'"
            >
              <div class="flex items-center" :class="!isSidebarExpanded ? 'justify-center' : ''">
                <component
                  :is="link.icon"
                  class="w-5 h-5 fill-current text-gray-400 transition-all duration-400"
                  :class="!isSidebarExpanded ? 'mr-0' : ''"
                />
                <span
                  v-if="isSidebarExpanded"
                  class="ml-2 transition-opacity duration-400 opacity-100"
                >
                  {{ link.label }}
                </span>
              </div>
              <svg
                class="w-4 h-4 fill-current text-gray-400 transition-transform duration-300"
                :class="[ { 'rotate-90': openSubMenus[link.label] }, !isSidebarExpanded ? 'hidden' : '' ]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <ul
              v-if="(openSubMenus[link.label] && isSidebarExpanded)"
              class="transition-all duration-300"
              :class="!isSidebarExpanded ? 'opacity-0 h-0' : 'opacity-100 h-auto ml-6 mt-1'"
            >
              <li v-for="subLink in link.children" :key="subLink.path" class="mb-1">
                <router-link
                  :to="subLink.path"
                  class="flex items-center hover:bg-gray-700 p-2 rounded transition-opacity duration-400 opacity-100"
                  active-class="bg-gray-700"
                >
                  <span v-if="isSidebarExpanded" class="ml-2 text-sm transition-opacity duration-400 opacity-100">
                    {{ subLink.label }}
                  </span>
                </router-link>
              </li>
            </ul>
          </div>
          <router-link
            v-else
            :to="link.path"
            class="flex items-center hover:bg-gray-700 p-2 rounded transition-opacity duration-400 opacity-100"
            active-class="bg-gray-700"
            :class="!isSidebarExpanded ? 'justify-center' : ''"
          >
            <component
              :is="link.icon"
              class="w-5 h-5 fill-current text-gray-400 transition-all duration-400"
              :class="!isSidebarExpanded ? 'mr-0' : ''"
            />
            <span v-if="isSidebarExpanded" class="ml-2 transition-opacity duration-400 opacity-100">
              {{ link.label }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div
      class="p-4 flex justify-center"
      :class="isSidebarExpanded ? 'justify-end' : 'justify-center'"
    >
      <button
        @click="toggleSidebar"
        class="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 focus:outline-none transition-all duration-300"
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { HomeIcon, UserIcon } from '@heroicons/vue/24/solid';
import { ClipboardDocumentCheckIcon, FolderIcon, RocketLaunchIcon, SquaresPlusIcon } from '@heroicons/vue/20/solid';
import { BuildingOffice2Icon, ChartBarIcon, DocumentCheckIcon, DocumentTextIcon, NewspaperIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const isSidebarExpanded = ref(false);
const openSubMenus = ref({});

// Define la estructura de tus links de navegación para que coincida con tus rutas
const navigationLinks = ref([
  { path: '/dashboard', label: 'Dashboard', icon: SquaresPlusIcon },
  {
    label: 'Administración',
    icon: UserIcon,
    children: [
      { path: '/admin/dashboard', label: 'Panel Principal' }, // Asegúrate que coincida con tu ruta
      { path: '/admin/tipos-asistencia/lista', label: 'Tipos de Asistencia' },
      { path: '/admin/departamentos/lista', label: 'Departamentos' },
      { path: '/admin/estados-solicitud/lista', label: 'Status Solicitud Vacaciones' },
      { path: '/admin/vacaciones-oficiales/lista', label: 'Vacaciones Oficiales' },
      { path: '/admin/empleados/lista', label: 'Empleados' },
      { path: '/admin/asistencias/lista', label: 'Asistencias' },
      { path: '/admin/vacaciones/lista', label: 'Vacaciones' },
      
      // Agrega más subrutas de administración aquí
    ],
  },
  { path: '/projects', label: 'Proyectos', icon: FolderIcon },
  { path: '/Empresas', label: 'Empresas', icon: BuildingOffice2Icon },
  { path: '/reportes', label: 'Reportes', icon: ClipboardDocumentCheckIcon },
  { path: '/charts', label: 'Gráficos', icon: ChartBarIcon },
  { path: '/released', label: 'Versión', icon: RocketLaunchIcon },
  // Agrega más links aquí con sus respectivos iconos de Heroicons
]);

// Filtra los links que tienen rutas hijas para el menú desplegable
const navigationLinksWithChildren = computed(() => {
  return navigationLinks.value.map(link => {
    const routeRecord = router.getRoutes().find(r => r.path === link.path);
    if (routeRecord && routeRecord.children && routeRecord.children.length > 0 && !link.children) {
      return {
        ...link,
        children: routeRecord.children.map(childRoute => ({
          path: link.path + '/' + childRoute.path,
          label: childRoute.name ? childRoute.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Sub-elemento', // Puedes personalizar la etiqueta
        })),
      };
    }
    return link;
  });
});

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};

const toggleSubMenu = (label) => {
  openSubMenus.value[label] = !openSubMenus.value[label];
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

aside {
  font-family: "Plus Jakarta Sans", sans-serif;
}
</style>