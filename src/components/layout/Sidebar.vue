<template>
  <aside
    :class="[
      'bg-gray-800',
      'text-white',
      'w-auto h-auto',
      'flex',
      'flex-col',
      'transition-all',
      'duration-300',
      isExpanded ? 'w-72' : 'w-20',
      'rounded-lg',
      'm-2',
      'py-2',
      'shadow-md',
    ]"
  >
    <div class="p-4 flex items-center" :class="isExpanded ? 'justify-start' : 'justify-center'">
      <font-awesome-icon :icon="['fas', 'chart-simple']" class="w-8 h-8 text-indigo-400 shrink-0" />
      <h2 v-if="isExpanded" class="ml-3 text-xl font-semibold whitespace-nowrap overflow-hidden">Panel Admin</h2>
    </div>

    <nav class="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
      <ul class="space-y-2">
        <li v-for="link in filteredLinks" :key="link.path || link.label">
          <div v-if="link.children && link.children.length > 0">
            <button
              @click="toggleSubMenu(link.label)"
              class="flex items-center justify-between w-full p-2 rounded transition-colors duration-200 text-sm"
              :class="[
                'hover:bg-gray-700',
                (openMenus[link.label] || isAnyChildRouteActive(link.children)) ? 'bg-gray-700 text-indigo-300' : 'text-gray-200'
              ]"
            >
              <div class="flex items-center" :class="!isExpanded ? 'justify-center w-full' : ''">
                <font-awesome-icon
                  :icon="link.icon"
                  class="w-5 h-5 fill-current shrink-0"
                  :class="isExpanded ? 'mr-3' : ''"
                />
                <span v-if="isExpanded" class="whitespace-nowrap overflow-hidden">{{ link.label }}</span>
              </div>
              <svg
                v-if="isExpanded"
                class="w-4 h-4 fill-current text-gray-400 transition-transform duration-300 shrink-0"
                :class="{ 'rotate-90': openMenus[link.label] || isAnyChildRouteActive(link.children) }"
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <ul
              v-show="(openMenus[link.label] || isAnyChildRouteActive(link.children)) && isExpanded"
              class="pl-4 ml-2 mt-1 border-l border-gray-600 space-y-1"
            >
              <li v-for="child in link.children" :key="child.path">
                <router-link
                  :to="child.path"
                  class="flex items-center p-2 rounded hover:bg-gray-700 transition-colors duration-200 text-xs"
                  :class="route.path.startsWith(child.path) ? 'bg-gray-700 text-indigo-300' : 'text-gray-300'"
                >
                  <span class="ml-1 whitespace-nowrap overflow-hidden">{{ child.label }}</span>
                </router-link>
              </li>
            </ul>
          </div>

          <router-link
            v-else
            :to="link.path"
            class="flex items-center p-2 rounded transition-colors duration-200 text-sm"
            :class="[
              'hover:bg-gray-700',
              (link.path === route.path) ||
              (link.path === '/admin' && (route.path === '/admin' || route.name === 'intro' || route.name === 'dashboard')) ||
              (route.path.startsWith(link.path) && link.path !== '/admin' && link.path !== '/') // Para que los links padres sin hijos sigan activos si están en una subruta
                ? 'bg-gray-700 text-indigo-300'
                : 'text-gray-200',
              !isExpanded ? 'justify-center' : '' // Centrar el icono si el sidebar está colapsado
            ]"
            active-class="bg-gray-700 text-indigo-300"
          >
            <font-awesome-icon
              :icon="link.icon"
              class="w-5 h-5 fill-current shrink-0"
              :class="isExpanded ? 'mr-3' : ''"
            />
            <span v-if="isExpanded" class="whitespace-nowrap overflow-hidden">{{ link.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div
      class="p-4 flex"
      :class="isExpanded ? 'justify-end' : 'justify-center'"
    >
      <button
        @click="toggleSidebar"
        class="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 focus:outline-none transition-all duration-300"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" v-if="isExpanded" class="w-6 h-6 fill-current text-gray-400" />
        <font-awesome-icon :icon="['fas', 'chevron-right']" v-else class="w-6 h-6 fill-current text-gray-400" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'; // Importa 'watch' en lugar de 'watchEffect' para este caso
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();

// Sincroniza el estado local `isExpanded` y `openMenus` con el store de Pinia
const isExpanded = computed(() => uiStore.isSidebarExpanded);
const openMenus = computed(() => uiStore.openSidebarMenus);

// Acciones del store
const toggleSidebar = () => {
  uiStore.toggleSidebar();
  console.log('Sidebar: isExpanded (after toggle):', uiStore.isSidebarExpanded);
};
const toggleSubMenu = (label) => {
  uiStore.toggleSubMenu(label);
  console.log('Sidebar: Submenu toggled manually:', label, 'Open state:', uiStore.openSidebarMenus[label]);
};

// Define la estructura explícita de tus links de navegación con iconos de Font Awesome
const navigationLinks = ref([
  { path: '/admin', label: 'Inicio del Panel', icon: ['fas', 'home'], roles: ['admin', 'supervisor'] },
  { path: '/admin/dashboard', label: 'Dashboard', icon: ['fas', 'chart-simple'], roles: ['admin', 'supervisor'] },
  {
    label: 'Administración de Usuarios', // Nuevo menú padre
    icon: ['fas', 'users-cog'], // Un ícono sugerido, asegúrate de tenerlo disponible
    children: [
      { path: '/admin/users/list', label: 'Lista de Usuarios', roles: ['admin', 'supervisor'] }, // Supervisor podría ver la lista pero no editar
      { path: '/admin/users/create', label: 'Crear Usuario', roles: ['admin'] },
      // Podrías añadir más si tienes secciones para roles, permisos, etc.
      // { path: '/admin/users/roles', label: 'Roles y Permisos', roles: ['admin'] },
    ],
  },
  {
    label: 'Recursos Humanos',
    icon: ['fas', 'user-group'],
    children: [
      { path: '/admin/empleados/lista', label: 'Gestión de Empleados', roles: ['admin', 'supervisor'] },
      { path: '/admin/departamentos/lista', label: 'Departamentos', roles: ['admin'] },
      { path: '/admin/empleados/export', label: 'Exportar Empleados', roles: ['admin', 'supervisor'] },
      { path: '/admin/departamentos/export', label: 'Exportar Departamentos', roles: ['admin'] },
    ],
  },
  {
    label: 'Tiempo y Asistencia',
    icon: ['fas', 'clock'],
    children: [
      { path: '/admin/asistencias/lista', label: 'Registros de Asistencia', roles: ['admin', 'supervisor'] },
      { path: '/admin/asistencias/reportes/empleado', label: 'Reportes de Asistencia', roles: ['admin', 'supervisor'] },
      { path: '/admin/tipos-asistencia/lista', label: 'Tipos de Asistencia', roles: ['admin'] },
    ],
  },
  {
    label: 'Vacaciones y Permisos',
    icon: ['fas', 'calendar-days'],
    children: [
      { path: '/admin/vacaciones/lista', label: 'Solicitudes de Vacaciones', roles: ['admin', 'supervisor'] },
      { path: '/admin/vacaciones/administrar', label: 'Administrar Solicitudes', roles: ['admin', 'supervisor'] },
      { path: '/admin/vacaciones/reportes/resumen', label: 'Reportes de Vacaciones', roles: ['admin', 'supervisor'] },
      { path: '/admin/vacaciones-oficiales/lista', label: 'Días Festivos Oficiales', roles: ['admin'] },
      { path: '/admin/estados-solicitud/lista', label: 'Config. Estados Solicitud', roles: ['admin'] },
      { path: '/admin/vacaciones/opciones-avanzadas', label: 'Config. Avanzada Vacaciones', roles: ['admin'] },
    ],
  },
  { path: '/admin/configuracion/general', label: 'Configuración del Sistema', icon: ['fas', 'gear'], roles: ['admin'] },
  { path: '/released', label: 'Información del Sistema', icon: ['fas', 'circle-question'], roles: ['admin', 'supervisor', 'employee'] },
]);

// Filtra los links de navegación basándose en los roles del usuario logueado
const filteredLinks = computed(() => {
  const userRoles = authStore.user?.role ? [authStore.user.role] : [];
  console.log('--- Sidebar Debug: Computing filteredLinks ---');
  console.log('Current User Role(s):', userRoles);

  const filtered = navigationLinks.value.filter(link => {
    // Si el link tiene hijos, filtra los hijos
    if (link.children) {
      const accessibleChildren = link.children.filter(childLink => {
        const hasAccess = childLink.roles ? childLink.roles.some(role => userRoles.includes(role)) : true;
        // console.log(`  Child "${childLink.label}" (${childLink.path}) - Roles: ${childLink.roles || 'None'}, Has Access: ${hasAccess}`); // Descomentar para depuración granular de hijos
        return hasAccess;
      });
      // Creamos una copia del link y le asignamos los hijos filtrados
      const newLink = { ...link, children: accessibleChildren };
      const parentVisible = newLink.children.length > 0;
      // console.log(`Parent "${newLink.label}" - Has Accessible Children: ${newLink.children.length} > 0 (${parentVisible})`); // Descomentar para depuración granular de padres
      return parentVisible; // El menú padre solo es visible si tiene hijos accesibles
    }
    // Si no tiene hijos, es visible si el usuario tiene los roles requeridos
    const hasAccess = link.roles ? link.roles.some(role => userRoles.includes(role)) : true;
    // console.log(`  Link "${link.label}" (${link.path}) - Roles: ${link.roles || 'None'}, Has Access: ${hasAccess}`); // Descomentar para depuración granular de enlaces directos
    return hasAccess;
  });

  console.log('Filtered Links Result:', JSON.parse(JSON.stringify(filtered.map(l => ({ label: l.label, path: l.path, children: l.children ? l.children.map(c => ({ label: c.label, path: c.path })) : undefined })))));
  return filtered;
});

/**
 * Verifica si alguna de las rutas hijas de un menú está activa actualmente.
 * Esto se usa para mantener el submenú abierto si el usuario está en una de sus rutas.
 * @param {Array<Object>} children - Array de objetos de rutas hijas.
 * @returns {boolean} - True si alguna ruta hija está activa, false de lo contrario.
 */
const isAnyChildRouteActive = (children) => {
  return children.some(child => route.path.startsWith(child.path));
};

// --- CAMBIO CLAVE AQUÍ: Usamos 'watch' para la ruta en lugar de 'watchEffect' ---
watch(() => route.path, (newPath, oldPath) => {
  console.log(`--- Sidebar Debug: Route changed from ${oldPath} to ${newPath} ---`);
  // Cierra todos los submenús excepto el que contiene la nueva ruta activa (o el que ya estaba abierto manualmente)
  filteredLinks.value.forEach(link => {
    if (link.children && link.children.length > 0) {
      const shouldBeOpen = isAnyChildRouteActive(link.children);
      if (uiStore.openSidebarMenus[link.label] !== shouldBeOpen) {
          uiStore.setSubMenuState(link.label, shouldBeOpen);
          console.log(`Watch: Setting subMenu "${link.label}" to ${shouldBeOpen} (due to active child route change)`);
      }
    }
  });
  console.log('openSidebarMenus state after route change:', uiStore.openSidebarMenus);
}, { immediate: true }); // 'immediate: true' para que se ejecute al inicio

// Inicializa los menús en el store al montar el componente (para el estado inicial de Pinia)
onMounted(() => {
  console.log('Sidebar Component Mounted!');
  console.log('Current Auth User:', authStore.user);
  console.log('Current Route:', route.fullPath, 'Name:', route.name);
  console.log('Initial isExpanded state:', uiStore.isSidebarExpanded);
  // Asegura que los menús estén inicializados en el store.
  // Esto debe suceder solo una vez, o cuando la estructura de navigationLinks cambie.
  uiStore.initializeSidebarMenus(navigationLinks.value);
  console.log('Initial openSidebarMenus state (from onMounted):', uiStore.openSidebarMenus);
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

aside {
  font-family: "Plus Jakarta Sans", sans-serif;
}

/* Estilos para el scrollbar personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #333;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}
</style>