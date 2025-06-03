import api from './api';
import { useToastService } from './toastService'; // Asegúrate de la ruta correcta

export default {
  async getAll() {
    try {
      const response = await api.get('/estados-solicitud');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los estados de solicitud:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al obtener los estados de solicitud.';
      useToastService().error(errorMessage, { title: 'Error al cargar' });
      throw errorMessage;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/estados-solicitud/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener el estado de solicitud con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al obtener el estado de solicitud con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al obtener' });
      throw errorMessage;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/estados-solicitud', data);
      useToastService().success('Estado de solicitud creado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear el estado de solicitud:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al crear el estado de solicitud.';
      useToastService().error(errorMessage, { title: 'Error al crear' });
      throw errorMessage;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/estados-solicitud/${id}`, data);
      useToastService().success('Estado de solicitud actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar el estado de solicitud con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al actualizar el estado de solicitud con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async patch(id, data) {
    try {
      const response = await api.patch(`/estados-solicitud/${id}`, data);
      useToastService().success('Estado de solicitud actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al aplicar el parche al estado de solicitud con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al aplicar el parche al estado de solicitud con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/estados-solicitud/${id}`);
      useToastService().success('Estado de solicitud eliminado exitosamente.', { title: 'Éxito' });
      return true; // O podrías devolver la respuesta si la API devuelve algo útil en la eliminación
    } catch (error) {
      console.error(`Error al eliminar el estado de solicitud con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al eliminar el estado de solicitud con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al eliminar' });
      throw errorMessage;
    }
  },
};