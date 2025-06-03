// src/services/AsistenciasService.js
import api from './api';
import { useToastService } from './toastService';

export default {
  // Sección 1: Métodos para endpoints CRUD de asistencias
  async getAll(params = {}) {
    try {
      const response = await api.get('/asistencias', { params });
      console.log('getAsitencias->get()', response.data); // Verifica la estructura de datos de la respuesta
      return {
        data: response.data.data, // Accedemos al array de asistencias
        currentPage: response.data.data.current_page,
        totalPages: response.data.data.last_page,
        perPage: response.data.data.per_page,
        total: response.data.data.total,
        // Puedes incluir más información de paginación si la necesitas
      };
    } catch (error) {
      console.error('Error al obtener las asistencias:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener las asistencias.';
      useToastService().error(errorMessage, { title: 'Error al cargar' });
      throw errorMessage;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/asistencias/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener la asistencia con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al obtener la asistencia con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al obtener' });
      throw errorMessage;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/asistencias', data);
      useToastService().success('Asistencia creada exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear la asistencia:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al crear la asistencia.';
      useToastService().error(errorMessage, { title: 'Error al crear' });
      throw errorMessage;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/asistencias/${id}`, data);
      useToastService().success('Asistencia actualizada exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar la asistencia con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al actualizar la asistencia con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/asistencias/${id}`);
      useToastService().success('Asistencia eliminada exitosamente.', { title: 'Éxito' });
      return true;
    } catch (error) {
      console.error(`Error al eliminar la asistencia con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al eliminar la asistencia con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al eliminar' });
      throw errorMessage;
    }
  },

  // Sección 2: Métodos para endpoints de reportes de asistencias
  async exportarTodo(params = {}, options = {}) {
    try {
      const response = await api.get('/reporte-asistencias/exportar', { params, ...options });
      return response;
    } catch (error) {
      console.error('Error al exportar todas las asistencias:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al exportar las asistencias.';
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },

  async porRangoFechas(fechaInicio, fechaFin, params = {}, options = {}) {
    try {
      const response = await api.get('/reporte-asistencias/por-rango', {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin, ...params  },
        ...options,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Error al exportar asistencias por rango de fechas:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al exportar por rango de fechas.';
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },

  async porTipoAsistencia(tipoAsistenciaId, params = {}, options = {}) {
    try {
      const response = await api.get(`/reporte-asistencias/tipo/por-tipo-asistencia`, {
        params: { ...params, tipo_asistencia_id: tipoAsistenciaId },//se agrega el id del tipo de asistencia a los params
        ...options ,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error(`Error al exportar asistencias por tipo ${tipoAsistenciaId}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al exportar por tipo ${tipoAsistenciaId}.`;
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },

  async porEmpleado(empleadoId, params = {}, options = {}) {
    try {
      const response = await api.get(`/reporte-asistencias/por-empleado`, {
         params : { ...params, empleado_id: empleadoId },//se agrega el id del empleado a los params 
         ...options,
          responseType: 'blob' 
        });
      return response;
    } catch (error) {
      console.error(`Error al exportar asistencias del empleado ${empleadoId}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al exportar del empleado ${empleadoId}.`;
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },

  async porFecha(fecha, params = {}, options = {}) {
    try {
      const response = await api.get(`/reporte-asistencias/fecha`, {
         params : { ...params, fecha },//se agrega la fecha a los params
         ...options,
          responseType: 'blob'
        });
      return response;
    } catch (error) {
      console.error(`Error al exportar asistencias del día ${fecha}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al exportar del día ${fecha}.`;
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },

  async porEmpleadoYFecha(empleadoId, fecha, params = {}, options = {}) {
    try {
      const response = await api.get(`/reporte-asistencias/empleado-fecha`, {
         params : { ...params, empleado_id: empleadoId, fecha },//se agrega el id del empleado y la fecha a los params
         ...options ,
          responseType: 'blob',
        });
      return response;
    } catch (error) {
      console.error(`Error al exportar asistencias del empleado ${empleadoId} en la fecha ${fecha}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al exportar del empleado ${empleadoId} en la fecha ${fecha}.`;
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },

  async porMes(params = {}, options = {}) {
    try {
      const response = await api.get(`/reporte-asistencias/por-mes`, {
         params, 
         ...options ,
          responseType: 'blob' 
        });
      return response;
    } catch (error) {
      console.error(`Error al exportar asistencias del mes ${mes} del año ${anio}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al exportar del mes ${mes} del año ${anio}.`;
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },
};