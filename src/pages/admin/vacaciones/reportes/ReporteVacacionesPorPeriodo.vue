<template>
  <div class="container mx-auto p-4 pb-8">
    <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Reporte de Vacaciones por Período</h1>

    <p class="mb-4 text-gray-700">
      Selecciona un rango de fechas para generar y descargar el reporte de vacaciones correspondientes.
    </p>

    <div class="mb-6">
      <UiDescriptionList
        title="Información del Reporte"
        description="Este reporte incluye todas las vacaciones aprobadas dentro del rango de fechas seleccionado."
        :items="reporteInfo"
      />
    </div>

    <div class="my-10">
      <UiDivider label="Filtros y Datos del Archivo" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      <!-- Fecha de Inicio -->
      <UiInputDate
        v-model="fechaInicio"
        id="desde"
        label="Fecha de Inicio:"
        placeholder="Selecciona una fecha"
        class="w-full sm:w-1/3"
      />

      <!-- Fecha de Fin -->
      <UiInputDate
        v-model="fechaFin"
        id="hasta"
        label="Fecha de Fin:"
        placeholder="Selecciona una fecha"
        class="w-full sm:w-1/3"
      />

      <!-- Formato de Exportación -->
      <UiSelect
        v-model="formato"
        id="formato"
        :options="[
          { label: 'Excel', value: 'excel' },
          { label: 'CSV', value: 'csv' },
          { label: 'PDF', value: 'pdf' }
        ]"
        placeholder="Selecciona un formato"
        label="Formato de Exportación:"
        class="w-full sm:w-1/3"
      />

      <!-- Nombre del Archivo -->
      <UiInputText
        v-model="nombreArchivo"
        type="text"
        id="nombreArchivo"
        label="Nombre del Archivo (opcional):"
        placeholder="reporte_vacaciones_periodo"
        class="w-full sm:w-1/3"
      />
    </div>

    <div class="flex justify-center mt-6">
      <UiButton variant="primary" size="large" :disabled="!fechaInicio || !fechaFin" @click="generarReporte">
        <DocumentArrowDownIcon class="w-6 h-6 mr-2" /> Generar Reporte
      </UiButton>
    </div>

    <div v-if="generando" class="mt-4 text-center text-gray-500">Generando el reporte...</div>
    <div v-if="generarError" class="mt-4 text-center text-red-500">Error al generar el reporte: {{ generarError }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DocumentArrowDownIcon } from '@heroicons/vue/20/solid'
import UiButton from '../../../../components/ui/UiButton.vue'
import UiSelect from '../../../../components/ui/UiSelect.vue'
import UiInputText from '../../../../components/ui/UiInputText.vue'
import UiInputDate from '../../../../components/ui/UiInputDate.vue'
import UiDivider from '../../../../components/ui/UiDivider.vue'
import UiDescriptionList from '../../../../components/ui/UiDescriptionList.vue'
import { useToastService } from '../../../../services/toastService'
import VacacionesService from '../../../../services/vacacionesService'

const { notify } = useToastService()

// Datos del formulario
const fechaInicio = ref('')
const fechaFin = ref('')
const formato = ref('pdf')
const nombreArchivo = ref('')
const generando = ref(false)
const generarError = ref(null)

// Información del reporte
const reporteInfo = ref([
  { label: 'Empleado', value: 'Se incluirá el nombre completo del empleado.' },
  { label: 'Fecha de Solicitud', value: 'Se incluirá la fecha en que se realizó la solicitud.' },
  { label: 'Fecha de Inicio', value: 'Se incluirá la fecha de inicio de las vacaciones.' },
  { label: 'Fecha de Fin', value: 'Se incluirá la fecha de fin de las vacaciones.' },
  { label: 'Días Solicitados', value: 'Se incluirá la cantidad de días solicitados.' },
  { label: 'Estado de Solicitud', value: 'Se indicará el estado actual de la solicitud.' },
])

// Validar fechas
const validarFechas = () => {
  if (!fechaInicio.value || !fechaFin.value) {
    useToastService().warning('Por favor, selecciona ambas fechas.', { title: 'Advertencia' })
    return false
  }

  const inicio = new Date(fechaInicio.value)
  const fin = new Date(fechaFin.value)

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    useToastService().warning('Las fechas seleccionadas no son válidas.', { title: 'Advertencia' })
    return false
  }

  if (fin < inicio) {
    useToastService().warning('La fecha de fin no puede ser anterior a la de inicio.', { title: 'Advertencia' })
    return false
  }

  return true
}

// Generar el reporte
const generarReporte = async () => {
  if (!validarFechas()) return

  if (!formato.value || !['pdf', 'excel', 'csv'].includes(formato.value)) {
    useToastService().warning('Por favor, selecciona un formato válido.', { title: 'Advertencia' })
    return
  }

  if (nombreArchivo.value && nombreArchivo.value.length > 50) {
    useToastService().warning('El nombre del archivo no puede exceder los 50 caracteres.', { title: 'Advertencia' })
    return
  }

  generando.value = true
  generarError.value = null

  try {
    const filename = nombreArchivo.value || `reporte_vacaciones_periodo_${fechaInicio.value}_a_${fechaFin.value}`
    const { blob, filename: finalFilename } = await VacacionesService.exportarPorPeriodo(
      fechaInicio.value,
      fechaFin.value,
      formato.value,
      filename
    )

    // Crear URL del blob
    const url = window.URL.createObjectURL(blob)

    // Crear link y simular clic
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', finalFilename)
    document.body.appendChild(link)
    link.click()
    link.remove()

    // Limpiar memoria
    window.URL.revokeObjectURL(url)

    notify(`Descarga: ${finalFilename}`, {
      position: 'top-center',
      duration: 12000,
      title: 'Descarga Finalizada'
    })

  } catch (error) {
    console.error('Error al generar el reporte:', error)
    generarError.value = error.message
    useToastService().error('Hubo un error al generar el reporte de vacaciones.', { title: 'Error al exportar' })
  } finally {
    generando.value = false
  }
}
</script>