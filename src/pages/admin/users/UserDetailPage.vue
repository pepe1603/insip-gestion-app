<template>
  <div class="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
      Detalles del Usuario: {{ user?.name }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Aquí puedes ver toda la información detallada del usuario seleccionado.
      Desde esta vista, también tienes la opción de **editar la información del usuario**
      o **regresar a la lista completa de usuarios**.
    </p>

    <div v-if="isLoading" class="text-center py-8">
      <UiSpinner class="text-indigo-500 w-10 h-10 mx-auto" />
      <p class="text-gray-600 dark:text-gray-400 mt-2">Cargando detalles del usuario...</p>
    </div>
    <div v-else-if="fetchError" class="text-center py-8 text-red-600 dark:text-red-400">
      <p>Error al cargar los detalles del usuario: {{ fetchError }}</p>
      <p v-if="detailedError" class="text-sm">{{ detailedError }}</p>
    </div>
    <div v-else-if="user">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">ID del Usuario:</p>
          <p class="mt-1 text-lg text-gray-900 dark:text-white">{{ user.id }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo:</p>
          <p class="mt-1 text-lg text-gray-900 dark:text-white">{{ user.name }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico:</p>
          <p class="mt-1 text-lg text-gray-900 dark:text-white">{{ user.email }}</p>
          <UiBadge
            :text="user.email_verified_at ? 'Verificado' : 'Sin Verificar'"
            :color="user.email_verified_at ? 'green' : 'yellow'"
            class="mt-1"
          />
          </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Rol Asignado:</p>
          <p class="mt-1 text-lg text-gray-900 dark:text-white capitalize">{{ user.role }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado de la Cuenta:</p>
          <p class="mt-1 text-lg">
            <span :class="{'px-2 inline-flex text-sm leading-5 font-semibold rounded-full': true,
                           'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100': user.is_active,
                           'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100': !user.is_active}">
              {{ user.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </p>
        </div>
        <!-- aqui se muestra si el usuario es vinculado a un empleado -->
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Empleado Vinculado:</p>
          <p class="mt-1 text-lg text-gray-900 dark:text-white">{{ user.empleado_id ? 'Sí' : 'No' }}  </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Creación:</p>
          <p class="mt-1 text-lg text-gray-900 dark:text-white">{{ formatDate(user.created_at) }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Última Actualización:</p>
          <p class="mt-1 text-lg text-gray-900 dark:text-white">{{ formatDate(user.updated_at) }}</p>
        </div>
      </div>

      <div class="mt-8 flex justify-end gap-3">
        <button
          @click="router.push({ name: 'admin-user-list' })"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Volver a la Lista de Usuarios
        </button>
        <button
          @click="router.push({ name: 'admin-user-edit', params: { id: user.id } })"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Editar Información del Usuario
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import userService from '@/services/userService';
import { useGlobalToast } from '@/composables/useGlobalToast';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import UiBadge from '@/components/ui/UiBadge.vue'; // Ruta corregida si es necesario

// Asegúrate de que la ruta sea correcta si tu UiBadge no está directamente en 'components/ui'
// Por ejemplo, si está en 'src/components/ui/UiBadge.vue'
// import UiBadge from '@/components/ui/UiBadge.vue';


const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const { $toast } = useGlobalToast();

const user = ref(null);
const isLoading = ref(true);
const fetchError = ref(null);
const detailedError = ref(null);

const fetchUser = async () => {
  isLoading.value = true;
  fetchError.value = null;
  detailedError.value = null;
  try {
    // Asegúrate de que la respuesta del API incluye 'email_verified_at'
    user.value = await userService.getUser(props.id);
  } catch (error) {
    fetchError.value = 'No se pudo cargar los detalles del usuario.';
    detailedError.value = error.response?.data?.message || error.message;
    console.error('Error fetching user details:', error);
    $toast.error(fetchError.value);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Formato de fecha y hora local. Ajusta según tus necesidades (ej. 'es-MX')
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
/* Puedes añadir estilos adicionales aquí */
</style>