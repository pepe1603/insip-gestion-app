<template>
  <div class="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
      Crear Nuevo Usuario
    </h2>

    <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 rounded-lg">
      <h3 class="font-semibold text-lg mb-1">Información para Crear Usuario</h3>
      <p class="text-sm">
        Completa todos los campos para crear una nueva cuenta de usuario. La contraseña temporal se generará automáticamente si no la provees.
        Puedes vincular a un empleado existente o crear un usuario independiente con un email nuevo.
      </p>
    </div>
    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de Usuario</label>
        <input
          type="text"
          id="name"
          v-model="userForm.name"
          :class="{'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white': true,
                   'border-red-500': errors.name}"
          required
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
      </div>

      <div>
        <label for="employee_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID de Empleado (Opcional)</label>
        <input
          type="number"
          id="employee_id"
          v-model.number="userForm.empleado_id"
          @input="handleEmployeeIdChange"
          placeholder="Ingresa un ID de empleado para vincular"
          :class="{'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white': true,
                   'border-red-500': errors.empleado_id}"
        />
        <p v-if="errors.empleado_id" class="mt-1 text-sm text-red-600">{{ errors.empleado_id[0] }}</p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Si ingresas un ID de empleado, el email se autocompletará y no será editable.
        </p>
        <UiSpinner v-if="employeeEmailLookupLoading" class="w-4 h-4 mt-2 text-indigo-500" />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico (Email)</label>
        <input
          type="email"
          id="email"
          v-model="userForm.email"
          :disabled="disableEmailField"
          :class="{'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white': true,
                   'bg-gray-100 dark:bg-gray-700 cursor-not-allowed': disableEmailField,
                   'border-red-500': errors.email}"
          :required="!disableEmailField"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Temporal</label>
        <input
          type="password"
          id="password"
          v-model="userForm.password"
          placeholder="La contraseña será generada automáticamente si dejas este campo vacío"
          :class="{'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white': true,
                   'border-red-500': errors.password}"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Si no ingresas una contraseña, se generará una automáticamente.
        </p>
      </div>

      <div>
        <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
        <select
          id="role"
          v-model="userForm.role"
          :class="{'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white': true,
                   'border-red-500': errors.role}"
          required
        >
          <option value="" disabled>Selecciona un rol</option>
          <option value="admin">Administrador</option>
          <option value="supervisor">Supervisor</option>
          <option value="employee">Empleado</option>
        </select>
        <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role[0] }}</p>
      </div>

      <div class="flex items-center">
        <input
          id="is_active"
          type="checkbox"
          v-model="userForm.is_active"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <label for="is_active" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Usuario Activo al Crear
        </label>
      </div>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="router.push({ name: 'admin-user-list' })"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UiSpinner v-if="isSubmitting" class="w-4 h-4 mr-2" />
          Crear Usuario
        </button>
      </div>
    </form>

    <ModalDynamic
      :is-open="showSuccessModal"
      title="Modal Notificacion!"
      type="success"
      @close="closeSuccessModal"
    >

    <template #body>
              <div class="space-y-4 text-center">
        <p class="text-lg font-medium text-gray-800 dark:text-white">¡El usuario ha sido creado con éxito!</p>
        <div v-if="tempPassword" class="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-md border border-indigo-200 dark:border-indigo-700">
          <p class="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
            Contraseña Temporal: <span class="font-bold text-indigo-900 dark:text-indigo-100 break-all">{{ tempPassword }}</span>
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Por favor, comunica esta contraseña al nuevo usuario.
          </p>
        </div>
        <p v-if="actionRequiredMessage" class="text-sm  text-gray-700 dark:text-gray-300">
          <strong>Recomendacion:</strong> <br> {{ actionRequiredMessage }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          El usuario ha recibido un correo electrónico con sus credenciales e instrucciones.
        </p>
      </div>

    </template>

      <template #primary-action>
        <UiButton variant="success" @click="closeSuccessModal">Entendido</UiButton>
      </template>
    </ModalDynamic>
  </div>
</template>

<script setup>
//falta corregir algo de errores. 
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import userService from '@/services/userService';
import employeeApi from '@/services/empleadoService'; // Make sure this path is correct
import { useGlobalToast } from '@/composables/useGlobalToast';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import ModalDynamic from '@/components/modals/ModalDynamic.vue'; // Make sure this path is correct
import UiButton from '@/components/ui/UiButton.vue'; // Make sure this path is correct
import { debounce } from 'lodash'; // Make sure lodash is installed: npm install lodash

const router = useRouter();
const $toast = useGlobalToast();

const userForm = ref({
  name: '',
  email: '',
  password: '', // Optional/auto-generated
  role: '',
  empleado_id: null, // New field for employee ID
  is_active: true, // Default to active for new users
});

const errors = ref({});
const isSubmitting = ref(false);
const employeeEmailLookupLoading = ref(false);

// Success modal state
const showSuccessModal = ref(false);
const tempPassword = ref('');
const actionRequiredMessage = ref('');

// Computed property to control email field state
const disableEmailField = computed(() => {
  return userForm.value.empleado_id !== null && userForm.value.empleado_id !== '';
});

// --- Logic for employee ID and email auto-fill ---
const fetchEmployeeEmail = async (employeeId) => {
  if (!employeeId) {
    userForm.value.email = '';
    return;
  }

  employeeEmailLookupLoading.value = true;
  try {
    // Assuming employeeApi.getEmployeeById returns { id, name, email, ... }
    const employee = await employeeApi.getById(employeeId);
    userForm.value.email = employee.email;

    if(employee.email){
        $toast.info(`Email del empleado ${employee.nombre} (${employee.email}) autocompletado.`);
    }else{
        $toast.warning(`El empleado selecionado no cuenta con email para autocompletado.`);
    }

    
  } catch (error) {
    userForm.value.email = ''; // Clear email if lookup fails
    if (error.response?.status === 404) {
      $toast.error('Empleado no encontrado con ese ID.');
    } else {
      $toast.error('Error al buscar email del empleado.');
    }
    console.error('Error fetching employee email:', error);
  } finally {
    employeeEmailLookupLoading.value = false;
  }
};

const debouncedFetchEmployeeEmail = debounce(fetchEmployeeEmail, 500);

const handleEmployeeIdChange = () => {
  // Clear previous email and trigger lookup if valid ID is entered
  userForm.value.email = '';
  if (userForm.value.empleado_id && userForm.value.empleado_id > 0) {
    debouncedFetchEmployeeEmail(userForm.value.empleado_id);
  }
};

// --- Logic to submit the form (Create Mode) ---
const submitForm = async () => {
  isSubmitting.value = true;
  errors.value = {}; // Clear previous errors

  try {
    const dataToSend = { ...userForm.value };
    // Ensure password field is not sent if empty and backend handles auto-generation
    if (dataToSend.password === '') {
      delete dataToSend.password;
      delete dataToSend.password_confirmation;
    }
    console.log('Data to send createUser:', dataToSend); // Debugging line
    const response = await userService.createUser(dataToSend);
    $toast.success('Usuario creado exitosamente.');

    console.log('responsesucees: ', response);
    // Extract and display temporary credentials
    tempPassword.value = response.user?.temp_password || 'No disponible'; // Backend should return this
    actionRequiredMessage.value = response.action_required || 'El usuario debe cambiar su contraseña al iniciar sesión por primera vez.';
    showSuccessModal.value = true; // Open the success modal

    // Clear the form after successful creation
    resetForm();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    if (error.response?.status === 422) {
      errors.value = error.response.data?.data.errors;
      $toast.error('Por favor, corrige los errores del formulario.');
    } else {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado al guardar el usuario.';
      $toast.error(errorMessage);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  userForm.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    empleado_id: null,
    is_active: true,
  };
  errors.value = {};
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  tempPassword.value = '';
  actionRequiredMessage.value = '';
  router.push({ name: 'admin-user-list' }); // Redirect to list after modal close
};

// No onMounted for loading data, as it's a create form
</script>

<style scoped>
/* You can add additional styles here */
</style>