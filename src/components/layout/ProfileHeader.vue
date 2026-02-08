<template>
  <header class="bg-white shadow-sm px-4 py-2 flex flex-col sm:flex-row justify-between items-center z-10 rounded border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex-shrink-0 flex items-center text-center gap-2">
      <router-link to="/" class="flex flex-col justify-center items-center text-xs sm:text-sm font-bold text-center text-green-500">
        <UiAvatar src="/nsip-logo_opt_original_mini.png" alt="Nature Intitute Source improved Plants" size="small" />
        <span class="text-center">RH-flow</span>
      </router-link>
      <h1 class="text-center text-indigo-600 break-keep text-wrap">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center space-x-4">
      <button class="text-gray-600 hover:text-gray-800 relative focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 dark:text-gray-300 dark:hover:text-white">
        <font-awesome-icon :icon="['fas', 'bell']" class="h-6 w-6" />
        <span
          v-if="notificationCount > 0"
          class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"
        >
          {{ notificationCount }}
        </span>
      </button>

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

      <UiDropdown
        :label="authStore.user?.name || 'Usuario'"
        :items="userMenuItems"
        buttonClass="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
        menuClass="w-56"
        @item-selected="handleMenuItemSelected"
      >
        <template #button>
          <UiAvatar
            :src="authStore.user?.profile_picture_url"
            :name="authStore.user?.name || 'Usuario Desconocido'"
            size="small"
            alt="Foto de perfil de usuario"
          />
          <span class="text-gray-700 font-medium hidden md:inline dark:text-gray-200">{{ authStore.user?.name || 'Usuario' }}</span>
        </template>

        <template #header>
          <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700 text-center">
            <p class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ authStore.user?.name || 'Usuario' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.email || 'N/A' }}</p>
          </div>
        </template>

        <template #footer>
          <div class="border-t border-gray-100 my-1"></div>
        </template>
      </UiDropdown>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalModal } from '@/composables/useGlobalModal';
import { useGlobalToast } from '@/composables/useGlobalToast';
import { useUiStore } from '@/stores/uiStore'; // Importa el uiStore

// Importa los componentes de UI reutilizables
import UiAvatar from '@/components/ui/UiAvatar.vue';
import UiDropdown from '@/components/ui/UiDropdown.vue';
import LogoutConfirmModal from '@/components/modals/LogoutConfirmModal.vue';

// Importa los íconos de Heroicons
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'; // Asegúrate de tenerlos instalados

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const $modal = useGlobalModal();
const $toast = useGlobalToast();
const uiStore = useUiStore(); // Inicializa el uiStore

const notificationCount = ref(3);

// --- Lógica para el botón de cambio de tema ---
const themeIcon = computed(() => {
  return uiStore.currentTheme === 'dark' ? SunIcon : MoonIcon;
});

const toggleTheme = () => {
  const newTheme = uiStore.currentTheme === 'dark' ? 'light' : 'dark';
  uiStore.setTheme(newTheme);
};

