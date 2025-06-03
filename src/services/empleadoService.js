import api from './api';
import { useToastService } from './toastService'; // Asegúrate de la ruta correcta

export default {
    async getAll() {
        try {
          const response = await api.get('/empleados');
          console.log('Respuesta del API (getAll):', response.data); // Mantenemos el log para referencia
          return response.data.data; // <-- Cambiamos aquí para acceder al array dentro de data
        } catch (error) {
          console.error('Error al obtener los empleados:', error);
          const errorMessage = error.response?.data?.message || 'Error desconocido al obtener los empleados.';
          useToastService().error(errorMessage, { title: 'Error al cargar' });
          throw errorMessage;
        }
      },

  async getById(id) {
    try {
      const response = await api.get(`/empleados/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener el empleado con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al obtener el empleado con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al obtener' });
      throw errorMessage;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/empleados', data);
      useToastService().success('Empleado creado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear el empleado:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al crear el empleado.';
      useToastService().error(errorMessage, { title: 'Error al crear' });
      throw errorMessage;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/empleados/${id}`, data);
      useToastService().success('Empleado actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar el empleado con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al actualizar el empleado con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async patch(id, data) {
    try {
      const response = await api.patch(`/empleados/${id}`, data);
      useToastService().success('Empleado actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al aplicar el parche al empleado con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al aplicar el parche al empleado con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/empleados/${id}`);
      useToastService().success('Empleado eliminado exitosamente.', { title: 'Éxito' });
      return true;
    } catch (error) {
      console.error(`Error al eliminar el empleado con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al eliminar el empleado con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al eliminar' });
      throw errorMessage;
    }
  },

  async getByDepartamento(departamentoId) {
    try {
      const response = await api.get(`/empleados/departamento/${departamentoId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener empleados del departamento ${departamentoId}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al obtener empleados del departamento ${departamentoId}.`;
      useToastService().error(errorMessage, { title: 'Error al cargar' });
      throw errorMessage;
    }
  },

  async getActivos() {
    try {
      const response = await api.get('/empleados/activos');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener los empleados activos:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener los empleados activos.';
      useToastService().error(errorMessage, { title: 'Error al cargar' });
      throw errorMessage;
    }
  },

  async buscar(nombre) {
    try {
      const response = await api.get('/empleados/buscar', { params: { nombre } });
      return response.data.data;
    } catch (error) {
      console.error(`Error al buscar empleados con el nombre "${nombre}":`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al buscar empleados con el nombre "${nombre}".`;
      useToastService().error(errorMessage, { title: 'Error al buscar' });
      throw errorMessage;
    }
  },

  async buscarPorTermino(termino) {
    try {
      const posibleId = parseInt(termino, 10);

      if (!isNaN(posibleId) && Number.isInteger(posibleId)) {
        // Intentar buscar por ID
        const empleadoPorId = await this.getById(posibleId);
        if (empleadoPorId) {
          return [empleadoPorId]; // Devolver un array con el empleado encontrado
        }
        // Si no se encuentra por ID, se continua con la búsqueda por nombre
      }

      if (termino.length > 2) {
        // Buscar por nombre
        const responseNombre = await api.get('/empleados/buscar', { params: { nombre: termino } });
        return responseNombre.data.data;
      }

      return []; // Devolver un array vacío si el término es muy corto o no se encuentra
    } catch (error) {
      console.error(`Error al buscar empleados con el término "${termino}":`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al buscar empleados con el término "${termino}".`;
      useToastService().error(errorMessage, { title: 'Error al buscar' });
      return []; // Devolver un array vacío en caso de error
    }
  },

  async cambiarStatus(id, status) {
    try {
      const response = await api.put(`/empleados/${id}/cambiar-status`, { status });
      useToastService().success('Status del empleado actualizado exitosamente.', { title: 'Éxito' });
      return response.data.data;
    } catch (error) {
      console.error(`Error al cambiar el status del empleado con ID ${id}:`, error);
      const errorMessage = error.response?.data?.message || `Error desconocido al cambiar el status del empleado con ID ${id}.`;
      useToastService().error(errorMessage, { title: 'Error al actualizar' });
      throw errorMessage;
    }
  },

  async exportarReporte(formato = 'pdf', nombreArchivo = 'reporte_empleados') {
    try {
      const response = await api.get('/reporte-empleados/exportar', {
        params: {
          format: formato,
          filename: nombreArchivo,
        },
        responseType: 'blob', // Important: Indica que la respuesta es un blob (archivo)
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${nombreArchivo}.${formato === 'excel' ? 'xlsx' : formato}`); // <--- CORRECCIÓN AQUÍ
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      useToastService().success(`Reporte de empleados exportado a formato ${formato}.`, { title: 'Éxito' });
      return true;
    } catch (error) {
      console.error('Error al exportar el reporte de empleados:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al exportar el reporte.';
      useToastService().error(`Error al exportar el reporte: ${errorMessage}`, { title: 'Error al exportar' });
      throw errorMessage;
    }
  },
};