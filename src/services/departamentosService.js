import api from './api';
import { useToastService } from './toastService'; // Asegúrate de la ruta correcta

export default {
  async getAll() {
    try {
      const response = await api.get('/departamentos');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los departamentos:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al obtener los departamentos.';
      useToastService().error(errorMessage, { title: 'Error al cargar' });
      throw errorMessage;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/departamentos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener el departamento con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al obtener el departamento con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al obtener' });
      throw errorMessage;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/departamentos', data);
      useToastService().success('Departamento creado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear el departamento:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al crear el departamento.';
      useToastService().error(errorMessage, { title: 'Error al crear' });
      throw errorMessage;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/departamentos/${id}`, data);
      useToastService().success('Departamento actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar el departamento con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al actualizar el departamento con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async patch(id, data) {
    try {
      const response = await api.patch(`/departamentos/${id}`, data);
      useToastService().success('Departamento actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al aplicar el parche al departamento con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al aplicar el parche al departamento con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/departamentos/${id}`);
      useToastService().success('Departamento eliminado exitosamente.', { title: 'Éxito' });
      return true; // O podrías devolver la respuesta si la API devuelve algo útil en la eliminación
    } catch (error) {
      console.error(`Error al eliminar el departamento con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al eliminar el departamento con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al eliminar' });
      throw errorMessage;
    }
  },

  async exportarDepartamentos() {
    try {
      const response = await api.get('/departamentos/generar-reporte', { responseType: 'blob' });
      useToastService().success(`Reporte de empleados exportado a formato PDF.`, { title: 'Éxito' });
      return response.data; // Devolvemos el blob para que el componente pueda manejar la descarga
      
    } catch (error) {
      console.error('Error al exportar el reporte de departamentos:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al exportar el reporte de departamentos.';
      useToastService().error(errorMessage, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },
};