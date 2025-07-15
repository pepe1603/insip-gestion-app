<template>
  <div class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">

    <div class="relative isolate overflow-hidden pt-14">
      <img src="https://images.unsplash.com/photo-1552664730-d307ca8849d1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Oficina moderna con personas trabajando"
        class="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-30 dark:opacity-15" />
      <div class="absolute inset-0 -z-10 bg-indigo-700 dark:bg-indigo-900 opacity-60"></div>

      <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40 relative z-10">
        <div class="lg:pr-8">
          <div class="mx-auto max-w-2xl lg:mx-0">
            <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl text-balance">
              INSIP: Impulsando la Eficiencia de tu Gestión
            </h1>
            <p class="mt-6 text-lg leading-8 text-indigo-100 max-w-xl">
              En INSIP, hemos diseñado una plataforma robusta y amigable para centralizar la **gestión de recursos humanos y clientes**. Facilitamos el control de **vacaciones, asistencias, roles de usuario, vinculación de empleados**, y mucho más. Todo, para que tu organización opere con la máxima fluidez.
            </p>
            <div class="mt-10 flex items-center gap-x-6">
              <router-link to="/caracteristicas" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Descubre sus Capacidades
              </router-link>
              <router-link to="/faq" class="text-sm font-semibold leading-6 text-white hover:underline">
                Preguntas Frecuentes <span aria-hidden="true">→</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

      <section class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">La Esencia de INSIP</h2>
        <p class="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Nacimos de la necesidad de simplificar lo complejo. En un entorno empresarial dinámico, la gestión eficiente de personas y procesos es fundamental. INSIP es nuestra respuesta: una herramienta intuitiva que elimina la fricción, permitiendo que tu equipo se concentre en generar valor.
        </p>
        <p class="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-4">
          **Nuestro compromiso:** Ser el motor que impulsa tu organización, garantizando que cada registro, cada solicitud de vacaciones y cada asignación de rol se realice con precisión y sin esfuerzo.
        </p>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-center size-12 rounded-full bg-indigo-500 text-white mx-auto mb-4">
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a4 4 0 014-4h12.55m-4.632-1.632a4.5 4.5 0 11-6.364-6.364m-1.07-1.07l3.913-3.913a4.5 4.5 0 016.364 6.364l-3.913 3.913z"></path></svg>
          </div>
          <h3 class="font-semibold text-xl text-center mb-2 text-gray-800 dark:text-white">Recursos Humanos Integrado</h3>
          <p class="text-gray-700 dark:text-gray-300 text-center text-sm">Gestiona eficientemente a tus empleados, sus perfiles, y su vinculación con los usuarios del sistema.</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-center size-12 rounded-full bg-indigo-500 text-white mx-auto mb-4">
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-4 4V3m-2 4h4m4 0H8m-2 0H6m-4 4h20M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"></path></svg>
          </div>
          <h3 class="font-semibold text-xl text-center mb-2 text-gray-800 dark:text-white">Asistencias y Ausencias Simplificadas</h3>
          <p class="text-gray-700 dark:text-gray-300 text-center text-sm">Administra horarios, registros de entrada/salida y solicitudes de vacaciones con pocos clics.</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-center size-12 rounded-full bg-indigo-500 text-white mx-auto mb-4">
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h3 class="font-semibold text-xl text-center mb-2 text-gray-800 dark:text-white">Control de Usuarios y Roles</h3>
          <p class="text-gray-700 dark:text-gray-300 text-center text-sm">Asigna permisos y roles a tus usuarios, desde administradores hasta empleados y supervisores.</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-center size-12 rounded-full bg-indigo-500 text-white mx-auto mb-4">
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h7.5A4.5 4.5 0 0021 15.5V9.456c0-1.125-.604-2.197-1.66-2.753L15 4.498a2.25 2.25 0 00-2.002-.303l-3.324.97A2.25 2.25 0 007.5 5.91V19z"></path></svg>
          </div>
          <h3 class="font-semibold text-xl text-center mb-2 text-gray-800 dark:text-white">Visibilidad Total y Control</h3>
          <p class="text-gray-700 dark:text-gray-300 text-center text-sm">Obtén una visión clara del estado de tus recursos y toma decisiones informadas con facilidad.</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-center size-12 rounded-full bg-indigo-500 text-white mx-auto mb-4">
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10m0 0h4m-4 0l-2-2m2 2l2 2m7-14l-2 2m2-2h4m-4 0l2 2m-2-2l-2-2M15 5v10m0 0h4m-4 0l-2-2m2 2l2 2"></path></svg>
          </div>
          <h3 class="font-semibold text-xl text-center mb-2 text-gray-800 dark:text-white">Diseño Flexible y Escalable</h3>
          <p class="text-gray-700 dark:text-gray-300 text-center text-sm">INSIP crece contigo, adaptándose a las necesidades de tu organización sin importar su tamaño.</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div class="flex items-center justify-center size-12 rounded-full bg-indigo-500 text-white mx-auto mb-4">
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944c-1.255 0-2.502.261-3.66.757L6.5 4.5M3.6 7.4L2.21 6.012a2 2 0 00-2.828 2.828l1.414 1.414M16.4 7.4l1.39-1.388a2 2 0 012.828 2.828L19.4 9.4M12 15a4 4 0 100-8 4 4 0 000 8z"></path></svg>
          </div>
          <h3 class="font-semibold text-xl text-center mb-2 text-gray-800 dark:text-white">Seguridad de Datos</h3>
          <p class="text-gray-700 dark:text-gray-300 text-center text-sm">Protegemos tu información con los más altos estándares de seguridad y confidencialidad.</p>
        </div>
      </section>

      <section class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">Sumérgete en el Mundo INSIP</h2>
        <div class="flex flex-wrap justify-center gap-6">
          <router-link to="/historial-actualizaciones" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-200">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 13V1a8 8 0 0012 6.55"></path></svg>
            Historial de Actualizaciones
          </router-link>
          <router-link to="/casos-de-exito" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m-2-2h2m-2 2L9 9m2-2h2m-2 2L9 9m-2 2h2m-2 2L9 9m-2 2h2m-2 2L9 9m-2 2h2m-2 2L9 9"></path></svg>
            Casos de Éxito
          </router-link>
          <router-link to="/documentacion-api" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0015.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zm-2.5-7.5h5M12 18v.01"></path></svg>
            Documentación API
          </router-link>
        </div>
      </section>

      <section class="relative isolate overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 p-8 shadow-inner text-center">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          ¿Interesado en cómo INSIP puede transformar tu gestión?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Estamos aquí para responder todas tus preguntas y explorar cómo nuestra plataforma se adapta a tus necesidades específicas.
        </p>
        <router-link to="/contacto" class="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-teal-600 dark:hover:bg-teal-700">
          Hablemos de tu Proyecto
        </router-link>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
// No se requieren imports adicionales. Tailwind CSS y Vue Router se encargan del resto.
</script>

<style scoped>
/* Estilos muy específicos o overrides si es necesario, pero Tailwind maneja la mayoría */
</style>