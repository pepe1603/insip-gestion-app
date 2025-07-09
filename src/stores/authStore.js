// src/stores/authStore.js
import { defineStore } from 'pinia';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(credentials) {
      const data = await authService.login(credentials);
      this.token = data.access_token;
      this.user = data.user;
      localStorage.setItem('token', this.token);
    },

    async fetchUser() {
      const data = await authService.getUser();
      this.user = data.data.user;
    },

     // Nuevo método para limpiar el estado del frontend sin llamar al backend
    clearAuthData() {
      console.log("AuthStore: Limpiando datos de autenticación del frontend.");
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      // Puedes añadir aquí cualquier otra limpieza de datos sensibles si los tuvieras en el store
    },

    // Método de logout para cuando el usuario DESEA cerrar sesión
    async logout() {
      try {
        // Intentamos notificar al backend para que invalide el token actual
        await authService.logout(); 
        console.log("AuthStore: Sesión cerrada en el backend exitosamente.");
      } catch (error) {
        // Si el backend ya rechazó el token (ej. 401 por sesión expirada antes del logout manual),
        // no hay problema. La limpieza del frontend siempre debe ocurrir.
        console.warn("AuthService.logout() falló, pero procederemos a limpiar el estado local:", error);
      } finally {
        // Siempre limpiamos el estado del frontend, independientemente de la respuesta del backend
        this.clearAuthData();
      }
    }
  }
});
