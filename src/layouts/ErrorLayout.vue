<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-between">
    <!-- Header con el logo de error -->
    <!-- Contenido del error -->
    <main class="flex flex-col items-center justify-center flex-1">
      <router-view></router-view> <!-- Aquí se renderiza el contenido específico del error -->
    </main>

    <!-- Footer con información adicional -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="text-center">
        <p class="text-sm">&copy; 2025 Mi Aplicación. Todos los derechos reservados.</p>
      </div>
    </footer>
  

  </div>
</template>

<script setup>
// No se necesita lógica adicional en este layout

</script>

<style scoped>
/* Puedes agregar algún estilo adicional si es necesario */
</style>
