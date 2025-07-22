<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
      <IdentificationIcon class="w-6 h-6 mr-3 text-blue-500" />
      Mis Datos de Empleado
      
      <button 
        :disabled="!employee"
        @click="toggleEditMode"
        :class="[
          'ml-auto p-2 rounded-full transition-colors duration-200',
          isEditing 
            ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg' 
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
        ]"
        title="Alternar modo de edición"
      >
        <LockClosedIcon v-if="!isEditing" class="w-5 h-5" />
        <LockOpenIcon v-else class="w-5 h-5" />
      </button>
    </h2>

    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
      <div v-if="isLoading" class="flex flex-col items-center justify-center p-8">
        <UiSpinner class="h-8 w-8 text-teal-600 animate-spin" />
        <p class="ml-3 text-gray-600 dark:text-gray-300 mt-4">Cargando tus datos de empleado...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative shadow-md" role="alert">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="h-6 w-6 mr-3 flex-shrink-0" />
          <div>
            <strong class="font-bold mr-2">¡Error al cargar tus datos!</strong>
            <span class="block sm:inline"> {{ error }}</span>
            <p v-if="detailedError" class="text-sm mt-2 opacity-90">{{ detailedError }}</p>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button @click="loadEmployeeData" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm">
            Reintentar
          </button>
        </div>
      </div>

      <div v-else-if="employee">
        <div v-if="isEditing" class="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 p-4 rounded-lg mb-6 shadow-md flex items-start">
          <InformationCircleIcon class="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-lg mb-1">¡Modo Edición Activado!</p>
            <p class="text-sm">
              Puedes actualizar tu <strong class="text-blue-900 dark:text-blue-100">teléfono y dirección</strong>. Para otros cambios (como puesto, salario o departamento), por favor, comunícate con el área de Recursos Humanos.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm text-gray-700 dark:text-gray-200">
          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <p class="font-semibold text-gray-800 dark:text-white">ID Empleado:</p>
            <p>{{ employee.id || 'N/A' }}</p>
          </div>
          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <p class="font-semibold text-gray-800 dark:text-white">Nombre Completo:</p>
            <p>{{ nombreFull || 'N/A' }}</p>
          </div>
          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <p class="font-semibold text-gray-800 dark:text-white">Email:</p>
            <p>{{ employee.email || 'N/A' }}</p>
          </div>
          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <p class="font-semibold text-gray-800 dark:text-white">Puesto:</p>
            <p>{{ employee.puesto || 'N/A' }}</p>
          </div>
          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <p class="font-semibold text-gray-800 dark:text-white">Departamento:</p>
            <p>{{ departamento || 'N/A' }}</p>
          </div>
          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <p class="font-semibold text-gray-800 dark:text-white">Fecha de Contratación:</p>
            <p>{{ formatDate(employee.fecha_ingreso) || 'N/A' }}</p>
          </div>

          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <label for="telefono" class="font-semibold text-gray-800 dark:text-white block mb-1">Teléfono:</label>
            <input
              v-if="isEditing"
              id="telefono"
              v-model="editableEmployee.telefono"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
            />
            <p v-else>{{ employee.telefono || 'N/A' }}</p>
          </div>

          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <label for="direccion" class="font-semibold text-gray-800 dark:text-white block mb-1">Dirección:</label>
            <input
              v-if="isEditing"
              id="direccion"
              v-model="editableEmployee.direccion"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
            />
            <p v-else>{{ employee.direccion || 'No Disponible' }}</p>
          </div>

          <div class="py-2 border-b border-gray-200 dark:border-gray-600">
            <p class="font-semibold text-gray-800 dark:text-white">Salario:</p>
            <p>{{ formatCurrency(employee.salario) || 'por motivos de privacidad no disponible' }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 dark:text-gray-400 p-4">
        No se encontraron tus datos de empleado.
      </div>
    </div>
    
    <div class="mt-6 flex justify-end space-x-4" >
      <template v-if="isEditing">
        <UiButton variant="secondary" @click="cancelEdit">
          <XMarkIcon class="w-5 h-5 mr-2" />Cancelar
        </UiButton>
        <UiButton variant="primary" @click="saveChanges" :disabled="isSaving">
          <ArrowPathIcon v-if="isSaving" class="w-5 h-5 mr-2 animate-spin" />
          <CheckIcon v-else class="w-5 h-5 mr-2" />Guardar Cambios
        </UiButton>
      </template>
      <template v-else>
        <router-link :to="{ name: 'employee-dashboard' }">
          <UiButton variant="secondary"> <ArrowLeftIcon class="w-5 h-5 mr-2" />Volver al Dashboard</UiButton>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalToast } from '@/composables/useGlobalToast';
