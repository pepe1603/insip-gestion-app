<template>
  <div class="container mx-auto p-4 pb-8">
    <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Reporte de Días Tomados por Mes</h1>

    <p class="mb-4 text-gray-700">
      Selecciona un año para generar y descargar el reporte de días de vacaciones utilizados por mes.
    </p>

    <div class="mb-6">
      <UiDescriptionList
        title="Información del Reporte"
        description="Este reporte muestra la cantidad de días de vacaciones disfrutados por mes."
        :items="reporteInfo"
      />
    </div>

    <div class="my-10">
      <UiDivider label="Filtros y Datos del Archivo" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      <!-- Año -->
      <UiInputText
        v-model="anio"
        type="number"
        id="anio"
        label="Año:"
        placeholder="Ej. 2025"
        min="1900"
        max="2100"
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
        placeholder="reporte_vacaciones_dias_por_mes"
        class="w-full sm:w-1/3"
      />
    </div>

    <div class="flex justify-center mt-6">
      <UiButton variant="primary" size="large" :disabled="!anio" @click="generarReporte">
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
import UiDivider from '../../../../components/ui/UiDivider.vue'
import UiDescriptionList from '../../../../components/ui/UiDescriptionList.vue'
import { useToastService } from '../../../../services/toastService'
import VacacionesService from '../../../../services/vacacionesService'

const { notify } = useToastService()

// Datos del formulario
const anio = ref('')
const formato = ref('pdf')
const nombreArchivo = ref('')
const generando = ref(false)
const generarError = ref(null)

// Información del reporte
const reporteInfo = ref([
  { label: 'Mes', value: 'Se incluirá el mes del año seleccionado.' },
  { label: 'Total de Días', value: 'Se incluirá la cantidad total de días de vacaciones disfrutados en ese mes.' },
])

// Validar año
const validarAnio = () => {
  const year = parseInt(anio.value)
  if (!anio.value || isNaN(year) || year < 1900 || year > 2100) {
    useToastService().warning('Por favor, ingresa un año válido.', { title: 'Advertencia' })
    return false
  }
  return true
}

// Generar el reporte
const generarReporte = async () => {
  if (!validarAnio()) return

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
    const filename = nombreArchivo.value || `reporte_vacaciones_dias_por_mes_${anio.value}`
    const { blob, filename: finalFilename } = await VacacionesService.exportarDiasTomadosPorMes(
      anio.value,
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