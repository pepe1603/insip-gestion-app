// src/router/profile/index.js

// Importa el nuevo layout específico para el perfil
import ProfileLayout from '@/layouts/ProfileLayout.vue'; 

// Importa tus páginas específicas del perfil
import ProfilePage from '@/pages/profile/ProfilePage.vue';
import EditProfilePage from '@/pages/profile/EditProfilePage.vue';
import ChangePasswordPage from '@/pages/profile/ChangePasswordPage.vue';
import DashboardInfoPage from '@/pages/profile/DashboardInfoPage.vue';
import VerifyEmailPage from '@/pages/profile/VerifyEmailPage.vue';
import SecurityPage from '@/pages/profile/SecurityPage.vue';
// import DashboardInfoPage from '@/pages/profile/DashboardInfoPage.vue'; // Opcional, si es una página única de perfil/dashboard

const profileRoutes = {
  path: '/profile', // Prefijo para todas las rutas de perfil
  component: ProfileLayout, // ¡Usaremos nuestro nuevo layout aquí!
  meta: { requiresAuth: true }, // Todas las rutas de perfil requieren autenticación

  children: [
    {
      path: '', // Ruta base: /profile
      name: 'profile',
      component: ProfilePage,
      meta: { title: 'Mi Perfil' } // Título específico para esta vista
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
    // Si tu DashboardInfoPage es una vista que encaja *dentro* del layout de perfil, inclúyela.
    // Si es una página de "dashboard" principal que solo MUESTRA info del usuario,
    // quizás encajaría mejor bajo un layout de dashboard genérico, no el de perfil.
    // Lo incluyo por ahora, asumiendo que es una sub-sección del perfil.
    {
      path: 'dashboard-info', // Ruta: /profile/dashboard-info
      name: 'profile-dashboard-info', // Nombre más específico para evitar colisiones
      component: DashboardInfoPage,
      meta: { title: 'Mi Dashboard' }
    },
    // Puedes añadir más rutas de sub-perfil aquí, como 'billing', 'notifications', etc.
  ]
};

export default profileRoutes;