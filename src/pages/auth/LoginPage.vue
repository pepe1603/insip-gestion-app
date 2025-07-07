<template>
  <div class="w-full  p-4 sm:max-w-md md:max-w-xl lg:max-w-3xl sm:px-8">
    <div class="space-x-4 mb-4 sm:mb-10">
      <h1 class="text-2xl sm:text-4xl font-bold ">Iniciar sesión</h1>
      <p class="text-gray-600 text-sm sm:text-base">welcome back to the app</p>
    </div>

    <form @submit.prevent="handleLogin" class="mt-4 flex flex-col items-center text-sm sm:text-base">

      <UiInputEmail label="Email Address" class="mb-4 " v-model="email" required="true" placeholder="example@example.com"/>
      <UiInputPassword label="Password" class="mb-2" v-model="password" placelholder="password-example" />

      <div class="w-full flex justify-between text-xs sm:text-sm mb-6 sm:mb-12">
        <router-link class="text-indigo-500 hover:underline hover:text-indigo-700" to="/auth/forgot-password">Forgot Password?</router-link>
        <p class="flex text-gray-600 gap-2">You haven't Account?,<router-link class="text-indigo-500 hover:text-indigo-700 hover:underline" to="/auth/register">create one now</router-link></p>
      </div>

      <UiButton type="submit" variant="primary" >Iniciar Sesión</UiButton>

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

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore(); // ⬅️ tu store de auth

const $toast = useGlobalToast();

  const showToast = () => {
    $toast?.success('¡Bienvenido al sistema!, Es un gusto tenerte de vuelta.');
  };

const handleLogin = async () => {
  try {
    await auth.login({ email: email.value, password: password.value });
    
    router.push('/profile');
    showToast();

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    // Aquí podrías usar un toast o modal para mostrar un error de login
    $toast.error(error.response.data?.message);
  }
};
</script>


<style scoped>

</style>
