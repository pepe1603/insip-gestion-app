<template>
  <ModalDynamic
    :is-open="isOpen"
    @update:is-open="$emit('update:isOpen', $event)"
    type="info"
    title="Contacto de Soporte"
    size="md"
  >
    <template #body>
      <div v-if="cargando" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="ml-3 text-gray-600">Cargando información de contacto...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-600 py-4">
        <p class="font-semibold mb-2">No se pudo cargar la información de contacto.</p>
        <p class="text-sm">Por favor, inténtalo de nuevo más tarde o contacta directamente al equipo de TI.</p>
        <p class="text-xs italic mt-1">Error: {{ error }}</p>
      </div>

      <div v-else-if="contactInfo" class="text-center py-4">
        <p class="text-lg font-semibold text-gray-800 mb-3">¿Necesitas ayuda?</p>
        <p class="text-gray-700 mb-4">Nuestro equipo de soporte está aquí para asistirte.</p>

        <div class="space-y-3">
          <p class="flex items-center justify-center text-gray-700">
            <EnvelopeIcon class="w-5 h-5 mr-2 text-blue-500" />
            Email:
            <a :href="'mailto:' + contactInfo.email" class="ml-2 text-blue-600 hover:underline font-medium">
              {{ contactInfo.email }}
            </a>
          </p>
          <p class="flex items-center justify-center text-gray-700">
            <PhoneIcon class="w-5 h-5 mr-2 text-blue-500" />
            Teléfono:
            <a :href="'tel:' + contactInfo.phone" class="ml-2 text-blue-600 hover:underline font-medium">
              {{ contactInfo.phone }}
            </a>
          </p>
          <p v-if="contactInfo.url" class="flex items-center justify-center text-gray-700">
            <BookOpenIcon class="w-5 h-5 mr-2 text-blue-500" />
            Documentación:
            <a :href="contactInfo.url" target="_blank" rel="noopener noreferrer" class="ml-2 text-blue-600 hover:underline font-medium flex items-center">
              Abrir
              <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-1" />
            </a>
          </p>
        </div>

        <p class="text-sm text-gray-500 mt-6 italic">
          Horario de atención: Lunes a Viernes, 9:00 AM - 5:00 PM (Hora de Tapachula)
        </p>
      </div>
      <div v-else class="text-center text-gray-500 py-4">
        <p>No hay información de contacto disponible.</p>
      </div>
    </template>

    <template #primary-action>
      <UiButton type="button" variant="outline-secondary" @click="$emit('update:isOpen', false)">
        Cerrar
      </UiButton>
    </template>
  </ModalDynamic>
</template>

<script setup>
import { ref, watch } from 'vue';
// Asegúrate de que las rutas sean correctas según la estructura de tu proyecto
import ModalDynamic from './ModalDynamic.vue';
import UiButton from '../../components/ui/UiButton.vue';
import InfoService from '../../services/infoService'; // ¡Tu servicio de información!
import { EnvelopeIcon, PhoneIcon, BookOpenIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:isOpen']);

const contactInfo = ref(null);
const cargando = ref(true);
const error = ref(null);

const fetchContactInfo = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const apiInfo = await InfoService.getSystemInfo(); // Llama a tu InfoService
    if (apiInfo && apiInfo.contact) {
      contactInfo.value = apiInfo.contact; // Extrae solo la parte de contacto
    } else {
      throw new Error('No se encontró información de contacto en la API.');
    }
  } catch (err) {
    console.error('Error al obtener la información de contacto:', err);
    error.value = err.message || 'Error desconocido al cargar el contacto.';
    // InfoService ya debería manejar el toast, no lo duplicamos aquí.
  } finally {
    cargando.value = false;
  }
};

// Observa cuándo la prop `isOpen` cambia a `true` para cargar los datos
watch(() => props.isOpen, (newVal) => {
  if (newVal && !contactInfo.value && !error.value) { // Carga si se abre y aún no se ha cargado o si hubo error.
    fetchContactInfo();
  } else if (!newVal) {
    // Opcional: Reinicia el estado si quieres que los datos se recarguen cada vez que el modal se abre
    // contactInfo.value = null;
    // error.value = null;
    // cargando.value = true;
  }
}, { immediate: true }); // `immediate: true` para que se ejecute una vez al inicio si `isOpen` ya es `true`
</script>

<style scoped>
/* Aquí puedes añadir estilos específicos para este modal si son necesarios */
</style>