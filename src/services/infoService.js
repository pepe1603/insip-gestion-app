// src/services/InfoService.js
import api from './api'; // Your Axios instance configured with the base API URL
import { useToastService } from './toastService'; // Your toast notification service

export default {
  /**
   * Fetches general API information and version details.
   * @returns {Promise<Object>} The API info object.
   * @throws {Error} If the API call fails.
   */
  async getSystemInfo() {
    try {
      // You can choose either '/api/info' or '/api/version' based on your preference.
      // Assuming '/api/info' is the primary endpoint for full details.
      const response = await api.get('/info');
      console.log('API System Info:', response.data);
      // Assuming the API returns the data directly in the response.data
      return response.data;
    } catch (error) {
      console.error('Error al obtener la información del sistema:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error desconocido al cargar la información del sistema.';
      useToastService().error(errorMessage, { title: 'Error de Sistema' });
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetches only the API version (if your backend has a dedicated endpoint for just the version).
   * This is optional, as getSystemInfo already provides the version.
   * @returns {Promise<Object>} The API version object.
   * @throws {Error} If the API call fails.
   */
  async getApiVersion() {
    try {
      const response = await api.get('/version');
      console.log('API Version:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la versión de la API:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error desconocido al cargar la versión de la API.';
      useToastService().error(errorMessage, { title: 'Error de Versión' });
      throw new Error(errorMessage);
    }
  }
};