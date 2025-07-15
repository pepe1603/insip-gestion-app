// src/services/employeeDashboardService.js
import api from './api'; // Asegúrate de que 'api' es tu instancia de Axios
import { useToastService } from './toastService'; // Para manejar notificaciones

/**
 * Servicio para obtener datos específicos del dashboard del empleado.
 */
export default {
  /**
   * Obtiene la cantidad de días de vacaciones disponibles para un empleado.
   * GET /api/empleado-dashboard/{empleadoId}/vacaciones/disponibles
   * @param {number} empleadoId El ID del empleado.
   * @returns {Promise<Object>} Un objeto con `dias_disponibles`.
   */
  async getDiasVacacionesDisponibles(empleadoId) {
    try {
      const response = await api.get(`/empleado-dashboard/${empleadoId}/vacaciones/disponibles`);
      return response.data.data; // Esperamos { dias_disponibles: N }
    } catch (error) {
      console.error(`Error al obtener días de vacaciones disponibles para el empleado ${empleadoId}:`, error);
      const errorMessage = error.response?.data?.message || 'Error al cargar días de vacaciones disponibles.';
      useToastService().error(errorMessage, { title: 'Error de Vacaciones' });
      throw new Error(errorMessage);
    }
  },

  /**
   * Obtiene el último registro de asistencia de un empleado.
   * GET /api/empleado-dashboard/{empleadoId}/asistencias/ultima
   * @param {number} empleadoId El ID del empleado.
   * @returns {Promise<Object|null>} El objeto de la última asistencia o null si no hay.
   */
  async getUltimaAsistencia(empleadoId) {
    try {
      const response = await api.get(`/empleado-dashboard/${empleadoId}/asistencias/ultima`);
      return response.data.data; // Esperamos el objeto de asistencia o null
    } catch (error) {
      console.error(`Error al obtener la última asistencia para el empleado ${empleadoId}:`, error);
      const errorMessage = error.response?.data?.message || 'Error al cargar la última asistencia.';
      useToastService().error(errorMessage, { title: 'Error de Asistencia' });
      throw new Error(errorMessage);
    }
  },

  /**
   * Obtiene la antigüedad de un empleado.
   * GET /api/empleado-dashboard/{empleadoId}/antiguedad
   * @param {number} empleadoId El ID del empleado.
   * @returns {Promise<Object>} Un objeto con la información de antigüedad.
   */
  async getAntiguedad(empleadoId) {
    try {
      const response = await api.get(`/empleado-dashboard/${empleadoId}/antiguedad`);
      return response.data.data; // Esperamos { fecha_ingreso: ..., antiguedad_formato_humano: ... }
    } catch (error) {
      console.error(`Error al obtener la antigüedad para el empleado ${empleadoId}:`, error);
      const errorMessage = error.response?.data?.message || 'Error al cargar la antigüedad.';
      useToastService().error(errorMessage, { title: 'Error de Perfil' });
      throw new Error(errorMessage);
    }
  },

  /**
   * Obtiene la próxima solicitud de vacaciones aprobada para un empleado.
   * GET /api/empleado-dashboard/{empleadoId}/vacaciones/proxima-aprobada
   * @param {number} empleadoId El ID del empleado.
   * @returns {Promise<Object|null>} El objeto de la próxima vacación aprobada o null.
   */
  async getProximaVacacionAprobada(empleadoId) {
    try {
      const response = await api.get(`/empleado-dashboard/${empleadoId}/vacaciones/proxima-aprobada`);
      return response.data.data; // Esperamos el objeto de vacación o null
    } catch (error) {
      console.error(`Error al obtener la próxima vacación aprobada para el empleado ${empleadoId}:`, error);
      const errorMessage = error.response?.data?.message || 'Error al cargar próximas vacaciones aprobadas.';
      useToastService().error(errorMessage, { title: 'Error de Vacaciones' });
      throw new Error(errorMessage);
    }
  },

  /**
   * Obtiene una lista de solicitudes pendientes para un empleado.
   * GET /api/empleado-dashboard/{empleadoId}/solicitudes/pendientes
   * @param {number} empleadoId El ID del empleado.
   * @returns {Promise<Object[]>} Un array de solicitudes pendientes.
   */
  async getSolicitudesPendientes(empleadoId) {
    try {
      const response = await api.get(`/empleado-dashboard/${empleadoId}/solicitudes/pendientes`);
      return response.data.data; // Esperamos un array de solicitudes
    } catch (error) {
      console.error(`Error al obtener solicitudes pendientes para el empleado ${empleadoId}:`, error);
      const errorMessage = error.response?.data?.message || 'Error al cargar solicitudes pendientes.';
      useToastService().error(errorMessage, { title: 'Error de Solicitudes' });
      throw new Error(errorMessage);
    }
  },
};