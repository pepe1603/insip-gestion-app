<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
      Lista de Usuarios del Sistema
    </h2>

    <div class="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">Gestión de Estado de Usuarios</h3>
      <p class="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
        Utiliza esta sección para buscar usuarios por su ID o email y **activar o desactivar** su cuenta.
        Una cuenta **desactivada** no podrá iniciar sesión en el sistema.
      </p>
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="flex-grow">
          <UiInputSearchWithResults
            placeholder="Buscar usuario por ID o Email"
            :searchServiceMethod="searchUsersByIdOrEmail"
            :formatResult="formatUserSearchResult"
            @selected="handleUserSelectedFromSearch"
            :minSearchLength="1"
            class="w-full"
            v-model="searchQueryForAction"
          >
            <template #icon>
              <MagnifyingGlassIcon class="w-5 h-5" />
            </template>
          </UiInputSearchWithResults>
        </div>
        <button
          @click="openToggleStatusModal(selectedUserForAction)"
          :disabled="!selectedUserForAction || toggleStatusLoading"
          :class="{
            'px-6 py-2 rounded-md font-semibold text-white transition-colors duration-200': true,
            'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500': selectedUserForAction && selectedUserForAction.is_active,
            'bg-green-600 hover:bg-green-700 focus:ring-green-500': selectedUserForAction && !selectedUserForAction.is_active,
            'bg-gray-400 cursor-not-allowed': !selectedUserForAction || toggleStatusLoading
          }"
        >
          <UiSpinner v-if="toggleStatusLoading" class="w-4 h-4 mr-2 text-white" />
          {{ selectedUserForAction ? (selectedUserForAction.is_active ? 'Desactivar Cuenta' : 'Activar Cuenta') : 'Selecciona un usuario' }}
        </button>
      </div>
      <div v-if="selectedUserForAction" class="mt-3 text-sm text-yellow-700 dark:text-yellow-300">
        Usuario seleccionado: **{{ selectedUserForAction.name }}** (ID: {{ selectedUserForAction.id }}, Estado: {{ selectedUserForAction.is_active ? 'Activo' : 'Inactivo' }})
        <p v-if="selectedUserForAction.is_active" class="text-xs mt-1">Haz clic en "Desactivar Cuenta" para inhabilitar el acceso de este usuario al sistema.</p>
        <p v-else class="text-xs mt-1">Haz clic en "Activar Cuenta" para restablecer el acceso de este usuario al sistema.</p>
      </div>
    </div>

    <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
      <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Filtrar y Ordenar Usuarios</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Utiliza los campos de búsqueda y los filtros para encontrar rápidamente usuarios específicos
        o para organizar la lista según tus necesidades. Puedes buscar por **nombre** o **email**,
        y filtrar por **rol** o **estado de la cuenta** (Activo/Inactivo).
      </p>
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex-grow w-full md:w-auto">
          <label for="search" class="sr-only">Buscar Usuario</label>
          <input
            type="text"
            id="search"
            v-model="filters.search"
            @input="debouncedFetchUsers"
            placeholder="Buscar por nombre o email..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div class="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <label for="role" class="sr-only">Filtrar por Rol</label>
          <select
            id="role"
            v-model="filters.role"
            @change="fetchUsers"
            class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Todos los Roles</option>
            <option value="admin">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="empleado">Empleado</option>
          </select>

          <label for="is_active" class="sr-only">Filtrar por Estado</label>
          <select
            id="is_active"
            v-model="filters.is_active"
            @change="fetchUsers"
            class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Todos los Estados</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <UiSpinner class="text-indigo-500 w-10 h-10 mx-auto" />
      <p class="text-gray-600 dark:text-gray-400 mt-2">Cargando usuarios...</p>
    </div>
    <div v-else-if="fetchError" class="text-center py-8 text-red-600 dark:text-red-400">
      <p>Error al cargar usuarios: {{ fetchError }}</p>
      <p v-if="detailedError" class="text-sm">Detalles: {{ detailedError }}</p>
    </div>
    <div v-else-if="users.length === 0" class="text-center py-8 text-gray-600 dark:text-gray-400">
      <p>No se encontraron usuarios que coincidan con los criterios de búsqueda o filtro.</p>
    </div>
    <div v-else class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer"
              @click="sortBy('id')"
            >
              ID
              <span v-if="sort.by === 'id'">{{ sort.order === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer"
              @click="sortBy('name')"
            >
              Nombre
              <span v-if="sort.by === 'name'">{{ sort.order === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer"
              @click="sortBy('email')"
            >
              Email
              <span v-if="sort.by === 'email'">{{ sort.order === 'asc' ? ' ▲' : ' ▼' }}</span>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
            >
              Rol
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
            >
              Estado
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {{ user.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
              <router-link
                :to="{ name: 'admin-user-detail', params: { id: user.id } }"
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
                title="Ver Detalles del Usuario"
              >
                {{ user.name }}
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
              {{ user.role }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="{'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                             'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100': user.is_active,
                             'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100': !user.is_active}">
                {{ user.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="userDetails(user.id)"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 mr-3"
                title="Ver Detalles de Usuario"
              >
                <InformationCircleIcon class="w-5 h-5 inline" />
              </button>
              <button
                @click="editUser(user.id)"
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-3"
                title="Editar Información del Usuario"
              >
                <PencilSquareIcon class="w-5 h-5 inline" />
              </button>
              <button
                @click="openToggleStatusModal(user)"
                :class="{'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-600': user.is_active,
                               'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600': !user.is_active,
                               'mr-3': true}"
                :title="user.is_active ? 'Desactivar Usuario' : 'Activar Usuario'"
              >
                <PowerIcon class="w-5 h-5 inline" />
              </button>
              <button
                @click="openDeleteUserModal(user)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                title="Eliminar Usuario (Solo Inactivos)"
                :disabled="user.is_active"
              >
                <TrashIcon class="w-5 h-5 inline" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pagination.last_page > 1" class="flex justify-center items-center space-x-2 mt-6">
      <button
        @click="goToPage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <span class="text-gray-700 dark:text-gray-300">Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
      <button
        @click="goToPage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  </div>

  <ModalDynamic
    :is-open="isToggleStatusModalOpen"
    :title="`Confirmar ${userToToggleStatus?.is_active ? 'Desactivación' : 'Activación'} de Usuario`"
    :content="`¿Estás seguro de que quieres ${userToToggleStatus?.is_active ? 'desactivar' : 'activar'} a &quot;${userToToggleStatus?.name}&quot; (ID: ${userToToggleStatus?.id})?`"
    :type="userToToggleStatus?.is_active ? 'warning' : 'info'"
    @close="isToggleStatusModalOpen = false"
  >
    <template #primary-action>
      <UiButton
        :variant="userToToggleStatus?.is_active ? 'error' : 'success'"
        @click="confirmToggleUserStatus"
        :disabled="toggleStatusLoading"
      >
        <UiSpinner v-if="toggleStatusLoading" class="w-4 h-4 mr-2 text-white" />
        {{ userToToggleStatus?.is_active ? 'Desactivar' : 'Activar' }}
      </UiButton>
    </template>
    <template #secondary-action>
      <UiButton variant="secondary" @click="isToggleStatusModalOpen = false">Cancelar</UiButton>
    </template>
  </ModalDynamic>

  <ModalDynamic
    :is-open="isDeleteUserModalOpen"
    title="Confirmar Eliminación de Usuario"
    :content="`¿Estás seguro de que quieres eliminar al usuario &quot;${userToDelete?.name}&quot; (ID: ${userToDelete?.id})? Esta acción es irreversible.`"
    type="error"
    @close="isDeleteUserModalOpen = false"
  >
    <template #primary-action>
      <UiButton variant="error" @click="confirmDeleteUser" :disabled="deleteLoading">
        <UiSpinner v-if="deleteLoading" class="w-4 h-4 mr-2 text-white" />
        Eliminar
      </UiButton>
    </template>
    <template #secondary-action>
      <UiButton variant="secondary" @click="isDeleteUserModalOpen = false">Cancelar</UiButton>
    </template>
  </ModalDynamic>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import userService from '@/services/userService';
import { useGlobalToast } from '@/composables/useGlobalToast';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiInputSearchWithResults from '@/components/ui/UiInputSearchWithResults.vue';
import ModalDynamic from '@/components/modals/ModalDynamic.vue'; // Importar ModalDynamic
import UiButton from '@/components/ui/UiButton.vue'; // Importar UiButton
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';

// Iconos
import { PencilSquareIcon, TrashIcon, PowerIcon, MagnifyingGlassIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const $toast = useGlobalToast();

// --- Estados reactivos ---
const users = ref([]);
const isLoading = ref(true);
const fetchError = ref(null);
const detailedError = ref(null);
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});
const filters = ref({
  search: '',
  role: '',
  is_active: '',
});
const sort = ref({
  by: 'id',
  order: 'asc',
});

// --- Nuevos estados para la sección de búsqueda por ID ---
const selectedUserForAction = ref(null);
const toggleStatusLoading = ref(false);
const searchQueryForAction = ref(''); // Para limpiar el input de búsqueda después de seleccionar

// --- Estados para los modales de confirmación ---
const isToggleStatusModalOpen = ref(false);
const userToToggleStatus = ref(null); // Usuario sobre el que se realizará la acción de activar/desactivar

const isDeleteUserModalOpen = ref(false);
const userToDelete = ref(null); // Usuario que se va a eliminar
const deleteLoading = ref(false);

// --- Funciones para la lógica de la tabla ---

const fetchUsers = async () => {
  isLoading.value = true;
  fetchError.value = null;
  detailedError.value = null;
  try {
    const response = await userService.getUsers({
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      search: filters.value.search,
      role: filters.value.role,
      is_active: filters.value.is_active,
      sort_by: sort.value.by,
      sort_order: sort.value.order,
    });
    users.value = response.data;
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total,
    };
  } catch (error) {
    fetchError.value = 'No se pudo cargar la lista de usuarios.';
    detailedError.value = error.response?.data?.message || error.message;
    console.error('Error al cargar usuarios:', error);
    $toast.error(fetchError.value);
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetchUsers = debounce(() => {
  pagination.value.current_page = 1;
  fetchUsers();
}, 300);

const sortBy = (column) => {
  if (sort.value.by === column) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sort.value.by = column;
    sort.value.order = 'asc';
  }
  fetchUsers();
};

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page;
    fetchUsers();
  }
};

const editUser = (id) => {
  router.push({ name: 'admin-user-edit', params: { id } });
};

const userDetails = (id) => {
  router.push({ name: 'admin-user-detail', params: { id } });
};

// --- Modales y acciones de confirmación ---

const openDeleteUserModal = (user) => {
  if (user.is_active) {
    $toast.warning('No se puede eliminar un usuario activo. Primero desactívalo.');
    return;
  }
  userToDelete.value = user;
  isDeleteUserModalOpen.value = true;
};

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return;

  deleteLoading.value = true;
  try {
    await userService.deleteUser(userToDelete.value.id);
    $toast.success('Usuario eliminado exitosamente.');
    isDeleteUserModalOpen.value = false;
    userToDelete.value = null; // Limpiar el usuario
    await fetchUsers(); // Refrescar la tabla
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.data || 'Error al eliminar el usuario.';
    $toast.error(errorMessage);
    console.error('Error al eliminar usuario:', error);
  } finally {
    deleteLoading.value = false;
  }
};

const openToggleStatusModal = (user) => {
  if (!user) {
    $toast.warning('Por favor, selecciona un usuario para alternar su estado.');
    return;
  }
  userToToggleStatus.value = user;
  isToggleStatusModalOpen.value = true;
};

// ... (existing script setup)

const confirmToggleUserStatus = async () => {
  if (!userToToggleStatus.value) return;

  toggleStatusLoading.value = true;
  const user = userToToggleStatus.value; // Reference to the user in the modal
  const newStatus = !user.is_active;
  const actionText = newStatus ? 'activar' : 'desactivar';

  try {
    // This is the key change: Access response.data.user directly
    const response = await userService.toggleUserActiveStatus(user.id);
    const updatedUser = response.user; // <<< CHANGE HERE to response.user

    if (!updatedUser) { // Safety check
      throw new Error('API response did not contain the updated user object.');
    }

    // Update the user in the 'users' array of the table
    const indexInUsers = users.value.findIndex(u => u.id === user.id);
    if (indexInUsers !== -1) {
      // Use Object.assign to maintain reactivity
      Object.assign(users.value[indexInUsers], updatedUser);
    }

    // Update the user in 'selectedUserForAction' if it's the same user
    if (selectedUserForAction.value && selectedUserForAction.value.id === user.id) {
      // Use Object.assign to maintain reactivity
      Object.assign(selectedUserForAction.value, updatedUser);
    }

    $toast.success(`Usuario "${user.name}" ${newStatus ? 'activado' : 'desactivado'} exitosamente.`);
    isToggleStatusModalOpen.value = false; // Close the modal
    userToToggleStatus.value = null; // Clear the user from the modal

    // Optional: Re-fetch the entire list for full consistency.
    // This ensures that if any filters or sorting depend on the active status,
    // the table reflects the absolute latest data from the backend.
    await fetchUsers();

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.data || `Error al ${actionText} el usuario.`;
    $toast.error(errorMessage);
    console.error(`Error al ${actionText} usuario:`, error.response?.data || error.message);
  } finally {
    toggleStatusLoading.value = false;
  }
};

// ... (rest of the script)

// --- Lógica para el componente UiInputSearchWithResults ---

const searchUsersByIdOrEmail = async (query) => {
  try {
    // Usamos getUsers para buscar, pero limitamos la cantidad de resultados para el dropdown
    const response = await userService.getUsers({ search: query, per_page: 5 });
    return response.data; // Retorna el array de usuarios para el componente de búsqueda
  } catch (error) {
    console.error('Error searching users by ID or Email:', error);
    $toast.error('Error al buscar usuarios.');
    return [];
  }
};

const formatUserSearchResult = (user) => {
  if (!user) return '';
  return `ID: ${user.id} - ${user.name} (${user.email}) [${user.is_active ? 'Activo' : 'Inactivo'}]`;
};

const handleUserSelectedFromSearch = async (user) => {
  // Cuando el usuario selecciona desde el dropdown, obtenemos los detalles más recientes
  try {
    const fetchedUser = await userService.getUser(user.id);
    selectedUserForAction.value = fetchedUser;
    $toast.info(`Usuario "${fetchedUser.name}" seleccionado para gestión de estado.`);
    searchQueryForAction.value = formatUserSearchResult(fetchedUser); // Pre-llenar el input de búsqueda
  } catch (error) {
    $toast.error('No se pudo cargar los detalles del usuario seleccionado.');
    console.error('Error fetching selected user details:', error);
    selectedUserForAction.value = null;
    searchQueryForAction.value = ''; // Limpiar si falla la carga
  }
};


// --- Lifecycle Hook ---
onMounted(() => {
  fetchUsers();
});

// Watcher para recargar la lista si cambian los filtros o el orden
watch([filters, sort], () => {
  pagination.value.current_page = 1;
  fetchUsers();
}, { deep: true });
</script>

<style scoped>
/* Puedes añadir estilos adicionales aquí si lo deseas */
</style>