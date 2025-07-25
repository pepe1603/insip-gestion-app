// src/services/authService.js
import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/register', userData);
    console.log('api response service Register(): ', response.data)
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  async verifyResetCode(data) {
    // data: { email, code }
    const response = await api.post('/verify-reset-code', data);
    return response.data;
  },

  async resetPassword(data) {
    // data: { email, code, new_password }
    const response = await api.post('/reset-password', data);
    return response.data;
  },

  async getUser() {
    const response = await api.get('/profile/me');
    console.info(response);
    return response.data;
  },

  async logout() {
    const response = await api.get('/logout');
    return response.data;
  },

  async logoutOtherDevices(password) {
    const response = await api.post('/logout-other-devices', { password });
    return response.data;
  },

  async verifyEmail() {
    const response = await api.post('/verify-email');
    return response.data;
  },
  // --- NUEVO MÉTODO PARA CAMBIO DE CONTRASEÑA FORZADO ---
  async forceChangePassword(passwords) {
      // Asegúrate de que el token temporal ya esté en los headers de Axios
      const response = await api.post('/auth/force-password-change', passwords);
      return response.data; // Debería devolver el nuevo token de acceso completo
  },
  // ----------------------------------------------------
};