<template>
  <div class="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
      Editar Usuario
    </h2>

    <UiAlert type="info" class="mb-4">
      <h3 class="font-semibold text-lg mb-1">Información para Editar Usuario</h3>
      <p class="text-sm">
        Puedes actualizar la información del usuario existente. Para cambiar la contraseña, haz clic en "Cambiar contraseña" para revelar los campos.
      </p>
    </UiAlert>

    <UiAlert v-if="userForm.empleado_id" type="warning" :show-icon="false" class="mb-6">
      <p class="text-sm">
        Este usuario está vinculado al empleado con ID: <strong>{{ userForm.empleado_id }} </strong>. El campo de email está deshabilitado.
        Para cambiar el email, por favor, edita la información del empleado en la sección de empleados.
      </p>
    </UiAlert>

    <UiAlert v-else type="info" class="mb-6">
      <h3 class="font-semibold text-lg mb-1">Vincular Usuario a Empleado</h3>
      <p class="text-sm">
        Este usuario **no está vinculado actualmente a un empleado**. Puedes vincularlo marcando la casilla "Vincular a Empleado" y luego introduciendo el ID del empleado.
      </p>
    </UiAlert>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <UiInputText
          id="name"
          label="Nombre de Usuario"
          placeholder="Nombre del usuario"
          v-model="userForm.name"
          :disabled="isSubmitting"
          type="text"
          :class="{
            'border-red-500': errors.name,
            'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-offset-2': !errors.name
          }"
          required
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
      </div>

      <div>
        <UiInputEmail
          id="email"
          label="Correo Electrónico (Email)"
          placeholder="ejemplo@dominio.com"
          v-model="userForm.email"
          :disabled="disableEmailField || isSubmitting"
          :class="{'cursor-not-allowed': disableEmailField}"
          :required="!disableEmailField"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>        
      </div>
      

      <div v-if="!userForm.empleado_id" class="p-2.5 shadow rounded-sm relative">
      <!-- Nota para -->
        <p class="text-sm mb-1 text-gray-500 dark:text-gray-400">
          - Si el usuario no esta vinculado a un empleado, puedes vincularlo marcando la casilla de abajo y el email del empleado sera tomado automaticamnte para usuario.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">- Si no deseas vincularlo, puedes dejar la casilla desmarcada y se mantendra el email actual.</p>
        <InformationCircleIcon class="w-5 h-5 text-gray-500 absolute right-1 top-1.5 transform -translate-y-1.5" />
      </div>


      <div v-if="!userForm.empleado_id" class="flex items-center space-x-2">
        <UiCheckbox
          id="toggle_empleado_id_input"
          v-model="showNewEmpleadoIdField"
          label="Vincular a un Empleado Existente"
          :disabled="isSubmitting"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ showNewEmpleadoIdField ? 'Ahora puedes ingresar el ID del empleado.' : 'Marca para vincular a un empleado.' }}
        </span>
      </div>

      <div v-if="showNewEmpleadoIdField && !userForm.empleado_id">
        <UiInputText
          id="new_empleado_id_input"
          label="ID de Empleado a Vincular"
          placeholder="Ej: 123"
          v-model="userForm.new_empleado_id"
          :disabled="isSubmitting"
          type="number"
          :class="{
            'border-red-500': errors.empleado_id, // Usamos 'empleado_id' para errores del backend
            'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-offset-2': !errors.empleado_id
          }"
          required
        />
        <p v-if="errors.empleado_id" class="mt-1 text-sm text-red-600">{{ errors.empleado_id[0] }}</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Introduce el ID del empleado con el que deseas vincular este usuario.</p>
      </div>

      <div v-if="showPasswordFields">
        <UiInputPassword
          id="password"
          label="Nueva Contraseña"
          placeholder="Ingresa una nueva contraseña"
          v-model="userForm.password"
          :disabled="isSubmitting"
          :class="{
            'border-red-500': errors.password,
            'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-offset-2': !errors.password
          }"
          required
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
      </div>

      <div v-if="showPasswordFields">
        <UiInputPassword
          id="password_confirmation"
          label="Confirmar Nueva Contraseña"
          placeholder="Confirma tu nueva contraseña"
          v-model="userForm.password_confirmation"
          :disabled="isSubmitting"
          :class="{
            'border-red-500': errors.password_confirmation,
            'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-offset-2': !errors.password_confirmation
          }"
          required
        />
        <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation[0] }}</p>
      </div>

      <button
        type="button"
        @click="showPasswordFields = !showPasswordFields"
        class="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600"
        :disabled="isSubmitting"
      >
        {{ showPasswordFields ? 'Ocultar campos de contraseña' : 'Cambiar contraseña' }}
      </button>

      <div>
        <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
        <select
          id="role"
          v-model="userForm.role"
          :disabled="isSubmitting"
          :class="[
            'mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm dark:bg-gray-700 dark:text-white',
            errors.role ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-offset-2',
            isSubmitting ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
          ]"
          required
        >
          <option value="" disabled>Selecciona un rol</option>
          <option value="admin">Administrador</option>
          <option value="supervisor">Supervisor</option>
          <option value="employee">Empleado</option>
        </select>
        <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role[0] }}</p>
      </div>

      <div>
        <UiCheckbox v-model="userForm.is_active" id="is_active" label="Usuario Activo" :disabled="isSubmitting" />
        <p v-if="errors.is_active" class="mt-1 text-sm text-red-600">{{ errors.is_active[0] }}</p>
      </div>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="router.push({ name: 'admin-user-list' })"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UiSpinner v-if="isSubmitting" class="w-4 h-4 mr-2" />
          Actualizar Usuario
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import userService from '@/services/userService';
import { useGlobalToast } from '@/composables/useGlobalToast';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiAlert from '@/components/ui/UiAlert.vue';

