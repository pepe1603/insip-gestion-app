<template>
  <div class="container mx-auto p-4 pb-8">
    <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Reporte de Top Empleados por Días de Vacaciones</h1>

    <p class="mb-4 text-gray-700">
      Ingresa el número máximo de empleados que deseas incluir en el reporte y selecciona el formato para descargarlo.
    </p>

    <div class="mb-6">
      <UiDescriptionList
        title="Información del Reporte"
        description="Este reporte muestra los empleados con más días de vacaciones disfrutados."
        :items="reporteInfo"
      />
    </div>

    <div class="my-10">
      <UiDivider label="Filtros y Datos del Archivo" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      <!-- Límite de empleados -->
      <UiInputText
        v-model.number="limite"
        type="number"
        id="limite"
        label="Límite de Empleados:"
        placeholder="Ej. 5, 10, 20"
        min="1"
        max="100"
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
        placeholder="reporte_top_empleados"
        class="w-full sm:w-1/3"
      />
    </div>

    <div class="flex justify-center mt-6">
      <UiButton variant="primary" size="large" :disabled="!limite || limite < 1" @click="generarReporte">
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
const limite = ref(5)
const formato = ref('pdf')
const nombreArchivo = ref('')
const generando = ref(false)
const generarError = ref(null)

// Información del reporte
const reporteInfo = ref([
  { label: 'Empleado', value: 'Se incluirá el nombre completo del empleado.' },
  { label: 'Días Tomados', value: 'Se incluirá la cantidad total de días de vacaciones disfrutados.' },
  { label: 'Promedio por Solicitud', value: 'Se incluirá el promedio de días solicitados por vacación.' },
])

// Validar límite
const validarLimite = () => {
  const valor = parseInt(limite.value)
  if (!valor || isNaN(valor) || valor < 1 || valor > 100) {
    useToastService().warning('Por favor, ingresa un límite válido entre 1 y 100.', { title: 'Advertencia' })
    return false
  }
  return true
}

// Generar el reporte
const generarReporte = async () => {
  if (!validarLimite()) return

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
    const filename = nombreArchivo.value || `reporte_top_empleados_${limite.value}empl`
    const { blob, filename: finalFilename } = await VacacionesService.exportarTopEmpleados(
      limite.value,
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