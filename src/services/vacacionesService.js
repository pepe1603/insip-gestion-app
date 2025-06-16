import api from './api'
import { useToastService } from './toastService'

export default {
  async getAll() {
    try {
      const response = await api.get('/vacaciones', )
      console.log('getAll vacaiones: ', response.data.data);
      return response.data.data
    } catch (error) {
      console.error('Error al obtener las vacaciones:', error)
      const errorMessage = error.response?.data?.error || 'Error desconocido al obtener las vacaciones.'
      useToastService().error(errorMessage, { title: 'Error al cargar' })
      throw new Error(errorMessage)
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/vacaciones/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Error al obtener la vacación con ID ${id}:`, error)
      const errorMessage = error.response?.data?.error || `Error desconocido al obtener la vacación con ID ${id}.`
      useToastService().error(errorMessage, { title: 'Error al obtener' })
      throw new Error(errorMessage)
    }
  },

  async create(data) {
    try {
      const response = await api.post('/vacaciones', data)
      useToastService().success('Solicitud de vacación creada exitosamente.', { title: 'Éxito' })
      return response.data.data
    } catch (error) {
      console.error('Error al crear la solicitud de vacación:', error)
      const errorMessage = error.response?.data?.message ||  error.response?.data?.data?.error ||  'Error desconocido al crear la solicitud de vacación.'
      useToastService().error(errorMessage, { title: 'Error al crear' })
      throw new Error(errorMessage)
    }
  },


  async inicializarVacacionesHistoricas(data) {
  try {
    const response = await api.post('/vacaciones/inicializar-historico', data)
    useToastService().success('Vacaciones inicializadas exitosamente.', { title: 'Éxito' })
    return response.data.data
  } catch (error) {
    console.error('Error al inicializar vacaciones históricas:', error)
    const errorMessage = error.response?.data?.message || 'Error desconocido al inicializar vacaciones.'
    useToastService().error(errorMessage, { title: 'Error al inicializar' })
    throw new Error(errorMessage)
  }
},


  async update(id, data) {
    try {

      console.log('Actualizando solicitud de vacaciones con ID:', id, 'y datos:', data)
      const response = await api.put(`/vacaciones/${id}`, data)
      useToastService().success('Solicitud de vacación actualizada exitosamente.', { title: 'Éxito' })
      return response.data.data
    } catch (error) {
      console.error(`Error al actualizar la solicitud de vacación con ID ${id}:`, error)
      const errorMessage = error.response?.data?.message || `Error desconocido al actualizar la solicitud de vacación con ID ${id}.`
      useToastService().error(errorMessage, { title: 'Error al actualizar' })
      throw new Error(errorMessage)
    }
  },

  async delete(id) {
    try {
      await api.delete(`/vacaciones/${id}`)
      useToastService().success('Solicitud de vacación eliminada exitosamente.', { title: 'Éxito' })
      return true
    } catch (error) {
      console.error(`Error al eliminar la solicitud de vacación con ID ${id}:`, error)
      const errorMessage = error.response?.data?.error || `Error desconocido al eliminar la solicitud de vacación con ID ${id}.`
      useToastService().error(errorMessage, { title: 'Error al eliminar' })
      throw new Error(errorMessage)
    }
  },

  async aprobar(id) {
    try {
      const response = await api.post(`/vacaciones/${id}/aprobar`)
      useToastService().success('Solicitud de vacación aprobada exitosamente.', { title: 'Éxito' })
      return response.data.data
    } catch (error) {
      console.error(`Error al aprobar la solicitud de vacación con ID ${id}:`, error)
      const errorMessage = error.response?.data?.message || `Error desconocido al aprobar la solicitud de vacación con ID ${id}.`
      useToastService().error(errorMessage, { title: 'Error al aprobar' })
      throw new Error(errorMessage)
    }
  },

  async rechazar(id) {
    try {
      const response = await api.post(`/vacaciones/${id}/rechazar`)
      useToastService().success('Solicitud de vacación rechazada exitosamente.', { title: 'Éxito' })
      return response.data.data
    } catch (error) {
      console.error(`Error al rechazar la solicitud de vacación con ID ${id}:`, error)
      const errorMessage = error.response?.data?.message || `Error desconocido al rechazar la solicitud de vacación con ID ${id}.`
      useToastService().error(errorMessage, { title: 'Error al rechazar' })
      throw new Error(errorMessage)
    }
  },

  async cancelar(id) {
    try {
      const response = await api.post(`/vacaciones/${id}/cancelar`)
      useToastService().success('Solicitud de vacación cancelada exitosamente.', { title: 'Éxito' })
      return response.data.data
    } catch (error) {
      console.error(`Error al cancelar la solicitud de vacación con ID ${id}:`, error)
      const errorMessage = error.response?.data?.message || `Error desconocido al cancelar la solicitud de vacación con ID ${id}.`
      useToastService().error(errorMessage, { title: 'Error al cancelar' })
      throw new Error(errorMessage)
    }
  },

  async getByEmpleado(empleadoId) {
    try {
      const response = await api.get(`/vacaciones/empleado/${empleadoId}`)
      return response.data.data
    } catch (error) {
      console.error(`Error al obtener las vacaciones del empleado ${empleadoId}:`, error)
      const errorMessage = error.response?.data?.message || `Error desconocido al obtener las vacaciones del empleado ${empleadoId}.`
      useToastService().error(errorMessage, { title: 'Error al cargar' })
      throw new Error(errorMessage)
    }
  },

  async getPendientes() {
    try {
      const response = await api.get('/vacaciones/pendientes')
      return response.data.data
    } catch (error) {
      console.error('Error al obtener las vacaciones pendientes:', error)
      const errorMessage = error.response?.data?.error || 'Error desconocido al obtener las vacaciones pendientes.'
      useToastService().error(errorMessage, { title: 'Error al cargar' })
      throw new Error(errorMessage)
    }
  },

  async getDisponibilidad(empleadoId) {
    try {
      const response = await api.get(`/vacaciones/disponibilidad/${empleadoId}`)
      return response.data.data
    } catch (error) {
      console.error(`Error al obtener la disponibilidad de vacaciones del empleado ${empleadoId}:`, error)
      const errorMessage = error.response?.data?.messsage || `Error desconocido al obtener la disponibilidad de vacaciones del empleado ${empleadoId}.`
      useToastService().error(errorMessage, { title: 'Error al cargar' })
      throw new Error(errorMessage)
    }
  },

  /**
   * Exporta un reporte de vacaciones por empleado y ciclo.
   */
  async exportarPorEmpleadoCiclo(empleadoId, ciclo, formato = 'pdf', nombreArchivo = 'reporte_vacaciones_empleado_ciclo') {
    try {
      const response = await api.get('/reporte-vacaciones/empleado-ciclo', {
        params: {
          empleado_id: empleadoId,
          ciclo,
          format: formato
        },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: this._getMimeType(formato) })
      const filename = `${nombreArchivo}.${this._getFileExtension(formato)}`
      return { blob, filename }
    } catch (error) {
      console.error('Error al exportar reporte por empleado y ciclo:', error)
      const errorMessage = error.response?.data?.message || 'Error al generar el reporte.'
      useToastService().error(errorMessage, { title: 'Error al exportar' })
      throw new Error(errorMessage)
    }
  },

  /**
   * Exporta reporte de vacaciones por departamento
   */
  async exportarPorDepartamento(departamentoId, formato = 'pdf', nombreArchivo = 'reporte_vacaciones_departamento') {
    try {
      const response = await api.get('/reporte-vacaciones/departamento', {
        params: {
          departamento_id: departamentoId,
          format: formato
        },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: this._getMimeType(formato) })
      const filename = `${nombreArchivo}.${this._getFileExtension(formato)}`
      return { blob, filename }
    } catch (error) {
      console.error('Error al exportar reporte por departamento:', error)
      const errorMessage = error.response?.data?.message || 'Error al generar el reporte.'
      useToastService().error(errorMessage, { title: 'Error al exportar' })
      throw new Error(errorMessage)
    }
  },

  /**
   * Exporta días tomados por mes
   */
  async exportarDiasTomadosPorMes(año, formato = 'pdf', nombreArchivo = 'reporte_vacaciones_dias_por_mes') {
    try {
      const response = await api.get('/reporte-vacaciones/dias-tomados-mes', {
        params: { año, format: formato },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: this._getMimeType(formato) })
      const filename = `${nombreArchivo}_${año}.${this._getFileExtension(formato)}`
      return { blob, filename }
    } catch (error) {
      console.error('Error al exportar días tomados por mes:', error)
      const errorMessage = error.response?.data?.message || 'Error al generar el reporte.'
      useToastService().error(errorMessage, { title: 'Error al exportar' })
      throw new Error(errorMessage)
    }
  },

  /**
   * Exporta días tomados por semana
   */
  async exportarDiasTomadosPorSemana(año, formato = 'pdf', nombreArchivo = 'reporte_vacaciones_dias_por_semana') {
    try {
      const response = await api.get('/reporte-vacaciones/dias-tomados-semana', {
        params: { año, format: formato },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: this._getMimeType(formato) })
      const filename = `${nombreArchivo}_${año}.${this._getFileExtension(formato)}`
      return { blob, filename }
    } catch (error) {
      console.error('Error al exportar días tomados por semana:', error)
      const errorMessage = error.response?.data?.message || 'Error al generar el reporte.'
      useToastService().error(errorMessage, { title: 'Error al exportar' })
      throw new Error(errorMessage)
    }
  },

  /**
   * Exporta top empleados por días de vacaciones
   */
  async exportarTopEmpleados(limit = 5, formato = 'pdf', nombreArchivo = 'reporte_top_empleados') {
    try {
      const response = await api.get('/reporte-vacaciones/top-empleados', {
        params: { limit, format: formato },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: this._getMimeType(formato) })
      const filename = `${nombreArchivo}_${limit}empl.${this._getFileExtension(formato)}`
      return { blob, filename }
    } catch (error) {
      console.error('Error al exportar top empleados:', error)
      const errorMessage = error.response?.data?.message || 'Error al generar el reporte.'
      useToastService().error(errorMessage, { title: 'Error al exportar' })
      throw new Error(errorMessage)
    }
  },

  /**
   * Exporta vacaciones por rango de fechas
   */
  async exportarPorPeriodo(desde, hasta, formato = 'pdf', nombreArchivo = 'reporte_vacaciones_periodo') {
    try {
      const response = await api.get('/reporte-vacaciones/periodo', {
        params: { desde, hasta, format: formato },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: this._getMimeType(formato) })
      const filename = `${nombreArchivo}_${desde}_a_${hasta}.${this._getFileExtension(formato)}`
      return { blob, filename }
    } catch (error) {
      console.error('Error al exportar reporte por periodo:', error)
      const errorMessage = error.response?.data?.message || 'Error al generar el reporte.'
      useToastService().error(errorMessage, { title: 'Error al exportar' })
      throw new Error(errorMessage)
    }
  },

  /**
   * Exporta resumen general de vacaciones
   */
  async exportarResumen(formato = 'pdf', nombreArchivo = 'reporte_resumen_vacaciones') {
    try {
      const response = await api.get('/reporte-vacaciones/resumen', {
        params: { format: formato },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: this._getMimeType(formato) })
      const filename = `${nombreArchivo}.${this._getFileExtension(formato)}`
      return { blob, filename }
    } catch (error) {
      console.error('Error al exportar resumen de vacaciones:', error)
      const errorMessage = error.response?.data?.message || 'Error al generar el resumen.'
      useToastService().error(errorMessage, { title: 'Error al exportar' })
      throw new Error(errorMessage)
    }
  },

  // ─────────────── FUNCIONES AUXILIARES ───────────────

  _getMimeType(formato) {
    switch (formato) {
      case 'excel': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case 'csv': return 'text/csv'
      case 'pdf':
      default: return 'application/pdf'
    }
  },

  _getFileExtension(formato) {
    switch (formato) {
      case 'excel': return 'xlsx'
      case 'csv': return 'csv'
      case 'pdf':
      default: return 'pdf'
    }
  }
}