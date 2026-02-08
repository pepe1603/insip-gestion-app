<template>
  <div
    class="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <div class="max-w-md">
      <img
        src="@/assets/maintenance.svg"
        alt="Mantenimiento"
        class="w-full max-w-xs mx-auto mb-8 dark:invert"
      />
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        🛠️ Mantenimiento en curso
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">{{ mensaje }}</p>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Última actualización: {{ lastDeploymentFormatted }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'

const mensaje = ref('Estamos trabajando para mejorar tu experiencia. Vuelve pronto.')
const lastDeployment = ref(null)

// Computed para formatear la fecha, priorizando variable de entorno
const lastDeploymentFormatted = computed(() => {
  // Prioriza la variable de entorno VITE_LAST_DEPLOYMENT_DATE
  const envDate = import.meta.env.VITE_LAST_DEPLOYMENT_DATE
  const dateToFormat = envDate || lastDeployment.value
  if (!dateToFormat) return '-'

  try {
    // Formateo con date-fns (dd de MMMM yyyy, HH:mm)
    return format(new Date(dateToFormat), "dd 'de' MMMM yyyy, HH:mm")
  } catch {
    return '-'
  }
})

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/info')
    if (data?.message) mensaje.value = data.message
    if (data?.last_deployment_date) lastDeployment.value = data.last_deployment_date
  } catch (e) {
    console.error('Error al obtener la info del sistema:', e)
  }
})
</script>
