<template>
  <div class="bg-gray-50 overflow-hidden  relative">
    <ToastContainer />
    <ModalContainer />

    <LoadingSpinner v-if="isLoadingApp" :message="appLoaderMessage" />

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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useGlobalModal } from './composables/useGlobalModal';
import { useGlobalToast } from './composables/useGlobalToast';
import { useInactivityDetector } from './composables/useInactivityDetector';
import { useUiStore } from './stores/uiStore'; 
import { useI18n } from 'vue-i18n';

import ToastContainer from './components/ToastContainer.vue';
import ModalContainer from './components/ModalContainer.vue';
import OfflineNotificationModal from '@/components/modals/OfflineNotificationModal.vue';
import OnlineReconnectedModal from '@/components/modals/OnlineReconnectedModal.vue';
import LoadingSpinner from './components/LoadingSpinner.vue'; // <-- Asegúrate de que esta ruta es correcta

const $modal = useGlobalModal();
const $toast = useGlobalToast();
const uiStore = useUiStore(); 

const { locale } = useI18n(); 
const isOffline = ref(!navigator.onLine);

// --- Nuevo estado para controlar la visibilidad y mensaje del loader de la app ---
const isLoadingApp = ref(true); 
const appLoaderMessage = ref('Preparando la aplicación...');

useInactivityDetector();

const handleOnline = () => {
  console.log('¡Conexión a Internet recuperada!');
  console.log('handleOnline triggered');
  isOffline.value = false;
};

const handleOffline = () => {
  console.log('¡Sin conexión a Internet!');
  console.log('handleOffline triggered');
  isOffline.value = true;
};

let removeInteractionListeners = null;

onMounted(async () => { // Hacemos onMounted asíncrono
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  console.log('Cargando idioma inicial desde Pinia...');
  locale.value = uiStore.currentLanguage;
  console.log(`App.vue: Idioma inicial cargado desde Pinia: ${locale.value}`);

  const handleFirstUserInteraction = () => {
    uiStore.setUserInteracted(); 
    removeInteractionListeners();
  };

  const addInteractionListeners = () => {
    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);
    window.addEventListener('scroll', handleFirstUserInteraction);
    window.addEventListener('mousemove', handleFirstUserInteraction);
  };

  removeInteractionListeners = () => {
    window.removeEventListener('click', handleFirstUserInteraction);
    window.removeEventListener('keydown', handleFirstUserInteraction);
    window.removeEventListener('scroll', handleFirstUserInteraction);
    window.removeEventListener('mousemove', handleFirstUserInteraction);
  };

  addInteractionListeners();

  // Si ya estamos sin conexión al cargar la app, mostramos el modal de offline
  if (isOffline.value) {
    showOfflineModal();
  }

  // --- Lógica para controlar el loader inicial de la aplicación ---
  try {
    // Simula una carga de datos inicial
    appLoaderMessage.value = 'Iniciando servicios...';
    await new Promise(resolve => setTimeout(resolve, 800)); 

    appLoaderMessage.value = 'Cargando configuraciones...';
    await new Promise(resolve => setTimeout(resolve, 800)); 

    // Aquí iría tu lógica real de carga inicial, por ejemplo:
    // await uiStore.loadUserPreferences(); 
    // await someApiService.fetchInitialData();

    console.log('Inicialización de la aplicación completada.');
  } catch (error) {
    console.error('Error durante la inicialización de la aplicación:', error);
    appLoaderMessage.value = 'Error al cargar la aplicación.';
    // Podrías mantener el loader visible con un mensaje de error o redirigir
    // o simplemente ocultarlo y dejar que la app maneje el error
  } finally {
    isLoadingApp.value = false; // Oculta el loader una vez que todo esté listo o haya fallado
  }
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  if (removeInteractionListeners) {
    removeInteractionListeners();
  }
  if ($modal?.currentOfflineModalId.value) {
    $modal?.hideModal($modal.currentOfflineModalId.value);
  }
  if ($modal?.currentOnlineModalId.value) {
    $modal?.hideModal($modal.currentOnlineModalId.value);
  }
});

const showOfflineModal = async () => {
  console.log('Calling showOfflineModal');
  const result = await $modal?.showModal(
    OfflineNotificationModal,
    {}, 
    { 
      title: 'Estado de la Red', 
      closeOnClickOutside: false,
    }
  );

  if (result?.action === 'confirm' && result?.payload?.action === 'continue_offline') {
    console.log('Usuario eligió continuar navegando sin conexión.');
    $toast.warning(
      'Estás navegando sin conexión. Algunas funciones pueden no estar disponibles.',
      {
        position: 'top-center',
        duration: 10000,
        dismissible: false,
        showLeftBorder: false
      }
    );
  } else if (result?.action === 'duplicate') {
    console.log('Intento de mostrar modal offline, pero ya estaba visible.');
  } else if (result?.action === 'connection_restored_preempt' || result?.action === 'programmatic_close') {
    console.log('Modal de offline cerrado automáticamente por recuperación de conexión o programáticamente.');
  } else {
    console.log('Modal de offline cerrado por otra razón (ej. conexión recuperada antes de decidir o por cierre explícito).');
  }
};

const showOnlineModal = async () => {
  console.log('Calling showOnlineModal');
  const result = await $modal?.showModal(
    OnlineReconnectedModal,
    {},
    { 
      title: '¡Internet Restablecido!', 
      closeOnClickOutside: false
    }
  );
  
  if (result?.action === 'confirm' && result?.payload?.action === 'understood') {
    console.log('Usuario entendió que la conexión se restableció.');
    $toast.success(
      '¡Genial! Tu conexión a internet ha vuelto y está lista.', 
      { 
        position: 'top-center', 
        duration: 7000,
        dismissible: false,
        showLeftBorder: false,
        title: 'Conexión Restablecida'
      }
    );
  } else if (result?.action === 'duplicate') {
    console.log('Intento de mostrar modal online, pero ya estaba visible.');
  } else if (result?.action === 'connection_lost_preempt' || result?.action === 'programmatic_close') {
     console.log('Modal de online cerrado automáticamente por pérdida de conexión o programáticamente.');
  } else {
    console.log('Modal de conexión recuperada cerrado por otra razón.');
  }
};

watch(isOffline, (newVal, oldVal) => {
  console.log('isOffline changed:', newVal);
  if (newVal === true && oldVal === false) {
    showOfflineModal();
  } else if (newVal === false && oldVal === true) {
    showOnlineModal();
  }
});

// --- Observar cambios de tema y actualizar la clase de body ---
watch(() => uiStore.currentTheme, (newTheme) => {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(newTheme);

  // Opcional: Si quieres mostrar el loader brevemente cuando cambia el tema
  // Puedes usarlo para "suavizar" transiciones de elementos no controlados por Tailwind
  // o si el cambio de tema implica recargar recursos o recalcular estilos complejos.
  // isLoadingApp.value = true;
  // appLoaderMessage.value = `Cambiando a tema ${newTheme === 'dark' ? 'oscuro' : 'claro'}...`;
  // setTimeout(() => {
  //   isLoadingApp.value = false;
  // }, 500); // Pequeño retraso para que se vea el loader
}, { immediate: true }); // 'immediate: true' para que se ejecute al inicio
</script>

<style>
/* Estilos existentes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos para los temas en el body */
body.light {
  background-color: #f9fafb; /* bg-gray-50 */
  color: #1f2937; /* text-gray-900 */
}

body.dark {
  background-color: #111827; /* bg-gray-900 */
  color: #f9fafb; /* text-gray-50 */
}

body.transitioning * {
  pointer-events: none;
  user-select: none;
}
</style>