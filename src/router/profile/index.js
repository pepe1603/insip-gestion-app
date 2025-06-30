// src/router/profile/index.js

import DefaultLayout from '@/layouts/DefaultLayout.vue'; // O el layout que uses para las páginas de usuario logueado
import ProfilePage from '@/pages/profile/ProfilePage.vue';
import EditProfilePage from '@/pages/profile/EditProfilePage.vue';
import ChangePasswordPage from '@/pages/profile/ChangePasswordPage.vue';
import DashboardInfoPage from '@/pages/profile/DashboardInfoPage.vue'; // Si esta es una página separada

const profileRoutes = {
  path: '/profile', // Prefijo para todas las rutas de perfil
  component: DefaultLayout, // O el layout que usas para secciones protegidas
  meta: { requiresAuth: true }, // Todas las rutas de perfil requieren autenticación
  children: [
    {
      path: '', // /profile
      name: 'profile',
      component: ProfilePage,
    },
    {
      path: 'edit', // /profile/edit
      name: 'edit-profile',
      component: EditProfilePage,
    },
    {
      path: 'change-password', // /profile/change-password
      name: 'change-password',
      component: ChangePasswordPage,
    },
    {
      path: 'dashboard-info', // /profile/dashboard-info (si quieres una vista específica)
      name: 'dashboard-info',
      component: DashboardInfoPage,
    },
    // Si tu dashboard principal es el que muestra la info, podrías no necesitar la última ruta específica aquí
  ]
};

export default profileRoutes;