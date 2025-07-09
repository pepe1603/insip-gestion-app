// src/services/profileService.js
import api from './api';

export const profileService = {
  /**
   * Obtiene los datos del perfil del usuario autenticado.
   * GET /api/profile/me
   * @returns {Promise<Object>} Promesa que resuelve con los datos del perfil.
   */
  async getProfile() {
      const response = await api.get('/profile/me');
      // El backend devuelve {} data: { user: {...}, email_verified: true }
      return response.data.data;
  },

  /**
   * Actualiza los datos del perfil del usuario autenticado.
   * PATCH /api/profile
   * @param {Object} profileData - Datos a actualizar (e.g., { name: 'Nuevo Nombre', email: 'nuevo@email.com' }).
   * @returns {Promise<Object>} Promesa que resuelve con el resultado de la actualización.
   */
  async updateProfile(profileData) {
      const response = await api.patch('/profile', profileData );
      // El backend devuelve {data: { user: {...} } 
      return response.data.data;
  },

  /**
   * Actualiza la contraseña del usuario autenticado.
   * PATCH /api/profile/password
   * @param {Object} passwordData - Datos de la contraseña ({ current_password: 'old', password: 'new', password_confirmation: 'new' }).
   * @returns {Promise<Object>} Promesa que resuelve con el resultado de la actualización.
   */
  async updatePassword(passwordData) {
      const response = await api.patch('/profile/password', passwordData);
      // El backend devuelve { success: true, message: ... }
      return response.data
  },

  /**
   * Obtiene información específica para el dashboard del perfil.
   * GET /api/profile/dashboard-info
   * @returns {Promise<Object>} Promesa que resuelve con la información del dashboard.
   */
  async getDashboardInfo() {
      const response = await api.get('/profile/dashboard-info');
      // El backend devuelve { success: true, message: ..., data: { title: ..., welcome_message: ..., user_role: ... } }
      return response.data.data;
  },
  
  /**
   * Envía una solicitud para marcar el email del usuario autenticado como verificado.
   * POST /api/verify-email
   * @returns {Promise<Object>} Promesa que resuelve con el resultado de la operación.
   */
  async sendVerificationEmail() {
      const response = await api.post('/verify-email');
      // El backend debería devolver { success: true, message: 'Email verificado exitosamente.' } o similar.
      return response.data;
  },

    /**
   * Cierra la sesión del usuario en todos los dispositivos excepto el actual.
   * POST /api/logout-other-devices
   * @returns {Promise<Object>} Promesa que resuelve con el resultado de la operación.
   */
  async logoutOtherDevices() {
      const response = await api.post('/logout-other-devices');
      return response.data;
  },


};