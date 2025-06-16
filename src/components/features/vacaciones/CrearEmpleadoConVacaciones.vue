<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-6 text-center">Registrar Empleado con Vacaciones Históricas</h1>

    <form @submit.prevent="submit" class="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow rounded-lg p-6">

      <!-- Datos del Empleado -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <UiInput v-model="empleado.nombre" label="Nombre" required />
        <UiInput v-model="empleado.apellido" label="Apellido" required />
        <UiInput v-model="empleado.email" label="Email" type="email" />
        <UiInput v-model="empleado.fecha_ingreso" label="Fecha de Ingreso" type="date" required />
      </div>

      <!-- Días Arrastrados -->
      <div class="mb-6">
        <UiInputNumber
          v-model.number="diasArrestados"
          label="Días Vacacionales Arrastrados del Año Anterior"
          :min="0"
          help="Estos días no se pudieron disfrutar y se suman a los días correspondientes por antigüedad."
        />
      </div>

      <!-- Botones -->
      <div class="flex justify-end space-x-4">
        <button type="button" @click="cancelar" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
          Cancelar
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Registrar Empleado y Vacaciones
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Servicios
import vacacionesService from '../../../services/vacacionesService'
import empleadoService from '../../../services/empleadoService' // Debes tener este servicio también
import { useToastService } from '../../../services/toastService'

const emit = defineEmits(['success', 'cancel'])

// Formulario de empleado
const empleado = ref({
  nombre: '',
  apellido: '',
  email: '',
  fecha_ingreso: ''
})

const diasArrestados = ref(0)

// Enviar formulario
const submit = async () => {
  try {
    // 1. Registrar al empleado
    const empleadoCreado = await empleadoService.create(empleado.value)
    const empleadoId = empleadoCreado.id

    // 2. Inicializar vacaciones históricas con días arrastrados
    await vacacionesService.inicializarVacacionesHistoricas({
      empleado_id: empleadoId,
      dias_vacaciones_arrastrados: diasArrestados.value
    })

    // 3. Mostrar éxito
    useToastService().success('Empleado y vacaciones registrados correctamente.')
    
  } catch (error) {
    console.error(error)
    useToastService().error('Hubo un problema al registrar al empleado o las vacaciones.', { title: 'Error' })
  }
}

const cancelar = () => {
  emit('cancel')
}
</script>


<style scoped>
/*
input[type="text"],
input[type="email"],
input[type="date"] {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}*/
</style>