// src/router/auth/index.js

// Importa los componentes de tus páginas de autenticación que sera importada desde el router/index.js 
import AuthLayout from '@/layouts/AuthLayout.vue'; // Asume que tienes un layout específico para autenticación
import LoginPage from '@/pages/auth/LoginPage.vue';
import RegisterPage from '@/pages/auth/RegisterPage.vue'; // Asumo que signIn es tu registro
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.vue';
import VerifyResetCodePage from '@/pages/auth/VerifyResetCodePage.vue';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue';
import ForcePasswordChangePage from '@/pages/auth/ForcePasswordChangePage.vue';


const authRoutes = {
  path: '/auth', // Prefijo para todas las rutas de autenticación
  component: AuthLayout, // O el layout que uses para tus páginas de auth
  meta: { requiresAuth: false, guestOnly: true }, // Para manejo de middleware en Vue
  children: [
    {
      path: 'login',
      name: 'login',
      component: LoginPage,
    },
    
    {
      path: 'register', // Usamos 'register' para /sign-in de tu API
      name: 'register',
      component: RegisterPage,
    },
    {
      path: 'forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage,
      
    },
    {
      path: 'verify-reset-code',
      name: 'verify-reset-code',
      component: VerifyResetCodePage,
      
    },
    {
      path: 'reset-password',
      name: 'reset-password',
      component: ResetPasswordPage,
      
    },

    // --- NUEVA RUTA PARA CAMBIO DE CONTRASEÑA FORZADO ---
    {
      path: 'force-password-change',
      name: 'force-password-change',
      component: ForcePasswordChangePage,
      meta: { guestOnly: false, requiresLimitedToken: true }, // Protegida, pero permite el token limitado
    },
    // ----------------------------------------------------
    // Si tienes una página de "user verification" o algo similar después del registro, agrégala aquí
  ]
};

export default authRoutes;