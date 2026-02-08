/**
 * Servicio para verificar si la API está en mantenimiento.
 */

export const maintenanceService = {
  async isInMaintenance() {
    try {
      
      const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:80/api';

        console.log('env->API_URL maintenaceServicec:  ', baseUrl);
      const infoUrl = `${baseUrl}/status`;

      const response = await fetch(infoUrl, {
        method: 'GET',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        cache: 'no-store',
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data?.status?.toLowerCase() === 'mantenimiento';
    } catch (error) {
      console.error('[maintenanceService] Error al verificar mantenimiento:', error);
      return false;
    }
  }
};
