<template>
  <div class="container mx-auto p-4 pb-8">
    <h1 class="text-3xl font-semibold mb-6 text-indigo-600">Reporte de Vacaciones por Empleado y Ciclo</h1>

    <p class="mb-4 text-gray-700">
      Selecciona un empleado y un ciclo de servicio (generalmente el año) para generar y descargar el reporte de sus vacaciones.
    </p>

    <div class="mb-6">
      <UiDescriptionList
        title="Información del Reporte"
        description="Este reporte incluye las vacaciones solicitadas, aprobadas y disfrutadas por el empleado."
        :items="reporteInfo"
      />
    </div>

    <div class="my-10">
      <UiDivider label="Filtros y Datos del Archivo" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      <UiSelect
        v-model="empleadoId"
        id="empleadoId"
        :options="empleadoOptions"
        placeholder="Selecciona un empleado"
        label="Empleado:"
        class="w-full sm:w-1/3"
        :required="true"
      />

      <UiInputText
        v-model="ciclo"
        type="text"
        id="ciclo"
        label="Año o Ciclo:"
        placeholder="Ej. 2025, 2025-A"
        class="w-full sm:w-1/3"
        :required="true" />

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
        :required="true"
      />

      <UiInputText
        v-model="nombreArchivo"
        type="text"
        id="nombreArchivo"
        label="Nombre del Archivo (opcional):"
        placeholder="reporte_vacaciones_empleado"
        class="w-full sm:w-1/3"
      />
    </div>

    <div class="flex justify-center mt-6">
      <UiButton variant="primary" size="large" :disabled="!isFormValid" @click="generarReporte">
        <DocumentArrowDownIcon class="w-6 h-6 mr-2" /> Generar Reporte
      </UiButton>
    </div>

    <div v-if="generando" class="mt-4 text-center text-gray-500">Generando el reporte...</div>
    <div v-if="generarError" class="mt-4 text-center text-red-500">Error al generar el reporte: {{ generarError }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue' // Importa computed
import { DocumentArrowDownIcon } from '@heroicons/vue/20/solid'
import UiButton from '../../../../components/ui/UiButton.vue'
import UiSelect from '../../../../components/ui/UiSelect.vue'
import UiInputText from '../../../../components/ui/UiInputText.vue'
import UiDivider from '../../../../components/ui/UiDivider.vue'
import UiDescriptionList from '../../../../components/ui/UiDescriptionList.vue'
import { useToastService } from '../../../../services/toastService'
import VacacionesService from '../../../../services/vacacionesService'
import EmpleadoService from '../../../../services/empleadoService'

const { notify } = useToastService()

// Datos del formulario
const empleadoId = ref('')
const ciclo = ref('') // Este campo ahora será validado para asegurar un año/ciclo
const formato = ref('pdf')
const nombreArchivo = ref('')
const generando = ref(false)
const generarError = ref(null)

// Opciones para select de empleados
const empleadoOptions = ref([])

// Información del reporte
const reporteInfo = ref([
  { label: 'Fecha de Solicitud', value: 'Se incluirá la fecha en que se realizó la solicitud.' },
  { label: 'Fecha de Inicio', value: 'Se incluirá la fecha de inicio de las vacaciones.' },
  { label: 'Fecha de Fin', value: 'Se incluirá la fecha de fin de las vacaciones.' },
  { label: 'Días Solicitados', value: 'Se incluirá la cantidad de días solicitados.' },
  { label: 'Estado de Solicitud', value: 'Se indicará el estado actual de la solicitud.' },
])

// Computed para verificar si el formulario es válido
const isFormValid = computed(() => {
  // Ahora, validamos que 'empleadoId' y 'ciclo' no estén vacíos
  return !!empleadoId.value && !!ciclo.value && !!formato.value;
});

// Cargar empleados al montar el componente
const cargarEmpleados = async () => {
  try {
    const empleados = await EmpleadoService.getAll()
    empleadoOptions.value = empleados.map(e => ({
      label: `${e.nombre} ${e.ape_paterno} ${e.ape_materno || ''}`.trim(), // Asegura nombre completo
      value: e.id,
    }))
  } catch (error) {
    console.error('Error al cargar la lista de empleados:', error)
    useToastService().error('No se pudo cargar la lista de empleados.', { title: 'Error' })
  }
}

// Generar el reporte
const generarReporte = async () => {
  // Validaciones antes de generar el reporte
  if (!empleadoId.value) {
    useToastService().warning('Por favor, selecciona un empleado para generar el reporte.', { title: 'Advertencia' })
    return
  }

  if (!ciclo.value) {
    // Alerta específica si el campo "Ciclo" está vacío
    useToastService().warning('Por favor, ingresa el año o ciclo de servicio para el reporte.', { title: 'Año/Ciclo Requerido' })
    return
  }

  // Opcional: Validación de formato de ciclo (ej. solo números o "YYYY-A")
  // Puedes añadir una validación con una expresión regular si el formato del ciclo es estricto
  // Ejemplo: validar que sea un número de 4 dígitos o "YYYY-X"
  const cicloRegex = /^\d{4}(-\w)?$/; // Acepta 2025 o 2025-A
  if (!cicloRegex.test(ciclo.value)) {
    useToastService().warning('El formato del Año o Ciclo no es válido. Usa YYYY o YYYY-X (ej. 2025 o 2025-A).', { title: 'Formato Incorrecto' });
    return;
  }

  if (!formato.value || !['pdf', 'excel', 'csv'].includes(formato.value)) {
    useToastService().warning('Por favor, selecciona un formato de exportación válido (PDF, Excel, CSV).', { title: 'Advertencia' })
    return
  }

  if (nombreArchivo.value && nombreArchivo.value.length > 50) {
    useToastService().warning('El nombre del archivo no puede exceder los 50 caracteres.', { title: 'Advertencia' })
    return
  }

  generando.value = true
  generarError.value = null

  try {
    const filename = nombreArchivo.value || `reporte_vacaciones_empleado_${empleadoId.value}_${ciclo.value}` // Añade ciclo al nombre por defecto
    const { blob, filename: finalFilename } = await VacacionesService.exportarPorEmpleadoCiclo(
      empleadoId.value,
      ciclo.value, // Asegúrate de enviar el ciclo
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
    useToastService().error('Hubo un error al generar el reporte de vacaciones. Inténtalo de nuevo.', { title: 'Error al exportar' })
  } finally {
    generando.value = false
  }
}

onMounted(() => {
  cargarEmpleados()
})
</script>