<template>
    <div class="relative min-h-screen w-full flex flex-col inter-uniquifier">
      <!-- Navbar fijo en la parte superior -->
      <header class="fixed top-0 left-0 right-0 z-20 ">
        <Navbar />
      </header>
  
      <!-- Contenido principal, con desplazamiento hacia abajo -->
      <div class="pt-14.5 flex-1 ">
        <main class="min-h-full max-w-full">
          <!-- Transición de las rutas con desvanecimiento -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in" appear>
              <!-- Aquí renderizamos el componente cargado con la transición -->
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      <!-- Footer -->
        <div class="max-w-full">
          <Footer />
        </div>
      </div>
  

    </div>
  </template>
  
  <script setup>
    // Importamos los componentes necesarios
    import Navbar from '../components/layout/Navbar.vue'
    import Footer from '../components/layout/Footer.vue'
  </script>
  
  <style>
    /* Estilos de transición de desvanecimiento (fade) */
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.4s ease;
    }
  
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  
    /* Prevenir interacciones durante la transición */
    body.transitioning * {
      pointer-events: none;
      user-select: none;
    }
  
    /* Evitar que la barra de desplazamiento sea visible pero mantener la capacidad de desplazamiento */
    html, body {
      height: 100%;
      margin: 0;
    }
  
    main {
      flex: 1;
      overflow-y: scroll; /* Permite el desplazamiento */
     /* padding-right: 10px;*/ /* Agrega un pequeño espacio para evitar que el contenido quede pegado a la barra invisible */
    }
  
    /* Hacer invisible la barra de desplazamiento */
    ::-webkit-scrollbar {
      width: 0px;  /* Elimina la visibilidad de la barra de desplazamiento */
    }
  
    ::-webkit-scrollbar-track {
      background: transparent;  /* Fondo transparente para el track (parte o fondo de la barra de desplazamiento) */
    }
  
    ::-webkit-scrollbar-thumb {
      background: transparent;  /* Sin color para el thumb (barra deslizante) */
    }
  
    /* Aseguramos que el contenido aún sea desplazable */
    main::-webkit-scrollbar {
      display: none; /* Oculta la barra de desplazamiento en navegadores compatibles */
    }
  </style>
  