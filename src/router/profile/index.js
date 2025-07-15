// src/router/profile/index.js

// Importa el nuevo layout específico para el perfil
import ProfileLayout from '@/layouts/ProfileLayout.vue'; 

// Importa tus páginas específicas del perfil
import ProfilePage from '@/pages/profile/ProfilePage.vue';
import EditProfilePage from '@/pages/profile/EditProfilePage.vue';
import ChangePasswordPage from '@/pages/profile/ChangePasswordPage.vue';
import VerifyEmailPage from '@/pages/profile/VerifyEmailPage.vue';
import SecurityPage from '@/pages/profile/SecurityPage.vue';
import ProfileOverviewPage from '@/pages/profile/ProfileOverviewPage.vue';
// import DashboardInfoPage from '@/pages/profile/DashboardInfoPage.vue'; // Opcional, si es una página única de perfil/dashboard

const profileRoutes = {
  path: '/profile', // Prefijo para todas las rutas de perfil
  component: ProfileLayout, // ¡Usaremos nuestro nuevo layout aquí!
  meta: { requiresAuth: true }, // Todas las rutas de perfil requieren autenticación
  children: [
    {
      path: '', // Ruta base: /profile (este es la vista de bienvenida/resumen)
      name: 'profile-overview', // Nombre de la nueva ruta
      component: ProfileOverviewPage, // El nuevo componente de bienvenida
      meta: { title: 'Bienvenido a tu Perfil' } // Título específico
    },
    {
      path: 'details', // <-- Antiguo 'profile', ahora bajo '/profile/details'
      name: 'profile-details', // Mantén el nombre 'profile' si es ampliamente referenciado así
      component: ProfilePage,
      meta: { title: 'Mi Perfil' }
    },
    {
      path: 'edit', // Ruta: /profile/edit
      name: 'edit-profile',
      component: EditProfilePage,
      meta: { title: 'Editar Perfil' }
    },
    {
      path: 'change-password', // Ruta: /profile/change-password
      name: 'change-password',
      component: ChangePasswordPage,
      meta: { title: 'Cambiar Contraseña' }
    },
    {
      path: 'verify-email', // <-- ruta Verifiacr EMail
      name: 'verify-email',
      component: VerifyEmailPage,
      meta: { title: 'Verificar Email' }
    },
    {
      path: 'security', // <-- Ruta de seguridad
      name: 'security',
      component: SecurityPage,
      meta: { title: 'Seguridad' }
    },
    // Puedes añadir más rutas de sub-perfil aquí, como 'billing', 'notifications', etc.
  ]
};

export default profileRoutes;