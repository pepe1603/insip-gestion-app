<template>
  <div class="max-w-xl mx-auto space-y-6">
    <div class="md:col-span-2 rounded-xs bg-blue-100 dark:bg-blue-800 border-l-4 border-blue-500 text-blue-700 dark:text-blue-200 p-4 mb-4" role="alert">
      <div class="flex">
        <div class="py-1">
          <svg class="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        </div>
        <div>
          <p class="font-bold">¡Importante!</p>
          <p class="text-sm">Si vas a actualizar tu correo electrónico, Por favor verifica que tengas espacio en tu bandega de entrada.</p>
          <p class="text-sm">El correo registrado se usará para enviar notificaciones y mensajes, además el correo registrado en la cuenta debe coincidir con el correo que proporcionaste cuando te registraste como empleado.</p>
        </div>
      </div>
    </div>

    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
      Editar Información del Perfil
      <button
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
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <UiSpinner class="h-8 w-8 text-indigo-500" />
      <p class="ml-3 text-gray-600 dark:text-gray-300">Cargando datos del perfil...</p>
    </div>

    <div v-else-if="fetchError" class="bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">¡Error!</strong>
      <span class="block sm:inline"> No se pudieron cargar los datos del perfil para edición.</span>
      <p v-if="fetchError" class="text-sm mt-2">{{ fetchError }}</p>
    </div>

    <form v-else @submit.prevent="updateProfile">
      <div class="space-y-4">
        <div>
          <UiInputText
            id="name"
            label="Nombre"
            placeholder="Tu nombre completo"
            v-model="profileForm.name"
            :disabled="!isEditing || isUpdating"
          />
          <p v-if="validationErrors.name" class="mt-1 text-sm text-red-500">{{ validationErrors.name[0] }}</p>
        </div>

        <div>
          <UiInputEmail
            id="email"
            label="Correo Electrónico"
            placeholder="tu.email@example.com"
            v-model="profileForm.email"
            :disabled="!isEditing || isUpdating"
          />
          <p v-if="validationErrors.email" class="mt-1 text-sm text-red-500">{{ validationErrors.email[0] }}</p>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <router-link :to="{ name: 'profile-details' }">
            <UiButton variant="secondary" type="button" :disabled="!isEditing || isUpdating" @click="cancelEdit">
              Cancelar
            </UiButton>
          </router-link>
          <UiButton variant="primary" type="submit" :disabled="!isEditing || isUpdating">
            <UiSpinner v-if="isUpdating" class="inline h-4 w-4 mr-2" />
            {{ isUpdating ? 'Guardando...' : 'Guardar Cambios' }}
          </UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { profileService } from '@/services/profileService';
import UiButton from '@/components/ui/UiButton.vue';
import UiInputText from '@/components/ui/UiInputText.vue';
import UiInputEmail from '@/components/ui/UiInputEmail.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import { useGlobalToast } from '@/composables/useGlobalToast';
import { useRouter } from 'vue-router';
// Importa los íconos necesarios para el candado
import { LockClosedIcon, LockOpenIcon } from '@heroicons/vue/24/outline';


const $toast = useGlobalToast();
const router = useRouter();

const originalProfile = ref({}); // Para guardar los datos originales
const profileForm = reactive({
  name: '',
  email: '',
});

const isLoading = ref(true);
const isUpdating = ref(false);
const fetchError = ref(null);
const validationErrors = ref({});
const isEditing = ref(false); // Estado para controlar el modo de edición

// Lógica de carga de datos inicial
onMounted(async () => {
  try {
    isLoading.value = true;
    const data = await profileService.getProfile();
    // Guardamos los datos originales
    originalProfile.value = { ...data.user };
    profileForm.name = data.user.name;
    profileForm.email = data.user.email;
  } catch (err) {
    console.error("Error al cargar datos del perfil:", err);
    fetchError.value = err.message || 'Error al cargar tu perfil. Intenta de nuevo.';
    $toast?.error('Error al cargar datos del perfil.');
  } finally {
    isLoading.value = false;
  }
});

// Lógica para alternar el modo de edición
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // Si desactivamos el modo de edición, restauramos los valores originales
    profileForm.name = originalProfile.value.name;
    profileForm.email = originalProfile.value.email;
    $toast?.info('Modo edición desactivado. Cambios no guardados han sido descartados.', { duration: 3000 });
  } else {
    $toast?.info('Modo edición activado. Puedes actualizar tu nombre y correo electrónico.', { duration: 5000 });
  }
};

// Lógica para cancelar la edición y volver a la vista
const cancelEdit = () => {
  isEditing.value = false;
  profileForm.name = originalProfile.value.name;
  profileForm.email = originalProfile.value.email;
  //router.push({ name: 'profile-details' }); // No redirigimos aquí, el router-link ya lo hace
};

const updateProfile = async () => {
  isUpdating.value = true;
  validationErrors.value = {};

  try {
    const response = await profileService.updateProfile(profileForm);
    $toast?.success(response.message || 'Perfil actualizado exitosamente.');
    isEditing.value = false; // Desactivar el modo de edición después de guardar
    // Actualizar los datos originales con los nuevos
    originalProfile.value.name = profileForm.name;
    originalProfile.value.email = profileForm.email;
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    if (err.response && err.response.status === 422) {
      validationErrors.value = err.response.data.errors;
      $toast?.error('Por favor, corrige los errores en el formulario.');
    } else {
      $toast?.error(err.response?.data?.message || 'Error al actualizar el perfil.');
    }
  } finally {
    isUpdating.value = false;
  }
};
</script>

<style scoped>
/* No se necesitan estilos específicos */
</style>