// --- Resto de la lógica del componente ---
const pageTitle = computed(() => {
  const name = route.name;
  switch (name) {
    case 'intro': return 'Bienvenido al Panel de Administración';
    case 'dashboard': return 'Dashboard Principal';
    case 'lista-tipos-asistencia': return 'Tipos de Asistencia';
    case 'crear-tipo-asistencia': return 'Crear Tipo de Asistencia';
    case 'editar-tipo-asistencia': return 'Editar Tipo de Asistencia';
    case 'lista-departamentos': return 'Departamentos';
    case 'crear-departamento': return 'Crear Departamento';
    case 'editar-departamento': return 'Editar Departamento';
    case 'exportar-departamentos': return 'Exportar Departamentos';
    case 'lista-estados-solicitud': return 'Estados de Solicitud de Vacaciones';
    case 'crear-estado-solicitud': return 'Crear Estado de Solicitud';
    case 'editar-estado-solicitud': return 'Editar Estado de Solicitud';
    case 'lista-vacaciones-oficiales': return 'Días Festivos Oficiales';
    case 'crear-vacacion-oficial': return 'Crear Día Festivo Oficial';
    case 'editar-vacacion-oficial': return 'Editar Día Festivo Oficial';
    case 'lista-empleados': return 'Gestión de Empleados';
    case 'crear-empleado': return 'Registrar Nuevo Empleado';
    case 'editar-empleado': return 'Editar Empleado';
    case 'exportar-empleados': return 'Exportar Empleados';
    case 'lista-asistencias': return 'Registros de Asistencia';
    case 'crear-asistencia': return 'Registrar Asistencia';
    case 'editar-asistencia': return 'Editar Asistencia';
    case 'reporte-asistencias-empleado': return 'Reportes de Asistencia por Empleado';
    case 'reporte-asistencias-mes': return 'Reportes de Asistencia por Mes';
    case 'reporte-asistencias-rango-fechas': return 'Reportes de Asistencia por Rango de Fechas';
    case 'lista-vacaciones': return 'Solicitudes de Vacaciones';
    case 'crear-vacacion': return 'Crear Solicitud de Vacación';
    case 'editar-vacacion': return 'Editar Solicitud de Vacación';
    case 'administrar-estados-vacaciones': return 'Administrar Solicitudes de Vacaciones';
    case 'opciones-avanzadas': return 'Configuración Avanzada de Vacaciones';
    case 'reporte-vacaciones-empleado-ciclo': return 'Reporte Vacaciones por Empleado/Ciclo';
    case 'reporte-vacaciones-departamento': return 'Reporte Vacaciones por Departamento';
    case 'reporte-vacaciones-periodo': return 'Reporte Vacaciones por Periodo';
    case 'reporte-vacaciones-dias-tomados-mes': return 'Reporte Días Tomados por Mes';
    case 'reporte-vacaciones-dias-tomados-semana': return 'Reporte Días Tomados por Semana';
    case 'reporte-vacaciones-top-empleados': return 'Top Empleados con Vacaciones';
    case 'reporte-vacaciones-resumen': return 'Resumen de Vacaciones';
    case 'profile-overview': return 'Bienvenido a tu Perfil';
    case 'profile-details': return 'Mi Perfil';
    case 'edit-profile': return 'Editar Perfil';
    case 'change-password': return 'Cambiar Contraseña';
    case 'verify-email': return 'Verificar Email';
    case 'security': return 'Seguridad';
    case 'employee-overview': return 'Panel de Empleado';
    case 'employee-dashboard': return 'Dashboard Empleado';
    case 'employee-my-data': return 'Mis Datos de Empleado';
    case 'employee-attendance': return 'Mis Asistencias';
    case 'employee-vacations': return 'Mis Vacaciones';
    case 'employee-request-vacation': return 'Solicitar Vacaciones';
    case 'employee-consultations': return 'Consultas';
    case 'released': return 'Información del Sistema';
    default:
      if (name) {
        return name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
      return 'Panel de Administración';
  }
});

const userMenuItems = computed(() => {
  const items = [
    { label: 'Mi Perfil', to: { name: 'profile-overview' }, icon: ['fa', 'user'], class: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700' },
  ];

  if (authStore.user?.role && authStore.user.role !== 'user') {
    items.push({
      label: 'Panel de Empleado',
      to: { name: 'employee-overview' },
      icon: ['fas', 'chart-pie'],
      class: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
    });
  }

  items.push({
    label: 'Cerrar Sesión',
    type: 'button',
    onClick: confirmLogout,
    icon: ['fas', 'right-from-bracket'],
    class: 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900',
  });

  return items;
});

const handleMenuItemSelected = (item) => {
  // Las acciones (navegación o confirmLogout) ya están asignadas directamente en los items.
  // console.log('Item seleccionado del menú de usuario:', item.label); // Puedes descomentar para depuración
};

const confirmLogout = async () => {
  const result = await $modal.showModal(
    LogoutConfirmModal,
    {},
    {
      title: 'Confirmar Cierre de Sesión',
      closeOnClickOutside: false,
    }
  );

  if (result && result.action === 'confirm') {
    try {
      await authStore.logout();
      router.push({ name: 'login' });
      $toast.success('¡Sesión cerrada exitosamente!', {
        position: 'top-center',
        duration: 5000,
        title: 'Adiós',
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      $toast.error('Ocurrió un error al intentar cerrar sesión. Por favor, inténtalo de nuevo.', {
        position: 'top-center',
        duration: 7000,
        title: 'Error al Cerrar Sesión',
      });
    }
  } else {
    console.log('Cierre de sesión cancelado por el usuario.');
    $toast.info('Cierre de sesión cancelado.', {
      position: 'top-right',
      duration: 3000,
      title: 'Acción Cancelada',
    });
  }
};
</script>

<style scoped>
/* Puedes añadir estilos específicos para el ProfileHeader aquí si es necesario */
</style>