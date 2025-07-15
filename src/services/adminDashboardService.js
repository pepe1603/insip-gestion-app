// src/services/adminDashboardService.js
import api from './api';
import { useToastService } from './toastService';

/**
 * Servicio para obtener datos específicos del dashboard de ADMINISTRACIÓN.
 * Agrupa todas las llamadas a las nuevas rutas prefijadas con /dashboard-admin.
 */
export default {
  // --- Asistencias para el Dashboard Admin ---
  async getAsistenciasHoy() {
    try {
      const response = await api.get('/dashboard-admin/asistencias/hoy');
      // Esperamos { data: [...], message: "..." }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener asistencias del día (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener asistencias de hoy (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Asistencia' });
      throw new Error(errorMessage);
    }
  },

  async getLatestAsistencias(limit = 5) {
    try {
      const response = await api.get('/dashboard-admin/asistencias/recientes', { params: { limit } });
      // Esperamos { data: [...], message: "..." }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las últimas asistencias (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener asistencias recientes (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Asistencia' });
      throw new Error(errorMessage);
    }
  },

  // --- Empleados para el Dashboard Admin ---
  async getEmpleadoStatusCounts() {
    try {
      const response = await api.get('/dashboard-admin/empleados/status-counts');
      // Esperamos { data: {activo: X, inactivo: Y, total: Z}, message: "..." }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener conteos de estado de empleados (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener conteo de empleados por estado (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Empleados' });
      throw new Error(errorMessage);
    }
  },

  async getRecentlyHiredEmployees(days = 30) {
    try {
      const response = await api.get('/dashboard-admin/empleados/recien-ingresados', { params: { days } });
      // Esperamos { data: [...], message: "..." }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener empleados recién ingresados (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener empleados recién ingresados (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Empleados' });
      throw new Error(errorMessage);
    }
  },

  // --- Vacaciones para el Dashboard Admin ---
  async getResumenEstadosVacaciones(anio) {
    try {
      const response = await api.get(`/dashboard-admin/vacaciones/resumen-estados/${anio}`);
      // Esperamos { data: {...}, message: "..." }
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener resumen de estados de vacaciones para el año ${anio} (Admin Dashboard):`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al obtener resumen de vacaciones para el año ${anio} (Admin).`;
      useToastService().error(errorMessage, { title: 'Error Admin Vacaciones' });
      throw new Error(errorMessage);
    }
  },

  async getProximasVacaciones() {
    try {
      const response = await api.get('/dashboard-admin/vacaciones/proximas');
      // Esperamos { data: [...], message: "..." }
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener próximas vacaciones (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener próximas vacaciones (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Vacaciones' });
      throw new Error(errorMessage);
    }
  },

  async getDiasVacacionesPorMes(anio) {
    try {
      const response = await api.get(`/dashboard-admin/vacaciones/dias-por-mes/${anio}`);
      // Esperamos { data: {...}, message: "..." }
      console.log('data getDiasVacacionesporMes: ', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener días de vacaciones por mes para el año ${anio} (Admin Dashboard):`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al obtener días de vacaciones por mes para el año ${anio} (Admin).`;
      useToastService().error(errorMessage, { title: 'Error Admin Vacaciones' });
      throw new Error(errorMessage);
    }
  },

  async getTopEmpleadosAntiguos() {
    try {
      const response = await api.get('/dashboard-admin/vacaciones/empleados/top-antiguos');
      // Esperamos { data: [...], message: "..." }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener top de empleados antiguos (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener top de empleados antiguos (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Vacaciones' });
      throw new Error(errorMessage);
    }
  },

  // --- Usuarios para el Dashboard Admin ---
  async getTotalUsersCount() {
    try {
      const response = await api.get('/dashboard-admin/users/total');
      // ! AJUSTE AQUÍ: El backend retorna { status, total_users, message } directamente
      // ! No hay un 'data' wrapper en la respuesta del controlador.
      // Por lo tanto, regresamos el objeto completo para que el componente acceda a 'total_users'
      return response.data;
    } catch (error) {
      console.error('Error al obtener el total de usuarios (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener el total de usuarios (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Usuarios' });
      throw new Error(errorMessage);
    }
  },

  async getUsersCountByRole() {
    try {
      const response = await api.get('/dashboard-admin/users/by-role');
      // Esperamos { data: {...}, message: "..." }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener conteo de usuarios por rol (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener usuarios por rol (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Usuarios' });
      throw new Error(errorMessage);
    }
  },

  async getActiveInactiveUsersCount() {
    try {
      const response = await api.get('/dashboard-admin/users/active-vs-inactive');
      // ! AJUSTE AQUÍ: El backend retorna { active_users, inactive_users, message } directamente
      // ! No hay un 'data' wrapper en la respuesta del controlador.
      // Por lo tanto, regresamos el objeto completo para que el componente acceda a las propiedades
      return response.data;
    } catch (error) {
      console.error('Error al obtener conteo de usuarios activos/inactivos (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener usuarios activos/inactivos (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Usuarios' });
      throw new Error(errorMessage);
    }
  },

  async getRecentlyRegisteredUsers(days = 30) {
    try {
      const response = await api.get('/dashboard-admin/users/recently-registered', { params: { days } });
      // Esperamos { data: [...], message: "..." }
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener usuarios recién registrados (Admin Dashboard):', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener usuarios recién registrados (Admin).';
      useToastService().error(errorMessage, { title: 'Error Admin Usuarios' });
      throw new Error(errorMessage);
    }
  },
};