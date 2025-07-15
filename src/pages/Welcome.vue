<template>
  <div class="relative min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white p-6 overflow-hidden">

    <div class="absolute inset-0 z-0 opacity-10">
      <svg class="w-full h-full" viewBox="0 0 1440 810" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="1000" cy="100" r="300" fill="white" />
        <circle cx="400" cy="700" r="250" fill="white" />
        <rect x="0" y="0" width="200" height="800" rx="100" fill="white" transform="rotate(45 0 0) translate(0 -200)" />
      </svg>
    </div>

    <div class="relative z-10 text-center max-w-4xl mx-auto">
      <h1 class="text-5xl md:text-6xl font-extrabold mb-4 leading-tight animate-fade-in-down">
        ¡Bienvenido a <span class="text-green-500">RH-flow</span>!
      </h1>
      <p class="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up">
        Gestiona tus recursos, organiza tus datos y optimiza tu trabajo con nuestra plataforma intuitiva y potente.
      </p>

      <div class="space-x-4 animate-scale-in">
        <router-link
          to="auth/login"
          class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-indigo-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Iniciar Sesión
          <font-awesome-icon class="ml-2 bg-indigo-500 text-white rounded-full p-0.5" :icon="['fas', 'chevron-down']" />
        </router-link>
        <router-link
          to="/auth/register"
          class="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-full shadow-lg text-white hover:bg-white hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300"
        >
          Registrarse
          <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </router-link>
      </div>

      <p class="mt-12 text-sm opacity-80 animate-fade-in">
        "La eficiencia es hacer las cosas bien. La eficacia es hacer las cosas correctas."
      </p>
      <p class="text-sm opacity-70">- Peter Drucker</p>
    </div>

    <!--
    <footer class="absolute bottom-4 text-sm opacity-60 z-10 animate-fade-in-up">
      &copy; {{ currentYear }} Tu Aplicación. Todos los derechos reservados.
    </footer>

  -->
  </div>
</template>

<script setup>
import { icon } from '@fortawesome/fontawesome-svg-core';
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

// Aquí puedes añadir más lógica si necesitas, por ejemplo, cargar datos iniciales o manejar eventos.
</script>

<style scoped>
/* Animaciones de entrada simples para un efecto visual agradable */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 1s ease-out forwards;
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
  animation-delay: 0.3s; /* Retraso para que aparezca después del título */
}
.animate-scale-in {
  animation: scale-in 0.8s ease-out forwards;
  animation-delay: 0.6s; /* Retraso para que aparezcan después del subtítulo */
}
.animate-fade-in {
  animation: fade-in-up 1s ease-out forwards;
  animation-delay: 0.9s; /* Retraso para el pie de página/cita */
}
</style>