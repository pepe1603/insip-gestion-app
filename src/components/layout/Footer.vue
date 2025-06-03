<template>
  
  <footer class="bg-background text-textColor min-h-max mt-8 text-white pt-10 pb-4">
    <logos-cloud /> <!-- Componente de LogosCloud -->
    
    <div class="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
      <!-- Izquierda -->
      <p class="text-sm">&copy; {{ year }} MiApp. Todos los derechos reservados.</p>

      <!-- Derecha -->
      <div class="mt-2 sm:mt-0 flex space-x-4">
        <router-link to="/" class="hover:text-buttonText transition-colors duration-200">Inicio</router-link>
        <router-link to="/about" class="hover:text-buttonText transition-colors duration-200">Acerca</router-link>
        <router-link to="/admin" class="hover:text-buttonText transition-colors duration-200">Admin</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import LogosCloud from '../LogosCloud.vue' // Asegúrate de importar el componente LogosCloud
const year = new Date().getFullYear()
</script>
