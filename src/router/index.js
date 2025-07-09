// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/authStore';
import { useGlobalModal } from '@/composables/useGlobalModal';

// Importar los componentes de las páginas y layouts públicos
import PublicLayout from "../layouts/PublicLayout.vue";
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Welcome from "../pages/Welcome.vue";
import TestPage from '@/pages/TestPage.vue'; // Si sigue siendo una página pública de pruebas

// Importa las rutas modulares
import authRoutes from './auth';
import profileRoutes from "./profile";
import employeeRoutes from "./employee";
import adminRoutes from "./admin"; // ¡Importa las rutas de administración!

// Importa páginas de error
import ErrorLayout from "../layouts/ErrorLayout.vue";
import ServerError from "../pages/ServerError.vue";
import NotFound from "../pages/NotFound.vue";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage.vue";

// Modals
import InfoMessageModal from '@/components/modals/InfoMessageModal.vue';


const routes = [
  // --- Rutas Públicas (usando PublicLayout) ---
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", component: Welcome, name: "Welcome" },
      { path: "home", name: "Home", component: Home },
      { path: "about", name: "About", component: About },
      { path: "test", name: "TestPage", component: TestPage },
    ],
  },
  // --- Rutas de Autenticación Públicas ---
  { ...authRoutes },
  // --- Rutas de Perfil (protegidas por el guardián de ruta) ---
  { ...profileRoutes },
  // --- Rutas de Empleado (protegidas por el guardián de ruta y roles) ---
  { ...employeeRoutes },
  // --- Rutas del Panel Administrativo/Supervisor (importadas de admin/index.js) ---
  { ...adminRoutes }, // ¡Aquí se insertan todas las rutas de administración!

  // --- Ruta para información del sistema (si es accesible para todos, sino mueve a adminRoutes) ---
  {
    path: '/released',
    name: 'released',
    component: () => import('../views/SystemInfo.vue'),
    // Considera añadir meta:{ requiresAuth: true, roles: ['admin', 'supervisor', 'employee', 'user'] }
    // si solo usuarios logueados pueden verla, o incluso más específico.
  },

  // --- Rutas de Error (usando ErrorLayout) ---
  {
    path: "/error",
    component: ErrorLayout,
    children: [
      { path: "500", name: "ServerError", component: ServerError },
      { path: "403", name: "Unauthorized", component: UnauthorizedPage },
    ],
  },
  // --- Catch-all para 404 (siempre al final) ---
  {
    path: "/:pathMatch(.*)*",
    component: ErrorLayout,
    children: [{ path: "", component: NotFound }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**-------------------------------- Guardianes de Rutas --------------------------------------- */

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const $modal = useGlobalModal();

  // 1. **Cargar usuario si hay token pero no está en el store (al recargar, por ejemplo)**
  if (authStore.token && !authStore.user) {
    try {
      console.log('Token presente pero usuario no cargado. Intentando cargar usuario...');
      await authStore.fetchUser();
      console.log('Usuario cargado con éxito.');
    } catch (error) {
      console.error('Error al recuperar el usuario con token existente:', error);
      authStore.logout();
    }
  }

  // 2. **Protección para rutas que requieren autenticación**
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    console.warn(`[Guard] Redirigiendo a login: Ruta '${to.fullPath}' requiere autenticación.`);
    await $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Necesitas iniciar sesión para acceder a esta sección.',
        buttonText: 'Ir a Iniciar Sesión'
      },
      {
        title: 'Acceso Restringido'
      }
    );
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 3. **Verificar Acceso de Invitados (`guestOnly`)**
  if (to.matched.some(record => record.meta.guestOnly) && authStore.isAuthenticated) {
    console.log(`[Guard] Redirigiendo desde ruta de invitado: Usuario ya autenticado.`);
    await $modal?.showModal(
      InfoMessageModal,
      {
        message: 'Ya estás autenticado. Redirigiendo a tu dashboard.',
        buttonText: 'Aceptar'
      },
      {
        title: 'Ya Iniciaste Sesión'
      }
    );
    const userRole = authStore.user?.role;
    if (userRole === 'admin' || userRole === 'supervisor') {
      return next({ name: 'intro' });
    } else if (userRole === 'employee') {
      return next({ name: 'employee-dashboard' });
    } else {
      return next({ name: 'profile' });
    }
  }

  // 4. **Verificar Roles (`roles`)**
  // Este es el guardián clave que ya tienes y funciona bien con la granularidad.
  if (to.matched.some(record => record.meta.roles) && authStore.isAuthenticated) {
    const requiredRoles = to.matched
      .flatMap(record => record.meta.roles || [])
      .filter((value, index, self) => self.indexOf(value) === index);

    const userRole = authStore.user?.role;

    if (requiredRoles.length > 0 && (!userRole || !requiredRoles.includes(userRole))) {
      console.warn(`[Guard] Acceso denegado: Rol '${userRole}' no autorizado para la ruta '${to.fullPath}'. Requeridos: ${requiredRoles.join(', ')}`);
      return next({ name: 'Unauthorized' });
    }
  }

  // 5. **Continuar la navegación si todas las verificaciones pasan**
  return next();
});

export default router;