import empleadoService from '@/services/empleadoService'; 

// Componentes UI
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiButton from '@/components/ui/UiButton.vue';

// Heroicons
import { 
  IdentificationIcon, 
  ExclamationTriangleIcon, 
  ArrowLeftIcon,
  LockClosedIcon, // Candado cerrado
  LockOpenIcon,   // Candado abierto
  InformationCircleIcon, // Para el mensaje de alerta
  XMarkIcon, // Para cancelar
  CheckIcon, // Para guardar
  ArrowPathIcon, // Para estado de guardando
} from '@heroicons/vue/24/outline';


const authStore = useAuthStore();
const $toast = useGlobalToast();

const employee = ref(null); // Datos originales del empleado
const nombreFull = ref(null);
const departamento = ref(null);
const editableEmployee = ref({}); // Copia para la edición
const isLoading = ref(true);
const error = ref(null);
const detailedError = ref(null);
const isEditing = ref(false); // Nuevo estado para el modo de edición
const isSaving = ref(false); // Nuevo estado para indicar que se están guardando los cambios

// Formateadores
const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  } catch (e) {
    console.error("Error al formatear fecha:", e);
    return dateString;
  }
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return null;
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// Cargar datos del empleado
const loadEmployeeData = async () => {
  isLoading.value = true;
  error.value = null;
  detailedError.value = null;
  employee.value = null;
  editableEmployee.value = {}; // Resetear también la copia editable

  const empleadoId = authStore.user?.empleado_id;
  const userName = authStore.user?.name || 'Usuario';

  if (!empleadoId) {
    error.value = `El ID de empleado para "${userName}" no está disponible.`;
    detailedError.value = 'Asegúrate de haber iniciado sesión con un perfil de empleado válido y que tu perfil tenga un ID de empleado asignado en el sistema.';
    $toast?.error(`Error: ID de empleado no disponible para ${userName}.`, { duration: 8000 });
    isLoading.value = false;
    return;
  }

  try {
    const data = await empleadoService.getById(empleadoId); 
    employee.value = data;
    // Crear una copia de los datos para edición
    editableEmployee.value = { ...data }; 
    
    if (employee) {
       nombreFull.value= `${employee.value.nombre} ${employee.value.ape_paterno} ${employee.value.ape_materno}`;
       //nombreFull.value = employee.value.nombre;
      departamento.value = employee.value.departamento?.nombre || 'Desconocido';
    }

  } catch (err) {
    console.error('Error al cargar los datos del empleado:', err);
    error.value = 'Ocurrió un error al cargar tus datos de empleado.';
    detailedError.value = err.message || 'Por favor, intenta recargar la página o verifica tu conexión a la red.';
  } finally {
    isLoading.value = false;
  }
};

// Lógica de Edición
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    // Si entramos en modo edición, hacemos una copia limpia para trabajar
    editableEmployee.value = { ...employee.value }; 
    $toast?.info('Modo edición activado. Puedes modificar tu teléfono y dirección.', { duration: 5000 });
  } else {
    // Si salimos del modo edición sin guardar, restablecemos los valores originales
    // Esto se maneja mejor con 'cancelEdit' si el usuario pulsa cancelar
    // Si pulsa el candado de nuevo, simplemente sale del modo, pero los cambios no guardados se perderán
    $toast?.info('Modo edición desactivado.', { duration: 3000 });
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editableEmployee.value = { ...employee.value }; // Restaurar datos originales
  $toast?.info('Edición cancelada. Los cambios no guardados se han descartado.', { duration: 3000 });
};

const saveChanges = async () => {
  isSaving.value = true;
  try {
    const changes = {
      telefono: editableEmployee.value.telefono,
      direccion: editableEmployee.value.direccion,
      // Puedes añadir más campos si decides hacerlos editables en el futuro
    };

    const updatedEmployee = await empleadoService.patch(employee.value.id, changes);
    employee.value = updatedEmployee; // Actualizar los datos originales con los guardados
    isEditing.value = false;
    $toast?.success('¡Tus datos han sido actualizados exitosamente!', { duration: 4000 });

  } catch (err) {
    console.error('Error al guardar los cambios:', err);
    $toast?.error('Error al guardar tus datos. Por favor, intenta de nuevo.', { duration: 5000 });
  } finally {
    isSaving.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadEmployeeData();
});

// Opcional: Si el empleado cambia en el authStore por alguna razón, recargar los datos
watch(() => authStore.user?.empleado_id, (newId, oldId) => {
  if (newId !== oldId) {
    loadEmployeeData();
  }
});
</script>

<style scoped>
/* No se necesitan estilos aquí, ya que todas las clases son de Tailwind CSS */
</style>