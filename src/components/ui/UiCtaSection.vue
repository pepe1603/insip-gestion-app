<template>
    <div class="bg-background text-textColor">
      <div class="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg viewBox="0 0 1024 1024" class="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
            <circle cx="512" cy="512" r="512" fill="url(#cta-gradient)" fill-opacity="0.7" />
            <defs>
              <radialGradient id="cta-gradient">
                <stop :stop-color="gradientStart" />
                <stop offset="1" :stop-color="gradientEnd" />
              </radialGradient>
            </defs>
          </svg>
          <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 class="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">{{ title }}</h2>
            <p class="mt-6 text-lg/8 text-pretty text-gray-300">{{ description }}</p>
            <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <router-link v-if="primaryLink" :to="primaryLink.to" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{{ primaryLink.label }}</router-link>
              <a v-if="secondaryLink" :href="secondaryLink.href" class="text-sm/6 font-semibold text-white">{{ secondaryLink.label }} <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div v-if="imageSrc" class="relative mt-16 h-80 lg:mt-8">
            <img class="absolute top-0 left-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10" :src="imageSrc" :alt="imageAlt" width="1824" height="1080" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    primaryLink: {
      type: Object,
      default: null,
      validator: (link) => !link || (typeof link.to === 'string' && typeof link.label === 'string'),
    },
    secondaryLink: {
      type: Object,
      default: null,
      validator: (link) => !link || (typeof link.href === 'string' && typeof link.label === 'string'),
    },
    imageSrc: {
      type: String,
      default: '',
    },
    imageAlt: {
      type: String,
      default: 'Imagen de la aplicación',
    },
    gradientStart: {
      type: String,
      default: '#7775D6',
    },
    gradientEnd: {
      type: String,
      default: '#E935C1',
    },
  });
  </script>
  
  <style scoped>
  /* Los estilos base se mantienen aquí */
  </style>