// Importa tus componentes UI de input
import UiInputText from '@/components/ui/UiInputText.vue';
import UiInputEmail from '@/components/ui/UiInputEmail.vue';
import UiInputPassword from '@/components/ui/UiInputPassword.vue';
import UiCheckbox from '@/components/ui/UiCheckbox.vue';
import { InformationCircleIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const $toast = useGlobalToast();

const userForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  empleado_id: null, // ID del empleado actualmente vinculado (viene del backend)
  new_empleado_id: null, // Campo para ingresar un nuevo ID de empleado
  is_active: true, // ¡INICIALMENTE ACTIVO POR DEFECTO!
});

const errors = ref({});
const isSubmitting = ref(false);
const showPasswordFields = ref(false);
const showNewEmpleadoIdField = ref(false); // NUEVA bandera para controlar la visibilidad del campo de empleado_id

const disableEmailField = computed(() => {
  return userForm.value.empleado_id !== null;
});

// Watcher para resetear new_empleado_id si el checkbox se desmarca
watch(showNewEmpleadoIdField, (newValue) => {
  if (!newValue) {
    userForm.value.new_empleado_id = null;
    // Limpia el error si existía para este campo
    if (errors.value.empleado_id) {
      delete errors.value.empleado_id;
    }
  }
});

// --- Lógica para cargar los datos del usuario para edición ---
const loadUserForEdit = async () => {
  try {
    const user = await userService.getUser(props.id);
    userForm.value.name = user.name;
    userForm.value.email = user.email;
    userForm.value.role = user.role;
    userForm.value.empleado_id = user.empleado_id; // Carga el empleado_id existente
    userForm.value.is_active = user.is_active; // Carga el estado 'is_active' del usuario existente
    // No cargamos new_empleado_id aquí, ya que solo se usa para una nueva vinculación
    // Si el usuario ya tiene un empleado_id, el campo para vincular no se mostrará de todos modos.
    // Si no tiene, el checkbox estará desmarcado por defecto.
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al cargar los datos del usuario para edición.';
    $toast.error(errorMessage);
    console.error('Error loading user:', error);
    router.push({ name: 'admin-user-list' });
  }
};

// --- Lógica para enviar el formulario ---
const submitForm = async () => {
  isSubmitting.value = true;
  errors.value = {}; // Limpia errores anteriores

  try {
    const dataToSend = { ...userForm.value };

    // Limpieza de campos de contraseña si no se van a cambiar
    if (!showPasswordFields.value) {
      delete dataToSend.password;
      delete dataToSend.password_confirmation;
    }

    // Limpieza de campo de email si está deshabilitado
    if (userForm.value.empleado_id !== null) {
      delete dataToSend.email;
    }

    // Lógica para el campo de empleado_id
    // Si el usuario ya tiene un empleado_id, no enviamos nada relacionado con empleado_id.
    // El backend ya lo sabe y el campo de input no se muestra.
    if (userForm.value.empleado_id !== null) {
      delete dataToSend.empleado_id; // Asegúrate de no enviar el ID existente
      delete dataToSend.new_empleado_id; // Elimina el campo temporal si se ha creado
    } else {
      // Si el usuario NO tiene un empleado_id existente
      if (showNewEmpleadoIdField.value && dataToSend.new_empleado_id) {
        // Si el checkbox está marcado y se ingresó un ID, lo enviamos como 'empleado_id'
        dataToSend.empleado_id = dataToSend.new_empleado_id;
      } else {
        // Si el checkbox NO está marcado o no se ingresó un ID, asegúrate de que empleado_id sea null
        dataToSend.empleado_id = null;
      }
      delete dataToSend.new_empleado_id; // Siempre elimina el campo temporal
    }

    await userService.updateUser(props.id, dataToSend);
    $toast.success('Usuario actualizado exitosamente.');
    router.push({ name: 'admin-user-list' });

  } catch (error) {
    console.error('Error al guardar usuario:', error);
    if (error.response) {
      if (error.response.status === 422) {
        errors.value = error.response.data.errors || {};
        $toast.error('Por favor, corrige los errores del formulario.');
      } else if (error.response.status === 404) {
        errors.value = {};
        const errorMessage = error.response.data?.data || 'Error: Recurso no encontrado.';
        $toast.error(errorMessage);
      } else if (error.response.status === 400) {
        errors.value = {};
        const errorMessage = error.response.data?.data || 'Error: Solicitud incorrecta.'; // 400 es Bad Request
        // Si tu backend devuelve un mensaje específico en data.data para 400, úsalo:
        // const errorMessage = error.response.data?.data || error.response.data.message || 'Error: Solicitud incorrecta.';
        $toast.error(errorMessage);
      } else {
        errors.value = {};
        const errorMessage = error.response.data.message || 'Ocurrió un error inesperado al guardar el usuario.';
        $toast.error(errorMessage);
      }
    } else {
      errors.value = {};
      $toast.error('Ocurrió un error de red o un error inesperado.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

// --- Hook de ciclo de vida ---
onMounted(() => {
  loadUserForEdit();
});
</script>

<style scoped>
/* Aquí puedes añadir estilos específicos para este componente */
</style>