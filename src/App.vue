<template>
  <div id="app">
    <ToastContainer />

    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        mode="out-in"
        appear
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// Importa el componente ToastContainer. Ajusta la ruta si es necesario.
import ToastContainer from './components/ToastContainer.vue';
</script>

<style>
/* Estilos de transición */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Asegurar que no haya interacciones durante la transición */
body.transitioning * {
  pointer-events: none;
  user-select: none;
}
</style>