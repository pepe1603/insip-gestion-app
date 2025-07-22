<template>
    <div class="server-error text-center bg-red-100 p-4 rounded dark:bg-red-900">
      <h2>500 - Error del servidor</h2>
      <p>Hubo un problema al procesar tu solicitud. Por favor, intenta más tarde.</p>
      <router-link to="/">Volver al inicio</router-link>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .server-error {
    margin-top: 50px;
    font-size: 1.2rem;
    color: #333;
  }
  
  .server-error h2 {
    font-size: 2rem;
    color: #ff0000;
  }
  
  .server-error a {
    text-decoration: none;
    color: #007bff;
  }
  </style>
  