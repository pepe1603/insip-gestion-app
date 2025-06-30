<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
  message: {
    type: String,
    default: 'Tu sesión ha expirado. Serás redirigido al inicio de sesión.',
  },
  countdown: {
    type: Number,
    default: 5, // Segundos antes de redirigir automáticamente
  },
  redirectNow: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['confirm']);
const secondsLeft = ref(props.countdown);

const router = useRouter();

const redirectToLogin = () =>{
    router.push('/');
}

const handleConfirm = () =>{
    emit('confirm'); // Disparamos confirmación al terminar cuenta regresiva
    emit('close');
    redirectToLogin();
};

onMounted(() => {
  const interval = setInterval(() => {
    secondsLeft.value--;

    if (secondsLeft.value <= 0) {
      clearInterval(interval);
      handleConfirm();      
    }
  }, 1000);
});
</script>

<template>
  <div class="space-y-4">
    <p class="text-gray-800 dark:text-gray-100">{{ message }}</p>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Redirigiendo en <span class="font-semibold">{{  secondsLeft }}  </span> segundos...
    </p>

    <button
      @click="handleConfirm"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Iniciar Sesión ahora
    </button>
  </div>
</template>
