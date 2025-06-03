import api from './api';
import { useToastService } from './toastService'; // Asegúrate de la ruta correcta

export default {
  async getAll() {
    try {
      const response = await api.get('/vacaciones-oficiales');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las vacaciones oficiales:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al obtener las vacaciones oficiales.';
      useToastService().error(errorMessage, { title: 'Error al cargar' });
      throw errorMessage;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/vacaciones-oficiales/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener la vacación oficial con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al obtener la vacación oficial con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al obtener' });
      throw errorMessage;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/vacaciones-oficiales', data);
      useToastService().success('Vacación oficial creada exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear la vacación oficial:', error);
      const errorMessage = error.response?.data?.data?.error || 'Error desconocido al crear la vacación oficial.';
      useToastService().error(errorMessage, { title: 'Error al crear' });
      throw errorMessage;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/vacaciones-oficiales/${id}`, data);
      useToastService().success('Vacación oficial actualizada exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar la vacación oficial con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al actualizar la vacación oficial con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async patch(id, data) {
    try {
      const response = await api.patch(`/vacaciones-oficiales/${id}`, data);
      useToastService().success('Vacación oficial actualizada exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al aplicar el parche a la vacación oficial con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al aplicar el parche a la vacación oficial con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/vacaciones-oficiales/${id}`);
      useToastService().success('Vacación oficial eliminada exitosamente.', { title: 'Éxito' });
      return true;
    } catch (error) {
      console.error(`Error al eliminar la vacación oficial con ID ${id}:`, error);
      const errorMessage = error.response?.data?.data?.error || `Error desconocido al eliminar la vacación oficial con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al eliminar' });
      throw errorMessage;
    }
  },
};