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
      this.user = data;
    },

    async logout() {
      await authService.logout();
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});
