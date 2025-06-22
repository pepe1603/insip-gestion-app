<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-6 text-center">Registrar Empleado con Vacaciones Históricas</h1>

    <form @submit.prevent="submit" class="max-w-1xl md:max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">

      <!-- Datos del Empleado -->
      <div class="grid grid-cols-1 gap-4 mb-6">

        <UiDivider label="Datos del Empleado" size="sm" />

        <div class="w-full flex flex-wrap  items-center gap-2">
            <UiInputText v-model="empleado.nombre" label="Nombre" required />
            <UiInputText v-model="empleado.ape_paterno" label="Apellido Paterno" required />
            <UiInputText v-model="empleado.ape_materno" label="Apellido Materno" required />
        </div>
        <div class="w-full mx-auto flex flex-wrap gap-2  items-center mb-4">
          <UiInputText v-model="empleado.puesto" label="Puesto" required />
          <!-- Aquí se usa el componente UiSelect con los departamentos cargados -->
          <UiSelect
            v-model="empleado.departamento_id"
            label="Departamento"
            :options="departamentos"
            :disabled="isLoadingDepartments"
            required
          />
          <!-- Mensaje de error si falla la carga de departamentos -->
          <p v-if="departmentError" class="text-red-500 text-sm mt-1 w-full">
            Error al cargar departamentos: {{ departmentError.message }}
          </p>
          <UiSelect v-model="empleado.tipo_contrato" label="Tipo de Contrato" :options="tiposContrato" required />
          <UiInputDate v-model="empleado.fecha_ingreso" label="Fecha de Ingreso" required />
          <!-- Estado del Empleado -->
         <UiSelect v-model="empleado.status" label="Estado" :options="estadosEmpleado" required />
        </div>
        
        <UiDivider label="Vacaciones Históricas" size="sm" />
        <p class="text-sm text-gray-600 mb-4">
          Aquí puedes registrar los días vacacionales arrastrados del año anterior. Estos días se sumarán a los días correspondientes por antigüedad.
        </p>

        <!-- Días Arrastrados -->
        <div class="mb-6">
            <UiInputNumber
            v-model.number="diasArrestados"
            label="Días Vacacionales Arrastrados del Año Anterior"
            :min="0"
            help="Estos días no se pudieron disfrutar y se suman a los días correspondientes por antigüedad."
            class="w-64"
            />
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end space-x-4">
        <UiButton type="button" size="sm" variant="secondary" @click="cancelar">Cancelar</UiButton>
        <UiButton type="submit" size="sm" variant="primary">Registrar Empleado y Vacaciones</UiButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// Servicios
import empleadoService from '../../../services/empleadoService'
import vacacionesService from '../../../services/vacacionesService'
import { useToastService } from '../../../services/toastService'
import departamentosService from '../../../services/departamentosService' // Importar el servicio de departamentos

// UI Components
import UiInputText from '../../ui/UiInputText.vue'
import UiInputDate from '../../ui/UiInputDate.vue'
import UiInputNumber from '../../ui/UiInputNumber.vue'
import UiSelect from '../../ui/UiSelect.vue'
import router from '../../../router'
import UiButton from '../../ui/UiButton.vue'
import UiDivider from '../../ui/UiDivider.vue'

const emit = defineEmits(['success', 'cancel'])

// Variables de estado para la carga y error de departamentos
const isLoadingDepartments = ref(false)
const departmentError = ref(null)

// Estado del formulario
const empleado = ref({
  nombre: '',
  ape_paterno: '',
  ape_materno: '',
  puesto: '',
  departamento_id: null,
  fecha_ingreso: '',
  tipo_contrato: '',
  status: ''
})

const diasArrestados = ref(0)

// Opciones para selects
const departamentos = ref([]) // Se poblará con los datos de departamentosService.getAll()

const tiposContrato = [
  { value: 'MEDIO_TIEMPO', label: 'Medio Tiempo' },
  { value: 'TIEMPO_COMPLETO', label: 'Tiempo Completo' },
]

const estadosEmpleado = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' }
]

// Función para enviar el formulario
const submit = async () => {
  try {
    // 1. Registrar al empleado
    const empleadoCreado = await empleadoService.create(empleado.value)
    const empleadoId = empleadoCreado.id

    // 2. Inicializar vacaciones históricas con días arrastrados
    const payload = {
      empleado_id: empleadoId,
      dias_vacaciones_arrastrados: diasArrestados.value
    }

    await vacacionesService.inicializarVacacionesHistoricas(payload)

    // 3. Mostrar éxito
    useToastService().success('Empleado y vacaciones iniciales registrados correctamente.')
    router.push('/admin/empleados/lista') // Redirigir a la lista de empleados o donde sea apropiado

  } catch (error) {
    console.error('Error al registrar empleado o vacaciones:', error)
    useToastService().error('Hubo un problema al registrar al empleado o las vacaciones: ' + error.message)
  }
}

// Función para cargar los departamentos del servicio
const cargarDepartamentos = async () => {
  try {
    isLoadingDepartments.value = true // Indicar que la carga ha comenzado
    departmentError.value = null // Limpiar errores previos
    const loadedDepartments = await departamentosService.getAll()
    departamentos.value = loadedDepartments.map(dep => ({
      value: dep.id, // Asume que cada departamento tiene un 'id'
      label: dep.nombre // Asume que cada departamento tiene un 'nombre'
    }))

    if (departamentos.value.length === 0) {
      useToastService().warning('No se encontraron departamentos. Por favor, crea uno antes de registrar empleados.')
    }
  } catch (error) {
    departmentError.value = error // Almacenar el error para mostrarlo en la UI
    console.error('Error al cargar los departamentos:', error)
    useToastService().error('Error al cargar los departamentos: ' + error.message)
  } finally {
    isLoadingDepartments.value = false // Indicar que la carga ha terminado
  }
}

// Función para cancelar y regresar
const cancelar = () => {
  router.back()
}

// Hook de ciclo de vida: se ejecuta cuando el componente se monta
onMounted(async () => {
  await cargarDepartamentos() // Asegurarse de que la Promise se resuelve
})
</script>
