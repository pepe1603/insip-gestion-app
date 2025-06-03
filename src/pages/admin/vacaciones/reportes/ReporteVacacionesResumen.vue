<template>
  <div class="container mx-auto p-4 pb-8">
    <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Resumen General de Vacaciones</h1>

    <p class="mb-4 text-gray-700">
      Genera un resumen consolidado del estado actual de las vacaciones en la organización.
    </p>

    <div class="mb-6">
      <UiDescriptionList
        title="Información del Resumen"
        description="Este reporte incluye estadísticas clave sobre las vacaciones solicitadas y disfrutadas."
        :items="reporteInfo"
      />
    </div>

    <div class="my-10">
      <UiDivider label="Datos del Archivo" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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
        placeholder="reporte_resumen_vacaciones"
        class="w-full sm:w-1/3"
      />
    </div>

    <div class="flex justify-center mt-6">
      <UiButton variant="primary" size="large" @click="generarReporte">
        <DocumentArrowDownIcon class="w-6 h-6 mr-2" /> Generar Resumen
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
import UiDivider from '../../../../components/ui/UiDivider.vue'
import UiDescriptionList from '../../../../components/ui/UiDescriptionList.vue'
import { useToastService } from '../../../../services/toastService'
import VacacionesService from '../../../../services/vacacionesService'

const { notify } = useToastService()

// Datos del formulario
const formato = ref('pdf')
const nombreArchivo = ref('')
const generando = ref(false)
const generarError = ref(null)

// Información del reporte
const reporteInfo = ref([
  { label: 'Total de Solicitudes', value: 'Se incluirá la cantidad total de vacaciones solicitadas.' },
  { label: 'Días Disfrutados', value: 'Se incluirá la cantidad total de días de vacaciones disfrutados.' },
  { label: 'Promedio por Empleado', value: 'Se incluirá el promedio de días tomados por empleado.' },
  { label: 'Pendientes de Aprobación', value: 'Se indicará cuántas solicitudes aún no han sido aprobadas.' },
])

// Validar formato
const validarFormato = () => {
  if (!['pdf', 'excel', 'csv'].includes(formato.value)) {
    useToastService().warning('Por favor, selecciona un formato válido.', { title: 'Advertencia' })
    return false
  }
  return true
}

// Generar el reporte
const generarReporte = async () => {
  if (!validarFormato()) return

  if (nombreArchivo.value && nombreArchivo.value.length > 50) {
    useToastService().warning('El nombre del archivo no puede exceder los 50 caracteres.', { title: 'Advertencia' })
    return
  }

  generando.value = true
  generarError.value = null

  try {
    const filename = nombreArchivo.value || `reporte_resumen_vacaciones`
    const { blob, filename: finalFilename } = await VacacionesService.exportarResumen(
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
    console.error('Error al generar el resumen:', error)
    generarError.value = error.message
    useToastService().error('Hubo un error al generar el resumen de vacaciones.', { title: 'Error al exportar' })
  } finally {
    generando.value = false
  }
}
</script>