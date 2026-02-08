<template>
  <div class="w-full p-4 sm:max-w-md md:max-w-xl lg:max-w-3xl sm:px-8">
    <div class="space-x-4 mb-4 sm:mb-10">
      <h1 class="text-2xl sm:text-4xl font-bold">Iniciar sesión</h1>
      <p class="text-gray-600 text-sm sm:text-base">welcome back to the app</p>
    </div>

    <form @submit.prevent="handleLogin" class="mt-4 flex flex-col items-center text-sm sm:text-base">

      <UiInputEmail label="Email Address" class="mb-4 " v-model="email" placeholder="example@example.com" :required="true" />
      <UiInputPassword label="Password" class="mb-2" v-model="password" placelholder="password-example" :required="true"/>

      <div class="w-full flex justify-between text-xs sm:text-sm mb-6 sm:mb-12">
        <span class="text-indigo-500 hover:underline hover:text-indigo-700" @click="handleForgotMyPass" >Forgot Password?</span>
        <p class="flex text-gray-600 gap-2">You haven't Account?,<router-link class="text-indigo-500 hover:text-indigo-700 hover:underline" to="/auth/register">create one now</router-link></p>
      </div>

      <UiButton type="submit" size="md" variant="primary" :disabled=isLoading > <UiSpinner v-if="isLoading" class="text-current size-4 mr-1" /> Iniciar Sesión</UiButton>

    </form>

    <UiDivider label="Or" class="my-8" />

    <div class="self-center flex flex-col items-center gap-2">
      <div class="text-xs sm:text-sm border border-gray-300 rounded-md px-4 py-2 5 text-gray-600 hover:bg-gray-600 hover:text-white text-center w-2/3">
        <font-awesome-icon :icon="['fab', 'google']" class="text-lg mr-2"/>
        use Google Account</div>
      <div class="text-xs sm:text-sm border border-gray-300 rounded-md px-4 py-2 5 text-gray-600 hover:bg-gray-600 hover:text-white text-center w-2/3">
        <font-awesome-icon :icon="['fab', 'facebook-square']" class="text-lg mr-2" />
        use Facebook Account</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import UiInputEmail from '../../components/ui/UiInputEmail.vue';
import UiInputPassword from '../../components/ui/UiInputPassword.vue';
import UiDivider from "@/components/ui/UiDivider.vue";
import UiButton from "@/components/ui/UiButton.vue";
import { useGlobalToast } from '../../composables/useGlobalToast';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import { useGlobalModal } from '../../composables/useGlobalModal';
import WarningMessageModal from '../../components/modals/WarningMessageModal.vue';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore();
const isLoading=ref(false);
const $toast = useGlobalToast();
const $modal = useGlobalModal();

const showToast = () => {
  $toast?.success('¡Bienvenido al sistema!, Es un gusto tenerte de vuelta.');
};


const handleForgotMyPass = () => {

  $modal?.showModal(
    WarningMessageModal,
      {
        message: 'Si recargas o cierras la página una vez que hayas inciado el proceso de recuperacion de tu cuenta, se reiniciara el proceso de recuperación desde el principio.',
        buttonText: 'Entendido'
      },
      {
        title: 'Aviso de Recuperacion de Cuenta',
        closeOnClickOutside: false,
      }
    ).then(() => {
      router.push('/auth/forgot-password');
    });
  
};

const handleLogin = async () => {
  isLoading.value=true;
  try {
    const loginResult = await auth.login({ email: email.value, password: password.value });
    
    if (loginResult === 'CHANGE_PASSWORD_REQUIRED') {
      // Redirigir a la página de cambio de contraseña forzado
      $toast.info('Debe cambiar su contraseña para continuar.');
      router.push({ name: 'force-password-change' }); // Usamos el nombre de la nueva ruta
    } else if (loginResult === 'LOGIN_SUCCESS') {
      // Login normal exitoso
      router.push('/profile'); // O a tu dashboard principal
      showToast();
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    // Aquí podrías usar un toast o modal para mostrar un error de login
    $toast.error('Error desconocido al iniciar sesión.');
    $toast.error(error.response.data?.message || 'Error desconocido al iniciar sesión.');
  }
  finally {
    isLoading.value=false;
  }
};
</script>

<style scoped>
/* Tu estilo aquí */
</style>