// src/services/connectivityService.js

/**
 * Servicio para verificar la conectividad de la aplicación con el backend.
 */
export const connectivityService = {
  /**
   * Realiza una petición GET a un endpoint de salud del backend.
   * @returns {Promise<boolean>} Una promesa que resuelve a `true` si hay conexión, `false` en caso contrario.
   */
  async checkBackendConnectivity() {
    try {
		
      const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:80/api';
        console.log('base Url backend conectivityService: ', baseUrl);

      const healthCheckUrl = `${baseUrl}/health`;
      
      // CAMBIO CLAVE: Usamos 'GET' en lugar de 'HEAD'
      const response = await fetch(healthCheckUrl, {
        method: 'GET',
        cache: 'no-store',
      });

      // Si la respuesta es OK (estado 200), significa que el backend es accesible.
      return response.ok;
    } catch (error) {
      // Si hay un error de red, significa que no hay conectividad.
      console.error("Error al verificar la conectividad del backend:", error);
      return false;
    }
  },
};