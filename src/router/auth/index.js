// src/router/auth/index.js

// Importa los componentes de tus páginas de autenticación
import AuthLayout from '@/layouts/AuthLayout.vue'; // Asume que tienes un layout específico para autenticación
import LoginPage from '@/pages/auth/LoginPage.vue';
import RegisterPage from '@/pages/auth/RegisterPage.vue'; // Asumo que signIn es tu registro
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.vue';
import VerifyResetCodePage from '@/pages/auth/VerifyResetCodePage.vue';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue';


const authRoutes = {
  path: '/auth', // Prefijo para todas las rutas de autenticación
  component: AuthLayout, // O el layout que uses para tus páginas de auth
  children: [
    {
      path: 'login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false, guestOnly: true } // Para manejo de middleware en Vue
    },
    
    {
      path: 'register', // Usamos 'register' para /sign-in de tu API
      name: 'register',
      component: RegisterPage,
      meta: { requiresAuth: false, guestOnly: true }
    },
    {
      path: 'forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage,
      meta: { requiresAuth: false, guestOnly: true }
    },
    {
      path: 'verify-reset-code',
      name: 'verify-reset-code',
      component: VerifyResetCodePage,
      meta: { requiresAuth: false, guestOnly: true }
    },
    {
      path: 'reset-password',
      name: 'reset-password',
      component: ResetPasswordPage,
      meta: { requiresAuth: false, guestOnly: true }
    },

    
    // Si tienes una página de "user verification" o algo similar después del registro, agrégala aquí
  ]
};

export default authRoutes;