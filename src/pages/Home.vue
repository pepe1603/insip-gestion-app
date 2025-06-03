<template>
  <div class="bg-gray-100 text-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
    <div class="mx-auto max-w-7xl py-12 sm:py-20 lg:py-24">
      <div class="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <svg viewBox="0 0 1024 1024" class="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
          <circle cx="512" cy="512" r="512" fill="url(#main-cta-gradient)" fill-opacity="0.7" />
          <defs>
            <radialGradient id="main-cta-gradient">
              <stop stop-color="#7775D6" />
              <stop offset="1" stop-color="#E935C1" />
            </radialGradient>
          </defs>
        </svg>

        <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
          <h2 class="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            Optimiza tu experiencia. Empieza hoy mismo.
          </h2>
          <p class="mt-6 text-lg leading-8 text-pretty text-gray-300">
            Descubre cómo nuestra aplicación puede transformar tu día a día, simplificando tus tareas y aumentando tu productividad.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <router-link to="/registro" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Comenzar ahora
            </router-link>
            <router-link to="/caracteristicas" class="text-sm font-semibold leading-6 text-white">
              Saber más <span aria-hidden="true">→</span>
            </router-link>
          </div>
        </div>
        <div class="relative mt-16 h-80 lg:mt-8">
          <img class="absolute top-0 left-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10" src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png" alt="Captura de pantalla de la aplicación" width="1824" height="1080" />
        </div>
      </div>
    </div>

    <div class="mt-16 w-full max-w-4xl text-center">
      <h3 class="text-2xl font-bold text-gray-800 mb-4">Lo que puedes lograr con nosotros</h3>
      <p class="text-lg text-gray-600 mb-8">
        Nuestra plataforma está diseñada para ofrecerte herramientas intuitivas y potentes que te ayudarán a alcanzar tus objetivos de manera más eficiente.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="font-semibold text-xl mb-2">Simplicidad</h4>
          <p class="text-gray-700 text-sm">Interfaz limpia y fácil de usar, reduce la curva de aprendizaje.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="font-semibold text-xl mb-2">Eficiencia</h4>
          <p class="text-gray-700 text-sm">Automatiza tareas y gestiona tu trabajo con menos esfuerzo.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h4 class="font-semibold text-xl mb-2">Control</h4>
          <p class="text-gray-700 text-sm">Obtén una visión clara de tus operaciones y toma decisiones informadas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No necesitas importar el CtaSection.vue aquí,
// ya que el código se ha integrado directamente.
</script>

<style scoped>
/* No se necesitan estilos con "scoped" a menos que quieras sobrescribir
   clases de Tailwind o añadir animaciones muy específicas.
   Tailwind CSS ya maneja el diseño. */
</style>