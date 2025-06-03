import api from './api';
import { useToastService } from './toastService'; // Asegúrate de que la ruta al servicio sea correcta

export default {
  async getAll() {
    try {
      const response = await api.get('/tipos-asistencia');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los tipos de asistencia:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al obtener los tipos de asistencia.';
      useToastService().error(errorMessage, { title: 'Error al cargar' });
      throw errorMessage;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/tipos-asistencia/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener el tipo de asistencia con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al obtener el tipo de asistencia con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al obtener' });
      throw errorMessage;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/tipos-asistencia', data);
      useToastService().success('Tipo de asistencia creado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear el tipo de asistencia:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al crear el tipo de asistencia.';
      useToastService().error(errorMessage, { title: 'Error al crear' });
      throw errorMessage;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/tipos-asistencia/${id}`, data);
      useToastService().success('Tipo de asistencia actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar el tipo de asistencia con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al actualizar el tipo de asistencia con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async patch(id, data) {
    try {
      const response = await api.patch(`/tipos-asistencia/${id}`, data);
      useToastService().success('Tipo de asistencia actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al aplicar el parche al tipo de asistencia con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al aplicar el parche al tipo de asistencia con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/tipos-asistencia/${id}`);
      useToastService().success('Tipo de asistencia eliminado exitosamente.', { title: 'Éxito' });
      return true; // O podrías devolver la respuesta si la API devuelve algo útil en la eliminación
    } catch (error) {
      console.error(`Error al eliminar el tipo de asistencia con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al eliminar el tipo de asistencia con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al eliminar' });
      throw errorMessage;
    }
  },
};