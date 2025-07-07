<template>

  <footer class="bg-white text-sm ">
    <!-- Componente de LogosCloud -->

    <div class="mx-auto px-2 md:px-14">

      <div class="w-full border-b border-b-gray-200 py-10">

          <LogosCloud />
        
        
      </div>

      <div class="w-full flex flex-col py-4 sm:flex-row justify-between items-center">
         <!-- Izquierda -->
        <div class="flex items-center space-x-2 mb-2 sm:mb-0">
          <span class="text-gray-500">© {{ year }} INSIP</span>
          <span class="text-gray-500">|</span>
          <span class="text-gray-500">Todos los derechos reservados</span>
          <span class="text-gray-500">|</span>
          <span class="text-gra600">Powered by</span>
          <a href="Soucer.imporber" target="_blank" class="text-indigo-600 hover:underline">Source Improved Plants</a>
          </div>
        

        <!-- Derecha -->
        <div class="mt-2 sm:mt-0 flex space-x-4">
          <router-link to="/" class="hover:text-indigo-600 transition-colors duration-200">Inicio</router-link>
          <router-link to="/about" class="hover:text-indigo-600 transition-colors duration-200">Acerca</router-link>
          <router-link to="/admin" class="hover:text-indigo-600 transition-colors duration-200">Admin</router-link>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import LogosCloud from '../LogosCloud.vue' // Asegúrate de importar el componente LogosCloud
const year = new Date().getFullYear()
</script>
